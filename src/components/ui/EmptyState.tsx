import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'നിലവിൽ ഫെസ്റ്റിവലുകൾ ലഭ്യമല്ല',
  description = 'പുതിയ മത്സരങ്ങളും ഫലങ്ങളും പ്രഖ്യാപിക്കുമ്പോൾ ഇവിടെ ലഭ്യമാകുന്നതാണ്.',
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white border-2 border-gold-500/30 rounded-3xl p-8 text-center max-w-md mx-auto my-8 shadow-sm relative overflow-hidden">
      {/* Top Islamic Motif Badge */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-950 to-emerald-900 text-gold-200 border-2 border-gold-500/40 flex items-center justify-center mx-auto mb-4 shadow-md font-amiri text-2xl font-bold">
        ☽
      </div>

      <p className="font-amiri text-xs text-gold-600 font-bold tracking-widest mb-1">
        ۞ لا توجد بيانات حاليا ۞
      </p>

      <h3 className="font-sans font-bold text-base text-emerald-950">{title}</h3>
      <p className="text-xs text-text-dark/70 mt-1.5 leading-relaxed font-light">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

