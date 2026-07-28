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
import Result from '@/models/Result';

// PATCH: Update participant details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ festId: string; participantId: string }> }
) {
  try {
    const { festId, participantId } = await params;
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

    await connectDB();

    const existingParticipant = await Participant.findOne({ _id: participantId, festId });
    if (!existingParticipant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // If chestNo changed, check duplicate
    if (chestNo && chestNo.trim() !== existingParticipant.chestNo) {
      const duplicate = await Participant.findOne({
        festId,
        chestNo: chestNo.trim(),
        _id: { $ne: participantId },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: `Chest number "${chestNo}" is already in use by another participant.` },
          { status: 400 }
        );
      }
      existingParticipant.chestNo = chestNo.trim();
    }

    if (name) existingParticipant.name = name.trim();
    existingParticipant.phone = phone !== undefined ? (phone ? phone.trim() : undefined) : existingParticipant.phone;

    if (teamId) {
      const team = await Team.findOne({ _id: teamId, festId });
      if (!team) return NextResponse.json({ error: 'Selected team not found' }, { status: 400 });
      existingParticipant.teamId = teamId;
    }

    if (categoryId) {
      const category = await Category.findOne({ _id: categoryId, festId });
      if (!category) return NextResponse.json({ error: 'Selected category not found' }, { status: 400 });
      existingParticipant.categoryId = categoryId;
    }

    // Validate itemIds
    if (Array.isArray(itemIds)) {
      const targetTeamId = teamId || existingParticipant.teamId;

      const items = await Item.find({ _id: { $in: itemIds }, festId, type: 'single' });
      if (items.length !== itemIds.length) {
        return NextResponse.json(
          { error: 'One or more selected single items are invalid' },
          { status: 400 }
        );
      }

      // Verify maxParticipantsPerTeam limits for new items added to participant
      for (const item of items) {
        if (item.maxParticipantsPerTeam && item.maxParticipantsPerTeam > 0) {
          const count = await Participant.countDocuments({
            festId,
            teamId: targetTeamId,
            itemIds: item._id,
            _id: { $ne: participantId },
          });

          if (count >= item.maxParticipantsPerTeam) {
            return NextResponse.json(
              {
                error: `Team limit reached (${item.maxParticipantsPerTeam}) for item "${item.name}".`,
              },
              { status: 400 }
            );
          }
        }
      }

      existingParticipant.itemIds = itemIds;
    }

    await existingParticipant.save();

    await existingParticipant.populate([
      { path: 'teamId', select: 'name code color' },
      { path: 'categoryId', select: 'name' },
      { path: 'itemIds', select: 'name categoryId type' },
    ]);

    await logActivity({
      festId,
      userId: session.user.id,
      role: permissions.role as 'owner' | 'subadmin',
      action: 'updated_participant',
      entityType: 'participant',
      entityId: participantId,
      summary: `Updated participant ${existingParticipant.name} (Chest: ${existingParticipant.chestNo})`,
    });

    return NextResponse.json({ participant: existingParticipant });
  } catch (error: any) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove participant
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; participantId: string }> }
) {
  try {
    const { festId, participantId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess || (!permissions.isOwner && !permissions.canParticipants)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await connectDB();

    const participant = await Participant.findOne({ _id: participantId, festId });
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Check if participant has results declared
    const resultCount = await Result.countDocuments({
      festId,
      participantId,
    });

    if (resultCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete participant who already has competition results registered. Delete or modify the result entries first.',
        },
        { status: 400 }
      );
    }

    await Participant.deleteOne({ _id: participantId, festId });

    await logActivity({
      festId,
      userId: session.user.id,
      role: permissions.role as 'owner' | 'subadmin',
      action: 'deleted_participant',
      entityType: 'participant',
      entityId: participantId,
      summary: `Deleted participant ${participant.name} (Chest: ${participant.chestNo})`,
    });

    return NextResponse.json({ message: 'Participant deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
