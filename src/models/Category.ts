import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  festId: mongoose.Types.ObjectId;
  name: string;
  ageRange?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    name: { type: String, required: true, trim: true },
    ageRange: { type: String, trim: true },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
