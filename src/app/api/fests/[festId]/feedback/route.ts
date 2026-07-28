import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';
import { getFestPermission } from '@/lib/permissions';

export async function GET(
  req: NextRequest,
  { params }: { params: { festId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { isOwner } = await getFestPermission(session.user.id, params.festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const feedbacks = await Feedback.find({ festId: params.festId }).sort({ submittedAt: -1 });
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}

import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(
  req: NextRequest,
  { params }: { params: { festId: string } }
) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(ip, 'feedback_submit', 5, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many feedback submissions. Please try again later.' }, { status: 429 });
    }

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
