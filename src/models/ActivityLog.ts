import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  festId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'subadmin';
  action: string; // e.g. 'participant.create', 'participant.update', 'result.create'
  entityType: 'participant' | 'group_entry' | 'result' | 'update' | 'gallery';
  entityId?: mongoose.Types.ObjectId;
  summary: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema<IActivityLog> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['owner', 'subadmin'], required: true },
    action: { type: String, required: true, trim: true },
    entityType: {
      type: String,
      enum: ['participant', 'group_entry', 'result', 'update', 'gallery'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId },
    summary: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

ActivityLogSchema.index({ festId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
