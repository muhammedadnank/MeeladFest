import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
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

    const images = await Gallery.find({ festId: fest._id }).sort({ uploadedAt: -1 }).limit(100);
    return NextResponse.json({ success: true, images });
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

    const { hasPermission } = await getFestPermission(fest._id.toString(), session.user.id, 'gallery');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { imageUrl, cloudinaryPublicId, caption } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const image = await Gallery.create({
      festId: fest._id,
      imageUrl,
      cloudinaryPublicId: cloudinaryPublicId || undefined,
      caption: caption ? caption.trim() : undefined,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
