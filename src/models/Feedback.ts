import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback extends Document {
  festId: mongoose.Types.ObjectId;
  name?: string;
  rating: number; // 1-5
  comment?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    name: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
export default Feedback;
