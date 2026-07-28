import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
  festId: mongoose.Types.ObjectId;
  imageUrl: string;
  cloudinaryPublicId?: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema<IGallery> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    imageUrl: { type: String, required: true, trim: true },
    cloudinaryPublicId: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
export default Gallery;
