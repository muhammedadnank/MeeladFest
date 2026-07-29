import Link from 'next/link';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { FestCard } from '@/components/home/FestCard';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { EmptyState } from '@/components/ui/EmptyState';

async function getActiveFests() {
  try {
    await connectDB();
    const fests = await Fest.find({ isActive: true, isDeleted: false })
      .select('slug festName madrasaName area district date venue description bannerImageUrl')
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(fests));
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const fests = await getActiveFests();

  return (
    <div className="min-h-screen bg-cream text-text-dark flex flex-col font-inter">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Arabic Numeral Stats Bar */}
      <StatsBar festCount={fests.length} />

      {/* Active Festivals Section */}
      <section id="active-fests" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <SectionTitle subtitle="Select a festival to view live team scores, schedules, and certificates">
          Active Festivals
        </SectionTitle>

        {fests.length === 0 ? (
          <EmptyState
            title="No Active Festivals Currently"
            description="Check back soon or sign in as an admin to launch your Madrasa festival."
            action={
              <Link
                href="/login"
                className="inline-block bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-emerald-950 transition-colors"
              >
                Admin Sign In
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fests.map((fest: any) => (
              <FestCard key={fest._id} fest={fest} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <FeatureGrid />

      {/* Footer */}
      <Footer />
    </div>
  );
}
