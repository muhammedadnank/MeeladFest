import { Trophy, Medal, Award, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function FeatureGrid() {
  const features = [
    {
      icon: Trophy,
      arabicTitle: 'النتائج المباشرة',
      title: 'ലൈവ് പോയിന്റ് നിലയും പോഡിയവും',
      desc: 'റിയൽ ടൈം അപ്‌ഡേറ്റഡ് പോയിന്റ് ടേബിളും മികച്ച 3 ടീമുകൾക്കുള്ള 3D പോഡിയവും റിയൽ-ടൈം സ്കോർ ബാറുകളും.',
    },
    {
      icon: Medal,
      arabicTitle: 'بطولة الأفراد',
      title: 'വ്യക്തിഗത ചാമ്പ്യൻഷിപ്പ്',
      desc: 'സബ് ജൂനിയർ, ജൂനിയർ, സീനിയർ വിഭാഗങ്ങളുടെ പോയിന്റ് നില അടിസ്ഥാനമാക്കിയുള്ള വ്യക്തിഗത റാങ്കിംഗുകൾ.',
    },
    {
      icon: Award,
      arabicTitle: 'شهادات التقدير',
      title: 'ഇൻസ്റ്റന്റ് ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ്',
      desc: 'മത്സരാർത്ഥിയുടെ ചെസ്റ്റ് നമ്പർ നൽകി ക്യുആർ കോഡ് പരിശോധിച്ച ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റുകൾ തൽക്ഷണം ഡൗൺലോഡ് ചെയ്യാം.',
    },
    {
      icon: ShieldCheck,
      arabicTitle: 'صلاحيات الإدارة',
      title: 'സുരക്ഷിത അഡ്മിൻ കൺട്രോൾ',
      desc: 'റിസൾട്ട് പബ്ലിഷിംഗ്, ഫോട്ടോ അപ്‌ലോഡിംഗ്, പ്രഖ്യാപനങ്ങൾ എന്നിവയ്ക്കായി സബ്-അഡ്മിൻ പെർമിഷൻ മാനേജ്‌മെന്റ്.',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <SectionTitle subtitle="മദ്‌റസാ മത്സര ക്രമീകരണങ്ങൾക്കായി സജ്ജീകരിച്ച പ്രത്യേക സേവനങ്ങൾ">
        പ്രധാന സവിശേഷതകൾ (Platform Highlights)
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-border-warm rounded-2xl p-5 flex gap-4 items-start shadow-sm hover:shadow-md hover:border-gold-500/60 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-950 to-emerald-800 text-gold-200 border border-gold-500/40 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans font-bold text-sm text-emerald-950">
                    {feature.title}
                  </h3>
                  <span className="font-amiri text-xs text-gold-600 font-bold tracking-wider">
                    {feature.arabicTitle}
                  </span>
                </div>
                <p className="text-xs text-text-dark/70 mt-1 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

