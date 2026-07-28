import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Update from '@/models/Update';
import { getFestBySlugOrId } from '@/lib/getFest';
import { getFestPermission } from '@/lib/permissions';

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

    const updates = await Update.find({ festId: fest._id }).sort({ postedAt: -1 }).limit(50);
    return NextResponse.json({ success: true, updates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { festId: slugOrId } = await params;
    await connectDB();

    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const { hasPermission } = await getFestPermission(fest._id.toString(), session.user.id, 'updates');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { text, imageUrl } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Update text is required' }, { status: 400 });
    }

    const update = await Update.create({
      festId: fest._id,
      text: text.trim(),
      imageUrl: imageUrl || undefined,
      postedAt: new Date(),
    });

    return NextResponse.json({ success: true, update }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
