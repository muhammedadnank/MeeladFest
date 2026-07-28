import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Program from '@/models/Program';
import { getFestPermission } from '@/lib/permissions';
import { getFestBySlugOrId } from '@/lib/getFest';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ festId: string; programId: string }> }
) {
  try {
    const { festId: slugOrId, programId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const permissions = await getFestPermission(session.user.id, fest._id.toString());
    if (!permissions.hasAccess || permissions.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const body = await req.json();
    const { time, title, description, order } = body;

    const program = await Program.findOne({ _id: programId, festId: fest._id });
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    if (time !== undefined) program.time = time.trim();
    if (title !== undefined) program.title = title.trim();
    if (description !== undefined) program.description = description.trim();
    if (typeof order === 'number') program.order = order;

    await program.save();

    return NextResponse.json({ success: true, program });
  } catch (error: any) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; programId: string }> }
) {
  try {
    const { festId: slugOrId, programId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const permissions = await getFestPermission(session.user.id, fest._id.toString());
    if (!permissions.hasAccess || permissions.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const result = await Program.deleteOne({ _id: programId, festId: fest._id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting program:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
