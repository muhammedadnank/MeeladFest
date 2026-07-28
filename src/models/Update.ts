import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUpdate extends Document {
  festId: mongoose.Types.ObjectId;
  text: string;
  imageUrl?: string;
  postedAt: Date;
}

const UpdateSchema: Schema<IUpdate> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    text: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    postedAt: { type: Date, default: Date.now, index: -1 },
  },
  { timestamps: true }
);

const Update: Model<IUpdate> =
  mongoose.models.Update || mongoose.model<IUpdate>('Update', UpdateSchema);

export default Update;
