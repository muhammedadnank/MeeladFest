import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GeometricPattern } from '@/components/ui/GeometricPattern';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Smartphone,
  Globe,
  Heart,
  FileCode2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'MeeladFest കുറിച്ച് (About MeeladFest Platform)',
  description:
    'കേരളത്തിലെ മദ്‌റസാ മീലാദ് കലോത്സവങ്ങൾക്ക് സൗജന്യവും വേഗതയേറിയതുമായ ഡിജിറ്റൽ മാനേജ്‌മെന്റ് പ്ലാറ്റ്‌ഫോം.',
};

export default function AboutPage() {
  const coreFeatures = [
    {
      icon: Zap,
      title: 'തത്സമയ പോയിന്റ് പട്ടിക (Real-time Leaderboard)',
      desc: 'ഓരോ മത്സരത്തിന്റെയും റിസൾട്ട് വന്ന് നിമിഷങ്ങൾക്കകം സ്വാഗതസംഘം, വിധികർത്താക്കൾ, കാണികൾ എന്നിവർക്ക് തത്സമയ പോയിന്റ് ലെവലുകൾ ലഭ്യമാകുന്നു.',
    },
    {
      icon: Award,
      title: 'സ്മാർട്ട് ക്യുആർ സർട്ടിഫിക്കറ്റ് (Smart QR Certificates)',
      desc: 'സ്ഥാനങ്ങളും പങ്കാളിത്തവും കൃത്യമായി രേഖപ്പെടുത്തിയ വാട്ടർമാർക്ക് ചെയ്ത ക്യുആർ കോഡ് സർട്ടിഫിക്കറ്റുകൾ തൽക്ഷണം വെരിഫൈ ചെയ്യാം.',
    },
    {
      icon: Smartphone,
      title: 'മൊബൈൽ ഒപ്റ്റിമൈസ്ഡ് ഇന്റർഫേസ് (Mobile First UI)',
      desc: 'മൊബൈൽ ഫോണുകളിലും ടാബുകളിലും ഡെസ്‌ക്‌ടോപ്പുകളിലും എളുപ്പത്തിൽ ഉപയോഗിക്കാവുന്ന ലളിതവും മനോഹരവുമായ രൂപകൽപ്പന.',
    },
    {
      icon: Users,
      title: 'ലളിതമായ അഡ്മിനിസ്ട്രേഷൻ (Zero Overhead Admin)',
      desc: 'എക്സൽ സീറ്റുകളോ സങ്കീർണ്ണമായ സോഫ്റ്റ്‌വെയറുകളോ ഇല്ലാതെ ഒറ്റ ലോഗിനിലൂടെ ഏത് ഫെസ്റ്റിവലും മിനിറ്റുകൾക്കുള്ളിൽ സെറ്റപ്പ് ചെയ്യാം.',
    },
    {
      icon: Lock,
      title: 'വ്യാജരഹിത സുതാര്യത (Tamper-proof Integrity)',
      desc: 'ചെസ്റ്റ് നമ്പറും വെരിഫിക്കേഷൻ കോഡും ഉപയോഗിച്ച് സർട്ടിഫിക്കറ്റിന്റെ അസൽ ഭംഗിയായി ആർക്കും എവിടെ നിന്നും പരിശോധിക്കാം.',
    },
    {
      icon: Heart,
      title: '100% സൗജന്യ സേവനം (100% Free & Open Mission)',
      desc: 'മദ്‌റസകൾക്കും കലോത്സവ സമിതികൾക്കും യാതൊരു വാർഷിക സബ്‌സ്‌ക്രിപ്‌ഷനോ ഒളിഞ്ഞിരിക്കുന്ന തുകയോ ഇല്ലാതെ സൗജന്യമായി ഉപയോഗിക്കാം.',
    },
  ];

  const techHighlights = [
    { name: 'Next.js 14 (App Router)', role: 'ഹൈ-പെർഫോമൻസ് സെർവർ സെയ്ഡ് റെൻഡറിംഗ്' },
    { name: 'MongoDB & Mongoose', role: 'സുരക്ഷിതവും വേഗമേറിയതുമായ ഡാറ്റാബേസ് അർക്കിടെക്ചർ' },
    { name: 'Tailwind CSS & Lucide Icons', role: 'ആധുനിക ഇസ്ലാമിക് ജിയോമെട്രിക് ഡിസൈൻ സിസ്റ്റം' },
    { name: 'Cloudinary & Resend API', role: 'തൽക്ഷണ സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡും നോട്ടിഫിക്കേഷനുകളും' },
  ];

  return (
    <div className="min-h-screen bg-cream text-text-dark flex flex-col font-inter">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <GeometricPattern className="absolute -top-10 -right-10 w-96 h-96 opacity-[0.08] text-gold-400 pointer-events-none" />
        <GeometricPattern className="absolute -bottom-10 -left-10 w-96 h-96 opacity-[0.06] text-emerald-400 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700/60 text-xs text-gold-300 font-semibold">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-amiri text-sm">عن مشروع ميلادفيست</span>
            <span>•</span>
            <span>വിവരണം & ലക്ഷ്യങ്ങൾ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-amiri text-gold-200 tracking-tight leading-tight">
            മദ്‌റസാ മീലാദ് കലോത്സവ ഡിജിറ്റലൈസേഷൻ പ്ലാറ്റ്‌ഫോം
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto leading-relaxed font-light">
            കേരളത്തിലെ ആയിരക്കണക്കിന് മദ്‌റസകളിലെ വിദ്യാർത്ഥികളുടെ സർഗ്ഗാത്മക കഴിവുകൾ മാറ്റുരയ്ക്കുന്ന മഹർജാനുൽ മീലാദ് കലോത്സവങ്ങൾക്ക് കൃത്യതയുള്ള തത്സമയ ഡിജിറ്റൽ സംവിധാനം ഒരുക്കുന്നു.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex-1">
        {/* Mission Overview */}
        <div className="bg-white border border-border-warm rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gold-500" />
              <span>എന്തുകൊണ്ട് MeeladFest? (Our Core Vision)</span>
            </h2>
            <p className="text-sm text-text-dark/80 leading-relaxed">
              പരമ്പരാഗതമായി മദ്‌റസാ കലോത്സവങ്ങളിൽ ഫലപ്രഖ്യാപനം, പേപ്പർ മാർക്ക് ഷീറ്റുകൾ തയ്യാറാക്കൽ, ടീം പോയിന്റുകൾ കൂട്ടൽ, സർട്ടിഫിക്കറ്റുകൾ എഴുതി തയ്യാറാക്കൽ എന്നിവ മണിക്കൂറുകൾ എടുക്കുന്ന പ്രക്രിയയാണ്. ഇതിന് പരിഹാരമായാണ് <strong>MeeladFest</strong> വികസിപ്പിച്ചെടുത്തത്.
            </p>
            <p className="text-sm text-text-dark/80 leading-relaxed">
              ഈ പ്ലാറ്റ്‌ഫോമിലൂടെ സ്വാഗതസംഘങ്ങൾക്ക് ഏതാനും ക്ലിക്കുകളിലൂടെ മത്സരക്രമങ്ങൾ നൽകാനും, അഡ്മിൻമാർക്ക് പോയിന്റുകൾ രേഖപ്പെടുത്താനും, വിദ്യാർത്ഥികൾക്ക് തൽക്ഷണം വെരിഫൈ ചെയ്ത ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റുകൾ നേടാനും സാധിക്കുന്നു.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-6">
          <SectionTitle subtitle="ഏതൊരു മദ്‌റസാ കലോത്സവവും അനായാസം കൈകാര്യം ചെയ്യാൻ സഹായിക്കുന്ന സംവിധാനങ്ങൾ">
            പ്രധാന ഫീച്ചറുകൾ (Platform Capabilities)
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-border-warm rounded-2xl p-6 hover:border-gold-500/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center mb-4 group-hover:bg-emerald-950 group-hover:text-gold-300 transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-emerald-950 mb-2">{feat.title}</h3>
                  <p className="text-xs text-text-dark/70 leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack & Architecture */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900 shadow-sm relative overflow-hidden">
          <GeometricPattern className="absolute top-0 right-0 w-80 h-80 opacity-[0.05] text-gold-400 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div>
              <div className="text-gold-300 font-amiri text-lg font-bold">التكنولوجيا المستخدمة</div>
              <h2 className="text-2xl font-extrabold text-white">
                സാങ്കേതിക മികവ് (Technology & Reliability)
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-2xl">
                കൂടുതൽ ആളുകൾ ഒരേസമയം റിസൾട്ടുകൾ നോക്കുമ്പോഴും തടസ്സമില്ലാതെ പ്രവർത്തിക്കാൻ modern full-stack ടെക്നോളജിയാണ് ഉപയോഗിച്ചിരിക്കുന്നത്.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techHighlights.map((tech, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-800">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode2 className="w-4 h-4 text-gold-400" />
                    <span className="font-bold text-xs text-gold-200">{tech.name}</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/70 font-light">{tech.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action & Support */}
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-gold-500/10 border border-gold-500/30 rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-amiri">
            നിങ്ങളുടെ മദ്‌റസയിലും MeeladFest ആരംഭിക്കണോ?
          </h2>
          <p className="text-xs sm:text-sm text-text-dark/80 max-w-xl mx-auto leading-relaxed font-light">
            ലളിതമായ രജിസ്ട്രേഷനിലൂടെ ഫെസ്റ്റിവൽ പോർട്ടൽ സജ്ജീകരിക്കാം. അഡ്മിൻ പാനലിൽ ലോഗിൻ ചെയ്യുകയോ കൂടുതൽ വിവരങ്ങൾക്ക് ടീമുമായി ബന്ധപ്പെടുകയോ ചെയ്യാം.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-gold-200 text-xs font-bold transition-all shadow-md border border-gold-500/40 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-gold-300" />
              <span>അഡ്മിൻ പോർട്ടൽ (Admin Login)</span>
            </Link>
            <Link
              href="/#active-fests"
              className="px-6 py-3 rounded-xl bg-white hover:bg-cream border border-border-warm text-emerald-950 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>ആക്ടീവ് ഫെസ്റ്റിവലുകൾ (Browse Fests)</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
