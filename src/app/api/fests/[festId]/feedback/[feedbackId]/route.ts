import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';
import { getFestPermission } from '@/lib/permissions';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { festId: string; feedbackId: string } }
) {
  try {
    await connectDB();
    const { isOwner } = await getFestPermission(params.festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const feedback = await Feedback.findOneAndDelete({
      _id: params.feedbackId,
      festId: params.festId,
    });

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Feedback entry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete feedback' }, { status: 500 });
  }
}
