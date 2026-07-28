import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getFestBySlugOrId } from '@/lib/getFest';
import { getFestPermission } from '@/lib/permissions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; imageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { festId: slugOrId, imageId } = await params;
    await connectDB();

    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const { hasPermission } = await getFestPermission(fest._id.toString(), session.user.id, 'gallery');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const deleted = await Gallery.findOneAndDelete({ _id: imageId, festId: fest._id });
    if (!deleted) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
