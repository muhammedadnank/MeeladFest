import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Team from '@/models/Team';
import Participant from '@/models/Participant';
import GroupEntry from '@/models/GroupEntry';
import Result from '@/models/Result';
import { getFestPermission } from '@/lib/permissions';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ festId: string; teamId: string }> }
) {
  try {
    const { festId, teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, color } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (color !== undefined) updateData.color = color.trim();

    const team = await Team.findOneAndUpdate(
      { _id: teamId, festId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; teamId: string }> }
) {
  try {
    const { festId, teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if team is referenced in Participants, GroupEntries, or Results
    const [participantCount, groupEntryCount, resultCount] = await Promise.all([
      Participant.countDocuments({ festId, teamId }),
      GroupEntry.countDocuments({ festId, teamId }),
      Result.countDocuments({ festId, 'singleResults.teamId': teamId }),
    ]);

    if (participantCount > 0 || groupEntryCount > 0 || resultCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete team: it is referenced by existing participants, group entries, or results. Remove those records first.',
        },
        { status: 409 }
      );
    }

    const team = await Team.findOneAndDelete({ _id: teamId, festId });
    if (!team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Team deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
