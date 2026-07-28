import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFaq extends Document {
  festId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema: Schema<IFaq> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Faq: Model<IFaq> = mongoose.models.Faq || mongoose.model<IFaq>('Faq', FaqSchema);
export default Faq;
