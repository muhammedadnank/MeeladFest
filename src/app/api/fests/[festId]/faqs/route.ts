import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Faq from '@/models/Faq';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { festId: string } }
) {
  try {
    await connectDB();
    const faqs = await Faq.find({ festId: params.festId }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { festId: string } }
) {
  try {
    await connectDB();
    const { isOwner, userId } = await getFestPermission(params.festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const body = await req.json();
    const { question, answer, order } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const faq = await Faq.create({
      festId: params.festId,
      question,
      answer,
      order: order ?? 0,
    });

    if (userId) {
      await logActivity(params.festId, userId, 'CREATE_FAQ', `Created FAQ: ${question}`);
    }

    return NextResponse.json({ faq, message: 'FAQ created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create FAQ' }, { status: 500 });
  }
}
