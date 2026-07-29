import Link from 'next/link';
import { Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { GeometricPattern } from '@/components/ui/GeometricPattern';

export function HeroSection() {
  return (
    <section className="relative bg-emerald-950 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Signature Islamic Hexagon Overlay */}
      <GeometricPattern className="absolute -top-10 -right-10 w-96 h-96 opacity-[0.08] text-white pointer-events-none" />
      <GeometricPattern className="absolute -bottom-20 -left-20 w-80 h-80 opacity-[0.05] text-white pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Arabic Calligraphy Header */}
        <p className="font-amiri text-xl sm:text-2xl text-gold-200 tracking-widest mb-3">
          مَوْلِدُ النَّبِيِّ ﷺ
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-800/60 border border-gold-500/30 text-gold-200 mb-6 shadow-sm">
          <Trophy className="w-4 h-4 text-gold-500" />
          <span>Official Madrasa Fest Platform</span>
        </div>

        {/* Title */}
        <h1 className="font-amiri font-bold text-3xl sm:text-5xl text-white leading-tight mb-4">
          Meelad Fest Competitions & <span className="text-gold-200">Live Results</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
          Seamless live point updates, individual championship leaderboards, stage schedules, and instant PDF certificate verification for Madrasa fests.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#active-fests"
            className="w-full sm:w-auto bg-gold-500 text-emerald-950 px-6 py-3 rounded-lg text-xs font-bold hover:bg-[#b07d20] hover:text-white transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Browse Active Festivals</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/login"
            className="w-full sm:w-auto bg-transparent text-white/90 border border-white/25 px-6 py-3 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-gold-200" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Gold Ornament Divider */}
        <div className="mt-10 flex items-center justify-center gap-3 text-gold-500/50 text-xs tracking-widest">
          <span>✦</span>
          <span className="text-gold-500">✦</span>
          <span>✦</span>
        </div>
      </div>
    </section>
  );
}
