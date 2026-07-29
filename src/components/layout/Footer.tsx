import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80 border-t border-emerald-900 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
        <div>
          <div className="font-amiri text-2xl font-bold text-gold-200">☽ MeeladFest</div>
          <p className="text-xs text-emerald-100/60 mt-1 max-w-sm">
            Multi-Tenant Madrasa Fest Management Platform. Real-time scores, program schedules, and instant certificate verification.
          </p>
        </div>

        <div className="flex items-center gap-6 font-medium text-emerald-100/80">
          <Link href="/" className="hover:text-gold-200 transition-colors">
            Home
          </Link>
          <Link href="/#active-fests" className="hover:text-gold-200 transition-colors">
            Festivals
          </Link>
          <Link href="/login" className="hover:text-gold-200 transition-colors">
            Admin Login
          </Link>
        </div>

        <div className="text-[11px] text-emerald-100/50">
          © {new Date().getFullYear()} MeeladFest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
