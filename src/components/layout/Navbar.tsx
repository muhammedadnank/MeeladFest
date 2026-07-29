import Link from 'next/link';
import { Sparkles, ShieldCheck, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-amiri text-2xl font-bold text-gold-200 tracking-tight">
            ☽ MeeladFest
          </span>
          <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-200" />
            <span>Admin Sign In</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-gold-500 hover:bg-[#b07d20] text-emerald-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
