import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import FestAdmin from '@/models/FestAdmin';
import { getFestPermission } from '@/lib/permissions';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ festId: string; adminId: string }> }
) {
  try {
    const { festId, adminId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.isOwner) {
      return NextResponse.json({ error: 'Only fest owner can edit subadmin permissions.' }, { status: 403 });
    }

    const { permissions: newPermissions } = await req.json();

    const subAdmin = await FestAdmin.findOneAndUpdate(
      { _id: adminId, festId, role: 'subadmin' },
      { $set: { permissions: newPermissions } },
      { new: true }
    );

    if (!subAdmin) {
      return NextResponse.json({ error: 'Sub-admin record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, subAdmin });
  } catch (error: any) {
    console.error('Error updating subadmin:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ festId: string; adminId: string }> }
) {
  try {
    const { festId, adminId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const permissions = await getFestPermission(session.user.id, festId);
    if (!permissions.isOwner) {
      return NextResponse.json({ error: 'Only fest owner can revoke subadmin access.' }, { status: 403 });
    }

    const subAdmin = await FestAdmin.findOneAndUpdate(
      { _id: adminId, festId, role: 'subadmin' },
      { $set: { status: 'revoked', revokedAt: new Date() } },
      { new: true }
    );

    if (!subAdmin) {
      return NextResponse.json({ error: 'Sub-admin record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Sub-admin access revoked.' });
  } catch (error: any) {
    console.error('Error revoking subadmin:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
