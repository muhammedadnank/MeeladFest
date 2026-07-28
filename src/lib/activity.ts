import connectDB from './db';
import ActivityLog from '@/models/ActivityLog';
import mongoose from 'mongoose';

export interface LogActivityParams {
  festId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  role: 'owner' | 'subadmin';
  action: string;
  entityType: 'participant' | 'group_entry' | 'result' | 'update' | 'gallery' | 'faq' | 'feedback';
  entityId?: string | mongoose.Types.ObjectId;
  summary: string;
}

export async function logActivity(params: LogActivityParams) {
  try {
    await connectDB();
    await ActivityLog.create({
      festId: params.festId,
      userId: params.userId,
      role: params.role,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      summary: params.summary,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Non-blocking catch to prevent main workflow failure if logging fails
  }
}
