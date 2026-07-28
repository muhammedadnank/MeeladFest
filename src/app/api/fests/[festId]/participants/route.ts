import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/activity';
import Participant from '@/models/Participant';
import Item from '@/models/Item';
import Category from '@/models/Category';
import Team from '@/models/Team';

// GET: List all participants for a fest with optional filters
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
    const search = searchParams.get('search') || '';
    const teamId = searchParams.get('teamId') || '';
    const categoryId = searchParams.get('categoryId') || '';

    const query: any = { festId };

    if (teamId) query.teamId = teamId;
    if (categoryId) query.categoryId = categoryId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { chestNo: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const participants = await Participant.find(query)
      .populate('teamId', 'name code color')
      .populate('categoryId', 'name')
      .populate('itemIds', 'name categoryId type')
      .sort({ chestNo: 1 });

    return NextResponse.json({ participants });
  } catch (error: any) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new participant
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
    const { chestNo, name, phone, teamId, categoryId, itemIds = [] } = body;

    if (!chestNo || !name || !teamId || !categoryId) {
      return NextResponse.json(
        { error: 'Chest number, name, team, and category are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if chestNo already exists in this fest
    const existingChest = await Participant.findOne({ festId, chestNo: chestNo.trim() });
    if (existingChest) {
      return NextResponse.json(
        { error: `Chest number "${chestNo}" is already assigned to another participant.` },
        { status: 400 }
      );
    }

    // Verify team and category belong to fest
    const [team, category] = await Promise.all([
      Team.findOne({ _id: teamId, festId }),
      Category.findOne({ _id: categoryId, festId }),
    ]);

    if (!team) {
      return NextResponse.json({ error: 'Selected team not found' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Selected category not found' }, { status: 400 });
    }

    // If itemIds are provided, validate single items and maxParticipantsPerTeam limit
    if (itemIds.length > 0) {
      const items = await Item.find({ _id: { $in: itemIds }, festId, type: 'single' });
      
      if (items.length !== itemIds.length) {
        return NextResponse.json(
          { error: 'One or more selected single items are invalid or not found' },
          { status: 400 }
        );
      }

      // Check maxParticipantsPerTeam limit for each item
      for (const item of items) {
        if (item.maxParticipantsPerTeam && item.maxParticipantsPerTeam > 0) {
          const currentCount = await Participant.countDocuments({
            festId,
            teamId,
            itemIds: item._id,
          });

          if (currentCount >= item.maxParticipantsPerTeam) {
            return NextResponse.json(
              {
                error: `Team "${team.name}" has reached the maximum allowed participants (${item.maxParticipantsPerTeam}) for item "${item.name}".`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    const participant = await Participant.create({
      festId,
      chestNo: chestNo.trim(),
      name: name.trim(),
      phone: phone ? phone.trim() : undefined,
      teamId,
      categoryId,
      itemIds,
      addedBy: session.user.id,
    });

    await participant.populate([
      { path: 'teamId', select: 'name code color' },
      { path: 'categoryId', select: 'name' },
      { path: 'itemIds', select: 'name categoryId type' },
    ]);

    await logActivity({
      festId,
      userId: session.user.id,
      role: permissions.role as 'owner' | 'subadmin',
      action: 'created_participant',
      entityType: 'participant',
      entityId: participant._id.toString(),
      summary: `Added participant ${participant.name} (Chest: ${participant.chestNo})`,
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating participant:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Chest number already exists in this fest' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
