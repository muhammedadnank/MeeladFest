import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/activity';
import GroupEntry from '@/models/GroupEntry';
import Item from '@/models/Item';
import Team from '@/models/Team';

// GET: List all group entries for a fest
export async function GET(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId') || '';
    const itemId = searchParams.get('itemId') || '';

    const query: any = { festId };
    if (teamId) query.teamId = teamId;
    if (itemId) query.itemId = itemId;

    const groupEntries = await GroupEntry.find(query)
      .populate('teamId', 'name code color')
      .populate({
        path: 'itemId',
        select: 'name categoryId type',
        populate: { path: 'categoryId', select: 'name' },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ groupEntries });
  } catch (error: any) {
    console.error('Error fetching group entries:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new group entry
export async function POST(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess || (!permissions.isOwner && !permissions.canParticipants)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = await req.json();
    const { itemId, teamId, participants = [] } = body;

    if (!itemId || !teamId || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: 'Group item, team, and at least one participant are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify item is a group item
    const item = await Item.findOne({ _id: itemId, festId, type: 'group' });
    if (!item) {
      return NextResponse.json({ error: 'Invalid or non-group item selected' }, { status: 400 });
    }

    // Verify team
    const team = await Team.findOne({ _id: teamId, festId });
    if (!team) {
      return NextResponse.json({ error: 'Selected team not found' }, { status: 400 });
    }

    // Check if team already registered a group entry for this item
    const existingEntry = await GroupEntry.findOne({ festId, itemId, teamId });
    if (existingEntry) {
      return NextResponse.json(
        { error: `Team "${team.name}" has already registered a group entry for item "${item.name}".` },
        { status: 400 }
      );
    }

    // Format and validate participants list
    const formattedParticipants = participants.map((p: any) => ({
      name: (p.name || '').trim(),
      chestNo: p.chestNo ? p.chestNo.trim() : undefined,
    })).filter((p: any) => p.name.length > 0);

    if (formattedParticipants.length === 0) {
      return NextResponse.json({ error: 'Participant names cannot be empty' }, { status: 400 });
    }

    const groupEntry = await GroupEntry.create({
      festId,
      itemId,
      teamId,
      participants: formattedParticipants,
      addedBy: session.user.id,
    });

    await groupEntry.populate([
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
      action: 'created_group_entry',
      entityType: 'group_entry',
      entityId: groupEntry._id.toString(),
      summary: `Created group entry for team "${team.name}" in "${item.name}"`,
    });

    return NextResponse.json({ groupEntry }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating group entry:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Group entry already exists for this team and item' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
