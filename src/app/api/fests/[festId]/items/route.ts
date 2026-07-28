import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Item from '@/models/Item';
import { getFestPermission } from '@/lib/permissions';

export async function GET(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const items = await Item.find({ festId })
      .populate('categoryId', 'name ageRange')
      .sort({ name: 1 });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId } = await params;
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

    if (!categoryId || !name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Category and Item name are required.' }, { status: 400 });
    }

    if (type && !['single', 'group'].includes(type)) {
      return NextResponse.json({ error: 'Item type must be single or group.' }, { status: 400 });
    }

    const newItem = await Item.create({
      festId,
      categoryId,
      name: name.trim(),
      description: description?.trim() || undefined,
      type: type || 'single',
      maxParticipantsPerTeam:
        type === 'group'
          ? undefined
          : maxParticipantsPerTeam && !isNaN(Number(maxParticipantsPerTeam))
          ? Number(maxParticipantsPerTeam)
          : undefined,
    });

    const populatedItem = await Item.findById(newItem._id).populate('categoryId', 'name ageRange');

    return NextResponse.json({ success: true, item: populatedItem }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
