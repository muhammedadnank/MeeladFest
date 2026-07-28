import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';
import { getFestPermission } from '@/lib/permissions';

export async function GET(
  req: NextRequest,
  { params }: { params: { festId: string } }
) {
  try {
    await connectDB();
    const { isOwner } = await getFestPermission(params.festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const feedbacks = await Feedback.find({ festId: params.festId }).sort({ submittedAt: -1 });
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { festId: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const feedback = await Feedback.create({
      festId: params.festId,
      name: name ? String(name).trim() : 'Anonymous',
      rating,
      comment: comment ? String(comment).trim() : '',
    });

    return NextResponse.json({ feedback, message: 'Thank you for your feedback!' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit feedback' }, { status: 500 });
  }
}
