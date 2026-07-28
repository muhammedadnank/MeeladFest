import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFestAdminPermissions {
  participants: boolean;
  results: boolean;
  updates: boolean;
  gallery: boolean;
}

export interface IFestAdmin extends Document {
  festId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  invitedEmail: string;
  role: 'owner' | 'subadmin';
  permissions: IFestAdminPermissions;
  status: 'pending' | 'accepted' | 'revoked';
  invitedAt: Date;
  acceptedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FestAdminSchema: Schema<IFestAdmin> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    invitedEmail: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['owner', 'subadmin'], required: true },
    permissions: {
      participants: { type: Boolean, default: false },
      results: { type: Boolean, default: false },
      updates: { type: Boolean, default: false },
      gallery: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['pending', 'accepted', 'revoked'], default: 'pending' },
    invitedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    revokedAt: { type: Date },
  },
  { timestamps: true }
);

// Unique index: no duplicate invites for same email on same fest
FestAdminSchema.index({ festId: 1, invitedEmail: 1 }, { unique: true });

const FestAdmin: Model<IFestAdmin> = mongoose.models.FestAdmin || mongoose.model<IFestAdmin>('FestAdmin', FestAdminSchema);
export default FestAdmin;
