import React from 'react';
import { Compass } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No Items Displayed Yet',
  description = 'Events and results will appear here as soon as they are announced.',
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-border-warm rounded-card p-8 text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
        <Compass className="w-6 h-6" />
      </div>
      <h3 className="font-amiri font-bold text-lg text-emerald-950">{title}</h3>
      <p className="text-xs text-text-dark/70 mt-1 leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
