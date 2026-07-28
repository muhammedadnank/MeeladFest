import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  festId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: 'single' | 'group';
  maxParticipantsPerTeam?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema<IItem> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ['single', 'group'], required: true, default: 'single' },
    maxParticipantsPerTeam: { type: Number },
  },
  { timestamps: true }
);

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
export default Item;
