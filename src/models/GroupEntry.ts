import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupParticipant {
  name: string;
  chestNo?: string;
}

export interface IGroupEntry extends Document {
  festId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  participants: IGroupParticipant[];
  addedBy: mongoose.Types.ObjectId;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GroupEntrySchema: Schema<IGroupEntry> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
    participants: [
      {
        name: { type: String, required: true, trim: true },
        chestNo: { type: String, trim: true },
      },
    ],
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Unique index: one entry per team per group item in a fest
GroupEntrySchema.index({ festId: 1, itemId: 1, teamId: 1 }, { unique: true });

const GroupEntry: Model<IGroupEntry> =
  mongoose.models.GroupEntry || mongoose.model<IGroupEntry>('GroupEntry', GroupEntrySchema);
export default GroupEntry;
