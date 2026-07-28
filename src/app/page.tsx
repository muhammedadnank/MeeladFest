import Link from 'next/link';
import { Sparkles, Trophy, Award, Search, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              MeeladFest
            </span>
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Admin Login
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
            <Trophy className="w-4 h-4 text-emerald-400" />
            Live Festival Management Platform
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Meelad Fest Competitions &{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Live Results
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience real-time leaderboard updates, team points, participant registrations, programs, and instant certificate downloads.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#active-fests"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Browse Active Fests
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Active Fests Section */}
      <section id="active-fests" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              Active Festivals
            </h2>
            <p className="text-sm text-slate-400 mt-1">Explore live competition scores and programs.</p>
          </div>
        </div>

        {fests.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Active Festivals Currently</h3>
            <p className="text-xs text-slate-500 mt-1">
              Check back soon or sign in as an admin to launch your festival.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fests.map((fest: any) => (
              <Link
                key={fest._id}
                href={`/fests/${fest.slug}`}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Live Fest
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {fest.festName}
                  </h3>

                  <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {fest.madrasaName}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {fest.area}, {fest.district}
                      </span>
                    </div>

                    {fest.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{fest.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>View Leaderboard & Results</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} MeeladFest Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
