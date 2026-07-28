import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
  festId: mongoose.Types.ObjectId;
  imageUrl: string;
  cloudinaryPublicId?: string;
  caption?: string;
  uploadedAt: Date;
}

const GallerySchema: Schema<IGallery> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now, index: -1 },
  },
  { timestamps: true }
);

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
