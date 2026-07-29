'use client';

import { useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'മദ്‌റസ ഫെസ്റ്റിവൽ പോർട്ടൽ എങ്ങനെ സൗജന്യമായി ആരംഭിക്കാം?',
      a: 'MeeladFest അഡ്മിൻ പോർട്ടലിൽ ലോഗിൻ ചെയ്ത് നിമിഷങ്ങൾക്കുള്ളിൽ നിങ്ങളുടെ മദ്‌റസയുടെ പേരും വിലാസവും നൽകി പുതിയ ഫെസ്റ്റിവൽ പോയിന്റ് പേജ് ആരംഭിക്കാം.',
    },
    {
      q: 'കലോത്സവ പോയിന്റുകളും ചാമ്പ്യൻ പോഡിയവും എങ്ങനെയാണ് അപ്‌ഡേറ്റ് ആകുന്നത്?',
      a: 'മത്സര ഫലങ്ങൾ അഡ്മിൻ സബ്മിറ്റ് ചെയ്യുമ്പോൾ തനിയെ ടീം പോയിന്റുകൾ കണക്കാക്കുകയും 1, 2, 3 സ്ഥാനങ്ങൾ നേടുന്ന ടീമുകൾ 3D വിന്നർ പോഡിയത്തിൽ തത്സമയം മാറ്റുരയ്ക്കുകയും ചെയ്യും.',
    },
    {
      q: 'വിദ്യാർത്ഥികൾക്ക് സർട്ടിഫിക്കറ്റുകൾ എങ്ങനെ ഡൗൺലോഡ് ചെയ്യാം?',
      a: 'ഫെസ്റ്റിവൽ പേജിലെ Certificates വിഭാഗത്തിൽ ചെസ്റ്റ് നമ്പർ നൽകുകയോ ഹോം പേജിലെ Quick Verification ബോക്സിൽ നമ്പറുകൾ നൽകുകയോ ചെയ്താൽ ഒഫീഷ്യൽ PDF സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യാം.',
    },
    {
      q: 'ഒന്നിലധികം സബ്-അഡ്മിൻമാർക്ക് ആക്സസ് നൽകാൻ സാധിക്കുമോ?',
      a: 'അതെ! പ്രധാന അഡ്മിന് മറ്റ് ഉസ്താദുമാർക്കോ ഭാരവാഹികൾക്കോ റിസൾട്ട് എന്റർ ചെയ്യാനുള്ള സബ്-അഡ്മിൻ പെർമിഷൻ സെറ്റ് ചെയ്യാം.',
    },
    {
      q: 'ഫോണുകളിലും ടാബുകളിലും ഇത് കൃത്യമായി പ്രവർത്തിക്കുമോ?',
      a: 'തീർച്ചയായും! MeeladFest 100% മൊബൈൽ-ഫ്രണ്ട്‌ലി ഡിസൈൻ സിസ്റ്റത്തിലാണ് നിർമ്മിച്ചിരിക്കുന്നത്. കുറഞ്ഞ നെറ്റ്‌വർക്കിലും സുഗമമായി പ്രവർത്തിക്കും.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <SectionTitle subtitle="സാധാരണയായി ഉയർന്നുവരുന്ന സംശയങ്ങളും അതിനുള്ള മറുപടികളും">
        ചോദ്യോത്തരങ്ങൾ (Frequently Asked Questions)
      </SectionTitle>

      <div className="space-y-3 mt-6">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-gold-500/60 shadow-sm'
                  : 'bg-white/70 border-border-warm hover:border-gold-500/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-sans font-bold text-xs sm:text-sm text-emerald-950"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-gold-600' : 'text-emerald-700'}`} />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-800 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-gold-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 pl-11 text-xs sm:text-sm text-text-dark/80 font-light leading-relaxed border-t border-border-warm/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Help Banner */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-gold-100 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gold-500/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gold-100">കൂടുതൽ സംശയങ്ങൾ ഉണ്ടോ?</h4>
            <p className="text-[11px] sm:text-xs text-gold-200/70 font-light">
              ഞങ്ങളുടെ സപ്പോർട്ട് ടീമുമായി നേരിട്ട് ബന്ധപ്പെടാം.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap"
        >
          സപ്പോർട്ടുമായി ബന്ധപ്പെടുക
        </Link>
      </div>
    </section>
  );
}
