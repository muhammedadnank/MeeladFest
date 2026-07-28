import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
import Result from '@/models/Result';
import Participant from '@/models/Participant';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const { festId } = await params;
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const fest = await Fest.findById(festId);
    if (!fest || fest.isDeleted) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const query: any = { festId, itemType: 'single', participantId: { $ne: null } };
    if (categoryId) query.categoryId = categoryId;

    const results = await Result.find(query)
      .populate('participantId', 'name chestNo phone')
      .populate('teamId', 'name code color')
      .populate('categoryId', 'name');

    const participantStatsMap: Record<
      string,
      {
        participant: any;
        team: any;
        category: any;
        totalPoints: number;
        firstCount: number;
        secondCount: number;
        thirdCount: number;
      }
    > = {};

    results.forEach((r) => {
      if (!r.participantId) return;
      const pid = r.participantId._id.toString();

      if (!participantStatsMap[pid]) {
        participantStatsMap[pid] = {
          participant: r.participantId,
          team: r.teamId,
          category: r.categoryId,
          totalPoints: 0,
          firstCount: 0,
          secondCount: 0,
          thirdCount: 0,
        };
      }

      participantStatsMap[pid].totalPoints += r.points;
      if (r.position === 1) participantStatsMap[pid].firstCount += 1;
      if (r.position === 2) participantStatsMap[pid].secondCount += 1;
      if (r.position === 3) participantStatsMap[pid].thirdCount += 1;
    });

    const list = Object.values(participantStatsMap);

    // Sort by totalPoints desc, then position counts
    list.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.firstCount !== a.firstCount) return b.firstCount - a.firstCount;
      if (b.secondCount !== a.secondCount) return b.secondCount - a.secondCount;
      return b.thirdCount - a.thirdCount;
    });

    // Assign rank with tie support
    let currentRank = 1;
    const rankedChampionship = list.map((item, index) => {
      if (
        index > 0 &&
        item.totalPoints === list[index - 1].totalPoints &&
        item.firstCount === list[index - 1].firstCount &&
        item.secondCount === list[index - 1].secondCount
      ) {
        return { ...item, rank: currentRank };
      } else {
        currentRank = index + 1;
        return { ...item, rank: currentRank };
      }
    });

    return NextResponse.json({ championship: rankedChampionship });
  } catch (error: any) {
    console.error('Error calculating championship leaderboard:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
