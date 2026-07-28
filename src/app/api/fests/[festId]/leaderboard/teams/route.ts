import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
import Team from '@/models/Team';
import Result from '@/models/Result';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const { festId } = await params;
    await connectDB();

    const fest = await Fest.findById(festId);
    if (!fest || fest.isDeleted) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const teams = await Team.find({ festId }).sort({ name: 1 });
    const results = await Result.find({ festId });

    // Aggregate points per team
    const teamStatsMap: Record<
      string,
      {
        team: any;
        totalPoints: number;
        firstCount: number;
        secondCount: number;
        thirdCount: number;
      }
    > = {};

    teams.forEach((t) => {
      teamStatsMap[t._id.toString()] = {
        team: {
          _id: t._id,
          name: t.name,
          code: t.code,
          color: t.color,
        },
        totalPoints: 0,
        firstCount: 0,
        secondCount: 0,
        thirdCount: 0,
      };
    });

    results.forEach((r) => {
      const tid = r.teamId.toString();
      if (teamStatsMap[tid]) {
        teamStatsMap[tid].totalPoints += r.points;
        if (r.position === 1) teamStatsMap[tid].firstCount += 1;
        if (r.position === 2) teamStatsMap[tid].secondCount += 1;
        if (r.position === 3) teamStatsMap[tid].thirdCount += 1;
      }
    });

    const leaderboardList = Object.values(teamStatsMap);

    // Sort by totalPoints desc, then firstCount desc, then secondCount desc
    leaderboardList.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.firstCount !== a.firstCount) return b.firstCount - a.firstCount;
      if (b.secondCount !== a.secondCount) return b.secondCount - a.secondCount;
      return b.thirdCount - a.thirdCount;
    });

    // Assign rank with tie support
    let currentRank = 1;
    const rankedLeaderboard = leaderboardList.map((item, index) => {
      if (
        index > 0 &&
        item.totalPoints === leaderboardList[index - 1].totalPoints &&
        item.firstCount === leaderboardList[index - 1].firstCount &&
        item.secondCount === leaderboardList[index - 1].secondCount
      ) {
        // Equal rank for tie
        return { ...item, rank: currentRank };
      } else {
        currentRank = index + 1;
        return { ...item, rank: currentRank };
      }
    });

    return NextResponse.json({ leaderboard: rankedLeaderboard });
  } catch (error: any) {
    console.error('Error calculating team leaderboard:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
