import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
  festId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  itemType: 'single' | 'group';
  participantId?: mongoose.Types.ObjectId;
  groupEntryId?: mongoose.Types.ObjectId;
  position: number; // 1, 2, 3
  points: number;
  enteredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema: Schema<IResult> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
    itemType: { type: String, enum: ['single', 'group'], required: true },
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant', index: true },
    groupEntryId: { type: Schema.Types.ObjectId, ref: 'GroupEntry', index: true },
    position: { type: Number, required: true, min: 1, max: 3 },
    points: { type: Number, required: true },
    enteredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
export default Result;
