import Link from 'next/link';
import { GeometricPattern } from '@/components/ui/GeometricPattern';

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80 border-t-2 border-gold-500/30 py-12 px-4 relative overflow-hidden">
      {/* Background Girih Lattice Accent */}
      <GeometricPattern className="absolute -top-16 -right-16 w-80 h-80 opacity-[0.10] text-gold-500 pointer-events-none" />
      <GeometricPattern className="absolute -bottom-16 -left-16 w-80 h-80 opacity-[0.08] text-emerald-400 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Salawat Banner in Footer */}
        <div className="text-center pb-6 border-b border-emerald-900/80">
          <p className="font-amiri text-lg sm:text-xl text-gold-200 tracking-widest font-bold">
            ۞ اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ ۞
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
          <div>
            <div className="font-amiri text-2xl font-bold text-gold-200 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-900 border border-gold-500/40 flex items-center justify-center text-sm">
                ☽
              </span>
              <span>MeeladFest</span>
            </div>
            <p className="text-xs text-emerald-100/70 mt-2 max-w-md leading-relaxed font-light">
              കേരള മദ്‌റസാ മീലാദ് കലോത്സവങ്ങളുടെ ഏകീകൃത ഡിജിറ്റൽ വേദികൾ. തത്സമയ പോയിന്റ് നില, മത്സര റിസൾട്ടുകൾ, സർട്ടിഫിക്കറ്റുകൾ.
            </p>
          </div>

          <div className="flex items-center gap-6 font-medium text-emerald-100/90 text-xs">
            <Link href="/" className="hover:text-gold-200 transition-colors">
              ഹോം (Home)
            </Link>
            <Link href="/about" className="hover:text-gold-200 transition-colors">
              അബൗട്ട് (About)
            </Link>
            <Link href="/#active-fests" className="hover:text-gold-200 transition-colors">
              ഫെസ്റ്റിവലുകൾ (Festivals)
            </Link>
            <Link href="/login" className="hover:text-gold-200 transition-colors">
              അഡ്മിൻ ലോഗിൻ (Admin Login)
            </Link>
          </div>

          <div className="text-[11px] text-emerald-200/50 font-sans">
            © {new Date().getFullYear()} MeeladFest. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

