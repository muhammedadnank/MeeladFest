import mongoose from 'mongoose';
import Fest from '@/models/Fest';

export async function getFestBySlugOrId(slugOrId: string) {
  const isMongoId = mongoose.Types.ObjectId.isValid(slugOrId);
  if (isMongoId) {
    const fest = await Fest.findById(slugOrId);
    if (fest && !fest.isDeleted) return fest;
  }
  return await Fest.findOne({ slug: slugOrId, isDeleted: false });
}
