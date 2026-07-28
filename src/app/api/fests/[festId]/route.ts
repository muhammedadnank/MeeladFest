import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
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

    const fest = await Fest.findById(festId);
    if (!fest || fest.isDeleted) {
      return NextResponse.json({ error: 'Fest not found' }, { status: 404 });
    }

    return NextResponse.json({ fest, permissions });
  } catch (error: any) {
    console.error('Error getting fest:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.isOwner) {
      return NextResponse.json({ error: 'Only the fest owner can update fest settings.' }, { status: 403 });
    }

    const body = await req.json();
    const fest = await Fest.findByIdAndUpdate(
      festId,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, fest });
  } catch (error: any) {
    console.error('Error updating fest:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.isOwner) {
      return NextResponse.json({ error: 'Only the fest owner can delete this fest.' }, { status: 403 });
    }

    // Soft delete
    await Fest.findByIdAndUpdate(festId, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Fest deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting fest:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
