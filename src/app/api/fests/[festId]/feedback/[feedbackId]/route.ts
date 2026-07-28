import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';
import { getFestPermission } from '@/lib/permissions';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ festId: string; feedbackId: string }> }
) {
  try {
    const { festId, feedbackId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { isOwner } = await getFestPermission(session.user.id, festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const feedback = await Feedback.findOneAndDelete({
      _id: feedbackId,
      festId,
    });

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Feedback entry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete feedback' }, { status: 500 });
  }
}
