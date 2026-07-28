import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeam extends Document {
  festId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema<ITeam> = new Schema(
  {
    festId: { type: Schema.Types.ObjectId, ref: 'Fest', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true, default: '#3B82F6' },
  },
  { timestamps: true }
);

const Team: Model<ITeam> = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
export default Team;
