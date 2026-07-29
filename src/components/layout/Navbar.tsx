import Link from 'next/link';
import { Sparkles, ShieldCheck, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-md">
      {/* Top Bismillah & Salawat Banner */}
      <div className="bg-emerald-900/90 border-b border-emerald-800/80 py-1 px-4 text-center">
        <p className="font-amiri text-xs sm:text-sm text-gold-200 tracking-widest flex items-center justify-center gap-2">
          <span>۞</span>
          <span>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          <span className="hidden sm:inline text-emerald-300/70 font-sans text-[11px]">|</span>
          <span className="hidden sm:inline text-emerald-200/90 text-[11px] font-sans">
            മദ്‌റസാ മീലാദ് കലോത്സവ ഡിജിറ്റൽ പോർട്ടൽ
          </span>
          <span>۞</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-emerald-900 border border-gold-500/40 flex items-center justify-center text-gold-200 font-amiri font-bold text-lg group-hover:scale-105 transition-transform shadow-sm">
            ☽
          </div>
          <div className="flex flex-col">
            <span className="font-amiri text-xl sm:text-2xl font-bold text-gold-200 tracking-tight leading-none">
              MeeladFest
            </span>
            <span className="text-[10px] text-emerald-300/80 font-sans tracking-wider uppercase font-semibold">
              മഹർജാനുൽ മീലാദ്
            </span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse ml-0.5" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/about"
            className="px-3 py-1.5 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold rounded-lg transition-all"
          >
            <span>About</span>
          </Link>
          <Link
            href="/login"
            className="px-3 py-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/50 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-200" />
            <span className="hidden sm:inline">Admin Sign In</span>
            <span className="sm:hidden">Login</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-gold-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow-gold/20"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

