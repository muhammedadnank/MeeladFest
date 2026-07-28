import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/activity';
import GroupEntry from '@/models/GroupEntry';
import Result from '@/models/Result';

// PATCH: Update group entry participants
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ festId: string; groupEntryId: string }> }
) {
  try {
    const { festId, groupEntryId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess || (!permissions.isOwner && !permissions.canParticipants)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = await req.json();
    const { participants = [] } = body;

    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 });
    }

    await connectDB();

    const existingEntry = await GroupEntry.findOne({ _id: groupEntryId, festId });
    if (!existingEntry) {
      return NextResponse.json({ error: 'Group entry not found' }, { status: 404 });
    }

    const formattedParticipants = participants.map((p: any) => ({
      name: (p.name || '').trim(),
      chestNo: p.chestNo ? p.chestNo.trim() : undefined,
    })).filter((p: any) => p.name.length > 0);

    if (formattedParticipants.length === 0) {
      return NextResponse.json({ error: 'Participant names cannot be empty' }, { status: 400 });
    }

    existingEntry.participants = formattedParticipants;
    await existingEntry.save();

    await existingEntry.populate([
      { path: 'teamId', select: 'name code color' },
      {
        path: 'itemId',
        select: 'name categoryId type',
        populate: { path: 'categoryId', select: 'name' },
      },
    ]);

    await logActivity({
      festId,
      userId: session.user.id,
      role: permissions.role as 'owner' | 'subadmin',
      action: 'updated_group_entry',
      entityType: 'group_entry',
      entityId: groupEntryId,
      summary: `Updated group entry for team "${(existingEntry.teamId as any)?.name}"`,
    });

    return NextResponse.json({ groupEntry: existingEntry });
  } catch (error: any) {
    console.error('Error updating group entry:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove group entry
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; groupEntryId: string }> }
) {
  try {
    const { festId, groupEntryId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess || (!permissions.isOwner && !permissions.canParticipants)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await connectDB();

    const existingEntry = await GroupEntry.findOne({ _id: groupEntryId, festId });
    if (!existingEntry) {
      return NextResponse.json({ error: 'Group entry not found' }, { status: 404 });
    }

    // Check if group entry has result
    const resultCount = await Result.countDocuments({
      festId,
      groupEntryId,
    });

    if (resultCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete group entry that has competition results registered. Remove the result first.',
        },
        { status: 400 }
      );
    }

    await GroupEntry.deleteOne({ _id: groupEntryId, festId });

    await logActivity({
      festId,
      userId: session.user.id,
      role: permissions.role as 'owner' | 'subadmin',
      action: 'deleted_group_entry',
      entityType: 'group_entry',
      entityId: groupEntryId,
      summary: `Deleted group entry for team "${(existingEntry.teamId as any)?.name}"`,
    });

    return NextResponse.json({ message: 'Group entry deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting group entry:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
