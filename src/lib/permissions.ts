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
  // Aliases for component and API compatibility
  canManageParticipants: boolean;
  canManageResults: boolean;
  canManageUpdates: boolean;
  canManageGallery: boolean;
  hasPermission: boolean;
  userId: string | null;
}

export async function getFestPermission(
  arg1?: string | mongoose.Types.ObjectId | null,
  arg2?: string | mongoose.Types.ObjectId | null,
  section?: 'participants' | 'results' | 'updates' | 'gallery' | string
): Promise<FestPermissions> {
  await connectDB();

  if (!arg1 && !arg2) {
    return createDefaultPermissions(null);
  }

  let festId: string | mongoose.Types.ObjectId | null = null;
  let userId: string | mongoose.Types.ObjectId | null = null;

  // Try checking if arg1 is festId
  if (arg1) {
    const festCheck = await Fest.findById(arg1);
    if (festCheck) {
      festId = arg1;
      userId = arg2 || null;
    }
  }

  // If arg1 was not festId, then arg2 should be festId and arg1 is userId
  if (!festId && arg2) {
    festId = arg2;
    userId = arg1 || null;
  }

  if (!festId) {
    return createDefaultPermissions(userId?.toString() || null);
  }

  const fest = await Fest.findById(festId);
  if (!fest || fest.isDeleted) {
    return createDefaultPermissions(userId?.toString() || null);
  }

  if (!userId) {
    return createDefaultPermissions(null);
  }

  const userIdStr = userId.toString();

  // Check if owner
  if (fest.ownerId && fest.ownerId.toString() === userIdStr) {
    return buildPermissionsResponse(true, 'owner', true, true, true, true, true, userIdStr, section);
  }

  // Check Sub-Admin record
  const adminRecord = await FestAdmin.findOne({
    festId: fest._id,
    userId,
    status: 'accepted',
  });

  if (!adminRecord) {
    return createDefaultPermissions(userIdStr);
  }

  const canParticipants = !!adminRecord.permissions?.participants;
  const canResults = !!adminRecord.permissions?.results;
  const canUpdates = !!adminRecord.permissions?.updates;
  const canGallery = !!adminRecord.permissions?.gallery;

  return buildPermissionsResponse(
    false,
    'subadmin',
    canParticipants,
    canResults,
    canUpdates,
    canGallery,
    true,
    userIdStr,
    section
  );
}

function createDefaultPermissions(userId: string | null): FestPermissions {
  return {
    isOwner: false,
    role: null,
    canParticipants: false,
    canResults: false,
    canUpdates: false,
    canGallery: false,
    hasAccess: false,
    canManageParticipants: false,
    canManageResults: false,
    canManageUpdates: false,
    canManageGallery: false,
    hasPermission: false,
    userId,
  };
}

function buildPermissionsResponse(
  isOwner: boolean,
  role: 'owner' | 'subadmin' | null,
  canParticipants: boolean,
  canResults: boolean,
  canUpdates: boolean,
  canGallery: boolean,
  hasAccess: boolean,
  userId: string | null,
  section?: string
): FestPermissions {
  let hasPermission = hasAccess;
  if (section) {
    if (section === 'participants') hasPermission = canParticipants;
    else if (section === 'results') hasPermission = canResults;
    else if (section === 'updates') hasPermission = canUpdates;
    else if (section === 'gallery') hasPermission = canGallery;
  }

  return {
    isOwner,
    role,
    canParticipants,
    canResults,
    canUpdates,
    canGallery,
    hasAccess,
    canManageParticipants: canParticipants,
    canManageResults: canResults,
    canManageUpdates: canUpdates,
    canManageGallery: canGallery,
    hasPermission,
    userId,
  };
}

