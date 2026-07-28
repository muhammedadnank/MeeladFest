import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import ActivityLog from '@/models/ActivityLog';
import User from '@/models/User';
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

    const { searchParams } = new URL(req.url);
    const userIdFilter = searchParams.get('userId');
    const entityTypeFilter = searchParams.get('entityType');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const query: any = { festId: params.festId };
    if (userIdFilter) query.userId = userIdFilter;
    if (entityTypeFilter) query.entityType = entityTypeFilter;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'userId', select: 'name email role', model: User }),
      ActivityLog.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
