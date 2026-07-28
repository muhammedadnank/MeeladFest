import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Team from '@/models/Team';
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

    const teams = await Team.find({ festId }).sort({ name: 1 });
    return NextResponse.json({ teams });
  } catch (error: any) {
    console.error('Error fetching teams:', error);
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
    const { name, color } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Team name is required.' }, { status: 400 });
    }

    const newTeam = await Team.create({
      festId,
      name: name.trim(),
      color: color?.trim() || '#3B82F6',
    });

    return NextResponse.json({ success: true, team: newTeam }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
