import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2 font-serif">
        <span className="text-gold-500 font-amiri text-base">۞</span>
        <span>{children}</span>
      </h2>
      {subtitle && <p className="text-xs text-text-dark/70 mt-1 pl-6 font-sans font-light">{subtitle}</p>}
    </div>
  );
}

