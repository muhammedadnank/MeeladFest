import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Trophy,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  CalendarDays,
  Award,
} from 'lucide-react';
import connectDB from '@/lib/db';
import { getFestBySlugOrId } from '@/lib/getFest';
import FestCountdown from '@/components/public/FestCountdown';
import PublicLeaderboard from '@/components/public/PublicLeaderboard';
import PublicPrograms from '@/components/public/PublicPrograms';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const fest = await getFestBySlugOrId(slug);

  if (!fest) {
    return {
      title: 'Fest Not Found | MeeladFest',
    };
  }

  const title = `${fest.festName} | MeeladFest Live Results & Leaderboard`;
  const description = fest.description || `Live competition scoreboard and schedule for ${fest.festName} at ${fest.madrasaName}, ${fest.area}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: fest.bannerImageUrl ? [{ url: fest.bannerImageUrl }] : [],
    },
  };
}

export default async function PublicFestPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const fest = await getFestBySlugOrId(slug);

  if (!fest) {
    notFound();
  }

  const festData = JSON.parse(JSON.stringify(fest));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
              title="Back to all festivals"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                MeeladFest
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Official Festival Page
              </span>

              {festData.isActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Sparkles className="w-3 h-3" />
                  Live Event
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {festData.festName}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-medium flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {festData.madrasaName}
              </p>

              {festData.description && (
                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                  {festData.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {festData.area}, {festData.district}
                  </span>
                </div>

                {festData.venue && (
                  <div className="flex items-center gap-2 bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-700/50">
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Venue: {festData.venue}</span>
                  </div>
                )}

                {festData.date && (
                  <div className="flex items-center gap-2 bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-700/50">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{festData.date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown Widget */}
            <div className="w-full">
              <FestCountdown targetDate={festData.date} festName={festData.festName} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Leaderboards & Schedule */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-12">
        {/* Section 1: Live Leaderboard */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-emerald-400" />
                Live Competition Standings
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time team point aggregation and individual championship rankings.
              </p>
            </div>
          </div>

          <PublicLeaderboard festIdOrSlug={slug} />
        </section>

        {/* Section 2: Program Schedule */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <CalendarDays className="w-6 h-6 text-teal-400" />
                Program Schedule & Timeline
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Sequence of festival events, stages, and stage timings.
              </p>
            </div>
          </div>

          <PublicPrograms festIdOrSlug={slug} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} MeeladFest Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
