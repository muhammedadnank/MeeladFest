import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IParticipant extends Document {
  festId: mongoose.Types.ObjectId;
  chestNo: string;
  name: string;
  phone?: string;
  teamId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  itemIds: mongoose.Types.ObjectId[];
  addedBy: mongoose.Types.ObjectId;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema: Schema<IParticipant> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    chestNo: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    itemIds: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Unique index: no duplicate chestNo within the same fest
ParticipantSchema.index({ festId: 1, chestNo: 1 }, { unique: true });

const Participant: Model<IParticipant> =
  mongoose.models.Participant || mongoose.model<IParticipant>('Participant', ParticipantSchema);
export default Participant;
