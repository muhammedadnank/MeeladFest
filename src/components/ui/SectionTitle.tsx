import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xs font-semibold text-text-dark uppercase tracking-[0.08em] flex items-center gap-2.5 before:content-[''] before:inline-block before:w-[3.5px] before:h-[15px] before:bg-emerald-800 before:rounded-sm">
        {children}
      </h2>
      {subtitle && <p className="text-xs text-text-dark/60 mt-1 pl-3.5">{subtitle}</p>}
    </div>
  );
}
