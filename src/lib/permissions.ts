import connectDB from './db';
import Fest from '@/models/Fest';
import FestAdmin from '@/models/FestAdmin';
import mongoose from 'mongoose';

export interface FestPermissions {
  isOwner: boolean;
  role: 'owner' | 'subadmin' | null;
  canParticipants: boolean;
  canResults: boolean;
  canUpdates: boolean;
  canGallery: boolean;
  hasAccess: boolean;
}

export async function getFestPermission(
  userId: string | mongoose.Types.ObjectId,
  festId: string | mongoose.Types.ObjectId
): Promise<FestPermissions> {
  await connectDB();

  const fest = await Fest.findById(festId);
  if (!fest || fest.isDeleted) {
    return {
      isOwner: false,
      role: null,
      canParticipants: false,
      canResults: false,
      canUpdates: false,
      canGallery: false,
      hasAccess: false,
    };
  }

  // Check if owner
  if (fest.ownerId.toString() === userId.toString()) {
    return {
      isOwner: true,
      role: 'owner',
      canParticipants: true,
      canResults: true,
      canUpdates: true,
      canGallery: true,
      hasAccess: true,
    };
  }

  // Check Sub-Admin record
  const adminRecord = await FestAdmin.findOne({
    festId,
    userId,
    status: 'accepted',
  });

  if (!adminRecord) {
    return {
      isOwner: false,
      role: null,
      canParticipants: false,
      canResults: false,
      canUpdates: false,
      canGallery: false,
      hasAccess: false,
    };
  }

  return {
    isOwner: false,
    role: 'subadmin',
    canParticipants: !!adminRecord.permissions?.participants,
    canResults: !!adminRecord.permissions?.results,
    canUpdates: !!adminRecord.permissions?.updates,
    canGallery: !!adminRecord.permissions?.gallery,
    hasAccess: true,
  };
}
