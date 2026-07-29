import { SectionTitle } from '@/components/ui/SectionTitle';
import { Sparkles, HeartHandshake, Zap, Compass, CheckCircle2 } from 'lucide-react';

export function AboutPlatformSection() {
  const stats = [
    { label: 'ചെലവ് (Platform Cost)', value: '₹0 (100% Free)' },
    { label: 'വെരിഫിക്കേഷൻ (Verification)', value: 'Instant QR' },
    { label: 'അപ്‌ഡേഷൻ (Live Updates)', value: 'Real-time' },
    { label: 'ഇന്റർഫേസ് (Device Support)', value: 'Mobile First' },
  ];

  const highlights = [
    {
      title: '100% സൗജന്യ സേവനം (Zero Cost Platform)',
      desc: 'മദ്‌റസകൾക്കും കലോത്സവ സ്വാഗതസംഘങ്ങൾക്കും യാതൊരു സാമ്പത്തിക ചെലവുമില്ലാതെ ഫെസ്റ്റിവൽ പോർട്ടലുകൾ സ്വന്തമായി ആരംഭിക്കാം.',
    },
    {
      title: 'സുതാര്യവും കൃത്യവുമായ പോയിന്റ് കണക്കുകൂട്ടൽ',
      desc: 'അഡ്മിൻമാർ റിസൾട്ടുകൾ ലൈവായി എന്റർ ചെയ്യുമ്പോൾ തൽക്ഷണം ടീം പോയിന്റ് ടേബിളും വ്യക്തിഗത റാങ്കിംഗും അപ്ഡേറ്റ് ആകുന്നു.',
    },
    {
      title: 'മൊബൈൽ-ഫ്രണ്ട്‌ലി & വേഗതയേറിയ സേവനം',
      desc: 'കുറഞ്ഞ ഇന്റർനെറ്റ് സ്പീഡിലും സ്മാർട്ട്ഫോണുകളിലും ടാബ്‌ലെറ്റുകളിലും അനായാസം പ്രവർത്തിക്കുന്ന Modern UI/UX.',
    },
    {
      title: 'ഇൻസ്റ്റന്റ് ക്യുആർ-വെരിഫൈഡ് സർട്ടിഫിക്കറ്റുകൾ',
      desc: 'മത്സരങ്ങൾ പൂർത്തിയാകുമ്പോൾ വിദ്യാർത്ഥികൾക്ക് പേര്, ഇനം, സ്ഥാനം എന്നിവയുള്ള ക്യുആർ കോഡ് സർട്ടിഫിക്കറ്റ് തൽക്ഷണം ഡൗൺലോഡ് ചെയ്യാം.',
    },
  ];

  return (
    <section id="about-platform" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-white border border-border-warm rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Top Gold Geometric Accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-bl-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-amiri text-sm text-emerald-800">عن المنصة</span>
              <span className="text-emerald-300">•</span>
              <span>ഞങ്ങളുടെ ലക്ഷ്യം</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 leading-tight">
              മദ്രസ കലോത്സവ സംസ്കാരം ഇനി കൂടുതൽ ഡിജിറ്റൽ!
            </h2>

            <p className="text-xs sm:text-sm text-text-dark/80 leading-relaxed font-light">
              കേരളത്തിലുടനീളമുള്ള സമസ്ത മദ്‌റസകൾക്കും പ്രദേശിക ഇസ്‌ലാമിക് ഫെസ്റ്റിവലുകൾക്കും ഡിജിറ്റൽ സാങ്കേതികവിദ്യയുടെ എല്ലാ സൗകര്യങ്ങളും ലഭ്യമാക്കുക എന്ന ലക്ഷ്യത്തോടെയാണ് <strong className="font-semibold text-emerald-900">MeeladFest</strong> രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്.
            </p>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <div className="text-xs font-bold text-emerald-950">{stat.value}</div>
                  <div className="text-[10px] text-emerald-800/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-cream to-amber-50/50 border border-gold-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                </div>
                <p className="text-xs text-emerald-950 font-medium leading-normal">
                  മാനുവൽ പേപ്പർ വർക്കുകൾ ഒഴിവാക്കി കൂടുതൽ എളുപ്പത്തിൽ റിസൾട്ടുകൾ പ്രസിദ്ധീകരിക്കാം.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-gold-200 text-xs font-bold transition-all shadow-sm border border-gold-500/30 group"
              >
                <span>കൂടുതൽ വിവരങ്ങൾ വായിക്കുക (Read Full About)</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Highlights Checklist */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-cream/60 border border-border-warm hover:border-gold-500/50 transition-all hover:bg-white group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 group-hover:text-gold-600 transition-colors shrink-0" />
                  <h3 className="font-sans font-bold text-xs sm:text-sm text-emerald-950">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-text-dark/70 font-light leading-relaxed pl-6">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
