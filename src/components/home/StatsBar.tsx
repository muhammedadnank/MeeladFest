interface StatsBarProps {
  festCount?: number;
}

export function StatsBar({ festCount }: StatsBarProps) {
  const countStr = festCount !== undefined ? `${festCount}` : '1';
  
  const stats = [
    { label: 'ആക്ടീവ് ഫെസ്റ്റിവലുകൾ', count: `${countStr}`, arabicNum: '١+', desc: 'Live Madrasa Fests' },
    { label: 'മത്സര വിഭാഗങ്ങൾ', count: '100+', arabicNum: '١٠٠+', desc: 'Programs & Stages' },
    { label: 'ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ്', count: '100%', arabicNum: '١٠٠٪', desc: 'Instant QR Verified' },
  ];

  return (
    <section className="bg-emerald-900 text-white py-6 px-4 border-y border-gold-500/30 relative overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-700/60">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${idx > 0 ? 'pt-4 md:pt-0' : ''} flex flex-col items-center justify-center`}>
            <div className="flex items-center gap-2">
              <span className="font-amiri font-bold text-3xl sm:text-4xl text-gold-200 drop-shadow-sm">
                {stat.count}
              </span>
              <span className="font-amiri text-lg text-emerald-300/60 font-semibold">
                ({stat.arabicNum})
              </span>
            </div>
            <div className="text-xs font-bold text-white mt-1 uppercase tracking-wider font-sans">
              {stat.label}
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5">{stat.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

