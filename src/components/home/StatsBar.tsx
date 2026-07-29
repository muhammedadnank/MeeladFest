interface StatsBarProps {
  festCount?: number;
}

export function StatsBar({ festCount }: StatsBarProps) {
  const activeFestsDisplay = festCount !== undefined ? `${festCount}` : '١+';
  
  const stats = [
    { label: 'Active Festivals', count: activeFestsDisplay, desc: 'Live Madrasa Fests' },
    { label: 'Competitions & Stages', count: '١٠٠+', desc: 'Sub-category Programs' },
    { label: 'Certificates Engine', count: '١٠٠%', desc: 'Instant QR Verification' },
  ];

  return (
    <section className="bg-emerald-800 text-white py-6 px-4 border-y border-emerald-950/40">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-600/50">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${idx > 0 ? 'pt-4 md:pt-0' : ''}`}>
            <div className="font-amiri font-bold text-2xl sm:text-3xl text-gold-200">
              {stat.count}
            </div>
            <div className="text-xs font-semibold text-white mt-1 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="text-[11px] text-emerald-100/70">{stat.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
