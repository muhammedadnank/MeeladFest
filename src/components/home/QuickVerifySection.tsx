'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export function QuickVerifySection() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/certificates?code=${encodeURIComponent(code.trim())}`);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-gold-500/40 shadow-2xl overflow-hidden">
        {/* Background Geometric Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-amiri text-sm">التحقق السريع من الشهادات</span>
              <span className="text-gold-500/60">•</span>
              <span>ക്വിക്ക് വെരിഫിക്കേഷൻ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-100 font-sans tracking-tight">
              ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ് പരിശോധിക്കുക
            </h2>

            <p className="text-xs sm:text-sm text-gold-200/80 leading-relaxed max-w-xl font-light">
              മത്സരാർത്ഥിയുടെ ചെസ്റ്റ് നമ്പറോ ഫെസ്റ്റിവൽ സർട്ടിഫിക്കറ്റ് വെരിഫിക്കേഷൻ കോഡോ നൽകി തത്സമയം ഒഫീഷ്യൽ സർട്ടിഫിക്കറ്റുകൾ പരിശോധിക്കാനും PDF ഡൗൺലോഡ് ചെയ്യാനും സാധിക്കും.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-gold-300/90 pt-2 font-medium">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-gold-500/20">
                <Award className="w-3.5 h-3.5 text-gold-400" /> ഒഫീഷ്യൽ QR വെരിഫൈഡ്
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-gold-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> സെക്യൂർ ഡിജിറ്റൽ വാട്ടർമാർക്ക്
              </span>
            </div>
          </div>

          {/* Right Search Input Box */}
          <div className="lg:col-span-5">
            <form onSubmit={handleVerify} className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gold-500/30 shadow-inner">
              <label htmlFor="quick-verify-input" className="block text-xs font-medium text-gold-200 mb-2">
                ചെസ്റ്റ് നമ്പർ / വെരിഫിക്കേഷൻ കോഡ് നൽകുക
              </label>
              <div className="relative flex items-center">
                <input
                  id="quick-verify-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ഉദാഹരണത്തിന്: 104 അല്ലെങ്കിൽ FEST-2026"
                  className="w-full bg-emerald-950/80 border border-gold-500/40 text-gold-100 placeholder-gold-500/50 text-xs sm:text-sm rounded-xl pl-10 pr-24 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
                />
                <Search className="w-4 h-4 text-gold-400 absolute left-3.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-emerald-950 font-bold text-xs px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1 shadow-md active:scale-95"
                >
                  <span>പരിശോധിക്കുക</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-gold-300/60 mt-2 text-center">
                ഫെസ്റ്റിവൽ സർട്ടിഫിക്കറ്റിലെ QR കോഡ് സ്കാൻ ചെയ്തും വെരിഫൈ ചെയ്യാം.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
