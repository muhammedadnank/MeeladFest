import Link from 'next/link';
import { Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { GeometricPattern } from '@/components/ui/GeometricPattern';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gold-500/20">
      {/* Signature Islamic Girih Lattice Overlays */}
      <GeometricPattern className="absolute -top-12 -right-12 w-96 h-96 opacity-[0.12] text-gold-500 pointer-events-none" />
      <GeometricPattern className="absolute -bottom-20 -left-20 w-80 h-80 opacity-[0.08] text-emerald-400 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Prophet Salawat Calligraphy Banner */}
        <div className="mb-4">
          <p className="font-amiri text-2xl sm:text-4xl text-gold-200 tracking-widest font-bold drop-shadow-md">
            مَوْلِدُ النَّبِيِّ ﷺ
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-200/70 uppercase tracking-widest font-sans mt-1">
            اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ
          </p>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-900/80 border border-gold-500/40 text-gold-200 mb-6 shadow-md backdrop-blur-sm">
          <Trophy className="w-4 h-4 text-gold-500 animate-bounce" />
          <span>Kerala Madrasa Meelad Fest Digital Portal</span>
          <span>۞</span>
        </div>

        {/* Title */}
        <h1 className="font-amiri font-bold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4 tracking-wide">
          MeeladFest Live Point Table & <br className="hidden sm:inline" />
          <span className="text-gold-200 drop-shadow-sm">Digital Competition Results</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          Unified digital portal for real-time Meelad Fest point tables, individual championship scores, stage schedules, and digital certificates.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#active-fests"
            className="w-full sm:w-auto bg-gold-500 text-emerald-950 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold hover:bg-amber-400 transition-all shadow-xl hover:shadow-gold/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Browse Festivals</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/login"
            className="w-full sm:w-auto bg-emerald-900/70 text-white border border-emerald-600/50 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-gold-200" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Gold Ornament Divider */}
        <div className="mt-12 flex items-center justify-center gap-3 text-gold-500/60 text-sm tracking-widest">
          <span>۞</span>
          <span className="text-gold-500">✦</span>
          <span>۞</span>
        </div>
      </div>
    </section>
  );
}

