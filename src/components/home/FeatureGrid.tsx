import { Trophy, Medal, Award, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function FeatureGrid() {
  const features = [
    {
      icon: Trophy,
      title: 'Live Team Standings & Podium',
      desc: 'Real-time updated point table with 3D podium for top 3 teams and score progress bars.',
    },
    {
      icon: Medal,
      title: 'Individual Championship',
      desc: 'Category-filtered rankings for Sub-Junior, Junior, and Senior participant points.',
    },
    {
      icon: Award,
      title: 'Instant Certificate Engine',
      desc: 'Download authentic PDF certificates instantly by entering participant chest numbers.',
    },
    {
      icon: ShieldCheck,
      title: 'Sub-Admin Permissions',
      desc: 'Granular access control for result publishing, photo uploads, and event announcements.',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <SectionTitle subtitle="Built specifically for Madrasa competition workflows">
        Platform Highlights
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-border-warm rounded-card p-5 flex gap-3.5 items-start shadow-sm hover:border-emerald-800/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-amiri font-bold text-base text-emerald-950">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-dark/70 mt-1 leading-relaxed">
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
