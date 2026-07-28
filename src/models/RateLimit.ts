import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRateLimit extends Document {
  ip: string;
  endpoint: string;
  count: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema: Schema<IRateLimit> = new Schema(
  {
    ip: { type: String, required: true, index: true },
    endpoint: { type: String, required: true, index: true },
    count: { type: Number, default: 1 },
    resetAt: { type: Date, required: true, index: { expires: 0 } }, // Auto TTL index deletion
  },
  { timestamps: true }
);

RateLimitSchema.index({ ip: 1, endpoint: 1 }, { unique: true });

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

export default RateLimit;
