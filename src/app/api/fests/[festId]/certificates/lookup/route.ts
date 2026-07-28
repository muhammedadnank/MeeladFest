import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Participant from '@/models/Participant';
import GroupEntry from '@/models/GroupEntry';
import Result from '@/models/Result';
import Item from '@/models/Item';
import Team from '@/models/Team';
import Category from '@/models/Category';
import { getFestBySlugOrId } from '@/lib/getFest';
import { generateVerificationCode } from '@/lib/certificate/verify';
import { CertificateData, CertificateSearchResult } from '@/types/certificate';

import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ festId: string }> }
) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(ip, 'cert_lookup', 30, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many lookup requests. Please try again in a minute.' }, { status: 429 });
    }

    const { festId: slugOrId } = await params;
    const { searchParams } = new URL(req.url);
    const chestNoQuery = searchParams.get('chestNo')?.trim();

    if (!chestNoQuery) {
      return NextResponse.json({ error: 'Chest number is required' }, { status: 400 });
    }

    await connectDB();

    const fest = await getFestBySlugOrId(slugOrId);
    if (!fest) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    const festId = fest._id.toString();

    // 1. Search Single Participants
    const singleParticipant = await Participant.findOne({
      festId: fest._id,
      chestNo: { $regex: new RegExp(`^${chestNoQuery}$`, 'i') },
    }).populate('teamId').populate('categoryId');

    // 2. Search Group Entries
    const groupEntries = await GroupEntry.find({
      festId: fest._id,
      'participants.chestNo': { $regex: new RegExp(`^${chestNoQuery}$`, 'i') },
    }).populate('itemId').populate('teamId');

    if (!singleParticipant && groupEntries.length === 0) {
      return NextResponse.json({ success: false, error: 'No participant or group entry found with this Chest Number' }, { status: 200 });
    }

    const certificates: CertificateData[] = [];
    let participantName = '';
    let teamName = '';
    let categoryName = '';
    const formattedDate = new Date(fest.date || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Handle Single Items
    if (singleParticipant) {
      participantName = singleParticipant.name;
      teamName = (singleParticipant.teamId as any)?.name || 'Independent';
      categoryName = (singleParticipant.categoryId as any)?.name || 'General';

      if (Array.isArray(singleParticipant.itemIds) && singleParticipant.itemIds.length > 0) {
        const singleItems = await Item.find({ _id: { $in: singleParticipant.itemIds } }).populate('categoryId');

        for (const item of singleItems) {
          const itemCatName = (item.categoryId as any)?.name || categoryName;

          // Check if result declared for this item
          const result = await Result.findOne({
            festId: fest._id,
            itemId: item._id,
            participantId: singleParticipant._id,
          });

          const isWinner = !!(result && result.position);
          const certType = isWinner ? 'winner' : 'participation';

          const verificationCode = generateVerificationCode(
            festId,
            singleParticipant.chestNo,
            item._id.toString(),
            certType
          );

          certificates.push({
            certificateId: `CERT-${singleParticipant.chestNo}-${item._id.toString()}`,
            festId,
            festName: fest.festName,
            madrasaName: fest.madrasaName || 'Meelad Festival Committee',
            date: formattedDate,
            venue: fest.venue || 'Festival Venue',
            participantName: singleParticipant.name,
            chestNo: singleParticipant.chestNo,
            teamName,
            teamColor: (singleParticipant.teamId as any)?.color,
            categoryName: itemCatName,
            itemName: item.name,
            itemType: 'single',
            certificateType: certType,
            position: isWinner ? (result.position as any) : undefined,
            points: isWinner ? result.points : undefined,
            issueDate: new Date().toLocaleDateString('en-US'),
            verificationCode,
          });
        }
      }
    }

    // Handle Group Items
    for (const groupEntry of groupEntries) {
      const item = groupEntry.itemId as any;
      const team = groupEntry.teamId as any;

      // Find participant details from the group entry
      const pDetail = groupEntry.participants.find(
        (p: any) => p.chestNo.toLowerCase() === chestNoQuery.toLowerCase()
      );

      if (!participantName) participantName = pDetail?.name || 'Group Participant';
      if (!teamName) teamName = team?.name || 'Team';

      // Get Category for item
      let groupCatName = 'Group Category';
      if (item.categoryId) {
        const cat = await Category.findById(item.categoryId);
        if (cat) groupCatName = cat.name;
      }

      // Check if group result declared for this team & item
      const result = await Result.findOne({
        festId: fest._id,
        itemId: item._id,
        teamId: team._id,
        itemType: 'group',
      });

      const isWinner = !!(result && result.position);
      const certType = isWinner ? 'winner' : 'participation';

      const verificationCode = generateVerificationCode(
        festId,
        chestNoQuery,
        item._id.toString(),
        certType
      );

      certificates.push({
        certificateId: `CERT-${chestNoQuery}-${item._id.toString()}`,
        festId,
        festName: fest.festName,
        madrasaName: fest.madrasaName || 'Meelad Festival Committee',
        date: formattedDate,
        venue: fest.venue || 'Festival Venue',
        participantName: pDetail?.name || participantName,
        chestNo: chestNoQuery,
        teamName: team?.name || teamName,
        teamColor: team?.color,
        categoryName: groupCatName,
        itemName: item.name,
        itemType: 'group',
        certificateType: certType,
        position: isWinner ? (result.position as any) : undefined,
        points: isWinner ? result.points : undefined,
        issueDate: new Date().toLocaleDateString('en-US'),
        verificationCode,
      });
    }

    const searchResult: CertificateSearchResult = {
      chestNo: chestNoQuery,
      participantName,
      teamName,
      categoryName,
      certificates,
    };

    return NextResponse.json({ success: true, searchResult });
  } catch (error: any) {
    console.error('Error in certificate lookup API:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
