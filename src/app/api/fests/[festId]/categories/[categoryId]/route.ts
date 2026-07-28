import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Item from '@/models/Item';
import Participant from '@/models/Participant';
import { getFestPermission } from '@/lib/permissions';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ festId: string; categoryId: string }> }
) {
  try {
    const { festId, categoryId } = await params;
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
    const { name, ageRange } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (ageRange !== undefined) updateData.ageRange = ageRange.trim();

    const category = await Category.findOneAndUpdate(
      { _id: categoryId, festId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; categoryId: string }> }
) {
  try {
    const { festId, categoryId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if referenced by Items or Participants
    const [itemCount, participantCount] = await Promise.all([
      Item.countDocuments({ festId, categoryId }),
      Participant.countDocuments({ festId, categoryId }),
    ]);

    if (itemCount > 0 || participantCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete category: it is referenced by existing items or participants. Remove those records first.',
        },
        { status: 409 }
      );
    }

    const category = await Category.findOneAndDelete({ _id: categoryId, festId });
    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
