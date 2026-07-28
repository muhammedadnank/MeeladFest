import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Faq from '@/models/Faq';
import { getFestPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/activity';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ festId: string; faqId: string }> }
) {
  try {
    const { festId, faqId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { isOwner, userId, role } = await getFestPermission(session.user.id, festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const body = await req.json();
    const { question, answer, order } = body;

    const faq = await Faq.findOneAndUpdate(
      { _id: faqId, festId },
      { question, answer, order },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    if (userId) {
      await logActivity({
        festId,
        userId,
        role: role === 'owner' ? 'owner' : 'subadmin',
        action: 'UPDATE_FAQ',
        entityType: 'faq',
        entityId: faq._id,
        summary: `Updated FAQ: ${faq.question}`,
      });
    }

    return NextResponse.json({ faq, message: 'FAQ updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ festId: string; faqId: string }> }
) {
  try {
    const { festId, faqId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { isOwner, userId, role } = await getFestPermission(session.user.id, festId);
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: Owner access required' }, { status: 403 });
    }

    const faq = await Faq.findOneAndDelete({ _id: faqId, festId });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    if (userId) {
      await logActivity({
        festId,
        userId,
        role: role === 'owner' ? 'owner' : 'subadmin',
        action: 'DELETE_FAQ',
        entityType: 'faq',
        entityId: faq._id,
        summary: `Deleted FAQ: ${faq.question}`,
      });
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete FAQ' }, { status: 500 });
  }
}
