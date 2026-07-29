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
import { FestivalCountdownBanner } from '@/components/home/FestivalCountdownBanner';

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

      {/* Real-time Festival Countdown Spotlight Banner */}
      <FestivalCountdownBanner fests={fests} />

      {/* Islamic Ornament Divider */}
      <div className="flex items-center justify-center gap-3 text-gold-500/60 my-2 text-sm tracking-widest">
        <span>۞</span>
        <span className="text-gold-500">✦</span>
        <span>۞</span>
      </div>

      {/* Active Festivals Section */}
      <section id="active-fests" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <SectionTitle subtitle="തത്സമയ ടീം സ്കോറുകൾ, ഷെഡ്യൂളുകൾ, ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റുകൾ എന്നിവ കാണാൻ ഫെസ്റ്റിവൽ തിരഞ്ഞെടുക്കുക">
          ആക്ടീവ് ഫെസ്റ്റിവലുകൾ (Active Festivals)
        </SectionTitle>

        {fests.length === 0 ? (
          <EmptyState
            title="നിലവിൽ ആക്ടീവ് ഫെസ്റ്റിവലുകൾ ലഭ്യമല്ല"
            description="പുതിയ ഫെസ്റ്റിവലുകൾ ആരംഭിക്കുമ്പോൾ വിവരങ്ങൾ തത്സമയം ഇവിടെ പ്രത്യക്ഷപ്പെടും."
            action={
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-950 to-emerald-900 text-gold-200 border border-gold-500/40 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-all shadow-md"
              >
                <span>അഡ്മിൻ പോർട്ടലിൽ ലോഗിൻ ചെയ്യുക</span>
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

      {/* Islamic Ornament Divider */}
      <div className="flex items-center justify-center gap-3 text-gold-500/60 my-2 text-sm tracking-widest">
        <span>۞</span>
        <span className="text-gold-500">✦</span>
        <span>۞</span>
      </div>

      {/* Feature Highlights Grid */}
      <FeatureGrid />

      {/* Footer */}
      <Footer />
    </div>
  );
}

