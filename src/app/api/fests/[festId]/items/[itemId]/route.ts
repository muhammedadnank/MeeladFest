import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Item from '@/models/Item';
import Participant from '@/models/Participant';
import GroupEntry from '@/models/GroupEntry';
import Result from '@/models/Result';
import { getFestPermission } from '@/lib/permissions';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ festId: string; itemId: string }> }
) {
  try {
    const { festId, itemId } = await params;
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
    const { categoryId, name, description, type, maxParticipantsPerTeam } = body;

    const updateData: any = {};
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (type !== undefined) updateData.type = type;

    if (type === 'group') {
      updateData.maxParticipantsPerTeam = null;
    } else if (maxParticipantsPerTeam !== undefined) {
      updateData.maxParticipantsPerTeam = maxParticipantsPerTeam ? Number(maxParticipantsPerTeam) : null;
    }

    const item = await Item.findOneAndUpdate(
      { _id: itemId, festId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name ageRange');

    if (!item) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; itemId: string }> }
) {
  try {
    const { festId, itemId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if item is referenced in Participants, GroupEntries, or Results
    const [participantCount, groupEntryCount, resultCount] = await Promise.all([
      Participant.countDocuments({ festId, itemIds: itemId }),
      GroupEntry.countDocuments({ festId, itemId }),
      Result.countDocuments({ festId, itemId }),
    ]);

    if (participantCount > 0 || groupEntryCount > 0 || resultCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete item: it is referenced by existing participants, group entries, or results. Remove those records first.',
        },
        { status: 409 }
      );
    }

    const item = await Item.findOneAndDelete({ _id: itemId, festId });
    if (!item) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
