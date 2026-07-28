import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
import FestAdmin from '@/models/FestAdmin';
import User from '@/models/User';
import { getFestPermission } from '@/lib/permissions';
import { sendSubAdminInviteEmail } from '@/lib/email';

export async function GET(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.isOwner) {
      return NextResponse.json({ error: 'Only fest owner can view subadmins.' }, { status: 403 });
    }

    const subAdmins = await FestAdmin.find({ festId, role: 'subadmin' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ subAdmins });
  } catch (error: any) {
    console.error('Error fetching subadmins:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ festId: string }> }) {
  try {
    const { festId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.isOwner) {
      return NextResponse.json({ error: 'Only fest owner can invite subadmins.' }, { status: 403 });
    }

    const fest = await Fest.findById(festId);
    if (!fest || fest.isDeleted) {
      return NextResponse.json({ error: 'Fest not found' }, { status: 404 });
    }

    const { email, permissions: userPermissions } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if duplicate invite
    const existingInvite = await FestAdmin.findOne({ festId, invitedEmail: normalizedEmail });
    if (existingInvite && existingInvite.status !== 'revoked') {
      return NextResponse.json(
        { error: 'An invitation or access record already exists for this email.' },
        { status: 409 }
      );
    }

    // Check if target email belongs to existing registered user
    const existingUser = await User.findOne({ email: normalizedEmail });

    const newPermissions = {
      participants: !!userPermissions?.participants,
      results: !!userPermissions?.results,
      updates: !!userPermissions?.updates,
      gallery: !!userPermissions?.gallery,
    };

    let subAdminRecord;

    if (existingInvite && existingInvite.status === 'revoked') {
      // Re-invite revoked user
      existingInvite.status = existingUser ? 'accepted' : 'pending';
      existingInvite.userId = existingUser ? existingUser._id : undefined;
      existingInvite.permissions = newPermissions;
      existingInvite.invitedAt = new Date();
      existingInvite.revokedAt = undefined;
      if (existingUser) existingInvite.acceptedAt = new Date();
      await existingInvite.save();
      subAdminRecord = existingInvite;
    } else {
      subAdminRecord = await FestAdmin.create({
        festId,
        userId: existingUser ? existingUser._id : undefined,
        invitedEmail: normalizedEmail,
        role: 'subadmin',
        permissions: newPermissions,
        status: existingUser ? 'accepted' : 'pending',
        invitedAt: new Date(),
        acceptedAt: existingUser ? new Date() : undefined,
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const inviteUrl = existingUser ? `${baseUrl}/login` : `${baseUrl}/register`;

    const inviterUser = await User.findById(session.user.id);
    await sendSubAdminInviteEmail({
      toEmail: normalizedEmail,
      festName: fest.festName,
      inviterName: inviterUser?.name || 'Fest Admin',
      inviteUrl,
    });

    return NextResponse.json({ success: true, subAdmin: subAdminRecord }, { status: 201 });
  } catch (error: any) {
    console.error('Error inviting subadmin:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
