import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/activity';
import Result from '@/models/Result';
import Item from '@/models/Item';
import Participant from '@/models/Participant';
import GroupEntry from '@/models/GroupEntry';

// Standard point values for single & group items
const DEFAULT_POINTS = {
  single: { 1: 5, 2: 3, 3: 1 },
  group: { 1: 10, 2: 6, 3: 2 },
};

import { getFestBySlugOrId } from '@/lib/getFest';

// GET: List all declared results for a fest (Public)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const { festId: slugOrId } = await params;
    await connectDB();

    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }
    const festId = fest._id;

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const categoryId = searchParams.get('categoryId');
    const teamId = searchParams.get('teamId');

    const query: any = { festId };
    if (itemId) query.itemId = itemId;
    if (categoryId) query.categoryId = categoryId;
    if (teamId) query.teamId = teamId;

    const results = await Result.find(query)
      .populate('teamId', 'name code color')
      .populate('categoryId', 'name')
      .populate('itemId', 'name type categoryId')
      .populate('participantId', 'name chestNo')
      .populate({
        path: 'groupEntryId',
        select: 'participants',
      })
      .sort({ itemId: 1, position: 1 });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Declare or batch update results for an item
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
    if (!permissions.hasAccess || (!permissions.isOwner && !permissions.canResults)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = await req.json();
    const { itemId, entries = [] } = body;
    // entries: [{ position: 1|2|3, participantId?: string, groupEntryId?: string, points?: number }]

    if (!itemId || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: 'Item ID and entries list are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Item.findOne({ _id: itemId, festId });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Validate position uniqueness (no two entries can have position 1, 2, 3)
    const positionsSeen = new Set<number>();
    for (const entry of entries) {
      if (!entry.position || entry.position < 1 || entry.position > 3) {
        return NextResponse.json(
          { error: 'Position must be 1, 2, or 3' },
          { status: 400 }
        );
      }
      if (positionsSeen.has(entry.position)) {
        return NextResponse.json(
          { error: `Duplicate position ${entry.position} specified` },
          { status: 400 }
        );
      }
      positionsSeen.add(entry.position);
    }

    // Remove existing results for this item first to overwrite cleanly
    await Result.deleteMany({ festId, itemId });

    const createdResults = [];

    for (const entry of entries) {
      const position = entry.position as 1 | 2 | 3;
      const calcPoints =
        entry.points !== undefined && entry.points !== null && entry.points >= 0
          ? Number(entry.points)
          : DEFAULT_POINTS[item.type][position];

      let teamId: string | null = null;
      let participantId: string | undefined = undefined;
      let groupEntryId: string | undefined = undefined;

      if (item.type === 'single') {
        if (!entry.participantId) {
          return NextResponse.json(
            { error: `Participant required for position ${position}` },
            { status: 400 }
          );
        }
        const participant = await Participant.findOne({ _id: entry.participantId, festId });
        if (!participant) {
          return NextResponse.json(
            { error: `Participant not found for position ${position}` },
            { status: 400 }
          );
        }
        teamId = participant.teamId.toString();
        participantId = participant._id.toString();
      } else {
        if (!entry.groupEntryId) {
          return NextResponse.json(
            { error: `Group entry required for position ${position}` },
            { status: 400 }
          );
        }
        const groupEntry = await GroupEntry.findOne({ _id: entry.groupEntryId, festId });
        if (!groupEntry) {
          return NextResponse.json(
            { error: `Group entry not found for position ${position}` },
            { status: 400 }
          );
        }
        teamId = groupEntry.teamId.toString();
        groupEntryId = groupEntry._id.toString();
      }

      const resDoc = await Result.create({
        festId,
        itemId,
        categoryId: item.categoryId,
        teamId,
        itemType: item.type,
        participantId,
        groupEntryId,
        position,
        points: calcPoints,
      });

      createdResults.push(resDoc);
    }

    await logActivity({
      festId,
      userId: session.user.id,
      role: permissions.role as 'owner' | 'subadmin',
      action: 'declared_results',
      entityType: 'result',
      summary: `Declared/updated results for competition "${item.name}"`,
    });

    return NextResponse.json({ message: 'Results saved successfully', results: createdResults });
  } catch (error: any) {
    console.error('Error saving results:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
