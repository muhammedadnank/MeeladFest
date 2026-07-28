import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
import FestAdmin from '@/models/FestAdmin';
import User from '@/models/User';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find fests owned by user
    const ownedFests = await Fest.find({ ownerId: session.user.id, isDeleted: false }).sort({ createdAt: -1 });

    // Find fests where user is sub-admin
    const subAdminRecords = await FestAdmin.find({
      userId: session.user.id,
      role: 'subadmin',
      status: 'accepted',
    }).select('festId permissions');

    const subAdminFestIds = subAdminRecords.map((r) => r.festId);
    const subAdminFests = await Fest.find({
      _id: { $in: subAdminFestIds },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    const formattedOwned = ownedFests.map((f) => ({
      ...f.toObject(),
      role: 'owner',
      permissions: { participants: true, results: true, updates: true, gallery: true },
    }));

    const formattedSubAdmin = subAdminFests.map((f) => {
      const rec = subAdminRecords.find((r) => r.festId.toString() === f._id.toString());
      return {
        ...f.toObject(),
        role: 'subadmin',
        permissions: rec?.permissions || { participants: false, results: false, updates: false, gallery: false },
      };
    });

    return NextResponse.json({ fests: [...formattedOwned, ...formattedSubAdmin] });
  } catch (error: any) {
    console.error('Error fetching fests:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { festName, madrasaName, area, district, date, venue, description, bannerImageUrl, pointsConfig } =
      await req.json();

    if (!festName || !madrasaName || !area || !district) {
      return NextResponse.json(
        { error: 'Fest name, madrasa name, area, and district are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    let baseSlug = slugify(festName);
    if (!baseSlug) baseSlug = 'meelad-fest';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Fest.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const fest = await Fest.create({
      ownerId: session.user.id,
      slug: uniqueSlug,
      festName: festName.trim(),
      madrasaName: madrasaName.trim(),
      area: area.trim(),
      district: district.trim(),
      date: date?.trim(),
      venue: venue?.trim(),
      description: description?.trim(),
      bannerImageUrl: bannerImageUrl?.trim(),
      pointsConfig: pointsConfig || { first: 5, second: 3, third: 1, groupMultiplier: 1.5 },
      isActive: true,
      isDeleted: false,
    });

    const user = await User.findById(session.user.id);

    // Create FestAdmin owner row
    await FestAdmin.create({
      festId: fest._id,
      userId: session.user.id,
      invitedEmail: user?.email || session.user.email,
      role: 'owner',
      permissions: { participants: true, results: true, updates: true, gallery: true },
      status: 'accepted',
      acceptedAt: new Date(),
    });

    return NextResponse.json({ success: true, fest }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating fest:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
