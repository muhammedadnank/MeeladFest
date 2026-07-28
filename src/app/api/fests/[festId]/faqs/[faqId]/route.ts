import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Faq from '@/models/Faq';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/logger';

export async function PUT(
  req: NextRequest,
  { params }: { params: { festId: string; faqId: string } }
) {
  try {
    await connectDB();
    const { isOwner, userId } = await getFestPermission(params.festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const body = await req.json();
    const { question, answer, order } = body;

    const faq = await Faq.findOneAndUpdate(
      { _id: params.faqId, festId: params.festId },
      { question, answer, order },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    if (userId) {
      await logActivity(params.festId, userId, 'UPDATE_FAQ', `Updated FAQ: ${faq.question}`);
    }

    return NextResponse.json({ faq, message: 'FAQ updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { festId: string; faqId: string } }
) {
  try {
    await connectDB();
    const { isOwner, userId } = await getFestPermission(params.festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const faq = await Faq.findOneAndDelete({ _id: params.faqId, festId: params.festId });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    if (userId) {
      await logActivity(params.festId, userId, 'DELETE_FAQ', `Deleted FAQ: ${faq.question}`);
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete FAQ' }, { status: 500 });
  }
}
