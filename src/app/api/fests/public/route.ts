import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';

export async function GET() {
  try {
    await connectDB();
    const activeFests = await Fest.find({ isActive: true, isDeleted: false })
      .select('slug festName madrasaName area district date venue description bannerImageUrl')
      .sort({ createdAt: -1 });

    return NextResponse.json({ fests: activeFests });
  } catch (error: any) {
    console.error('Error fetching public fests:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
