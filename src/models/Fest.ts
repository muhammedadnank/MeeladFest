import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPointsConfig {
  first: number;
  second: number;
  third: number;
  groupMultiplier: number;
}

export interface IFest extends Document {
  ownerId: mongoose.Types.ObjectId;
  slug: string;
  festName: string;
  madrasaName: string;
  area: string;
  district: string;
  date?: string;
  venue?: string;
  description?: string;
  bannerImageUrl?: string;
  pointsConfig: IPointsConfig;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FestSchema: Schema<IFest> = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    festName: { type: String, required: true, trim: true },
    madrasaName: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    date: { type: String, trim: true },
    venue: { type: String, trim: true },
    description: { type: String, trim: true },
    bannerImageUrl: { type: String, trim: true },
    pointsConfig: {
      first: { type: Number, default: 5 },
      second: { type: Number, default: 3 },
      third: { type: Number, default: 1 },
      groupMultiplier: { type: Number, default: 1.5 },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

const Fest: Model<IFest> = mongoose.models.Fest || mongoose.model<IFest>('Fest', FestSchema);
export default Fest;
