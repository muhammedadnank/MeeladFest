import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Program from '@/models/Program';
import { getFestPermission } from '@/lib/permissions';
import { getFestBySlugOrId } from '@/lib/getFest';

export async function GET(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId: slugOrId } = await params;
    await connectDB();

    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }
    const festId = fest._id;

    const programs = await Program.find({ festId }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ programs });
  } catch (error: any) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId: slugOrId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }
    const festId = fest._id;

    const permissions = await getFestPermission(session.user.id, festId.toString());
    if (!permissions.hasAccess || permissions.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const body = await req.json();
    const { time, title, description, order } = body;

    if (!time || !title) {
      return NextResponse.json({ error: 'Time and Title are required.' }, { status: 400 });
    }

    const newProgram = await Program.create({
      festId,
      time: time.trim(),
      title: title.trim(),
      description: description?.trim() || undefined,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({ success: true, program: newProgram }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating program:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
