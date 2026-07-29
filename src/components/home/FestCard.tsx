import Link from 'next/link';
import { Building2, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { OfficialChip } from '@/components/ui/OfficialChip';
import { GeometricPattern } from '@/components/ui/GeometricPattern';

interface FestCardProps {
  fest: {
    _id: string;
    slug: string;
    festName: string;
    madrasaName: string;
    area: string;
    district: string;
    date?: string;
    description?: string;
  };
}

export function FestCard({ fest }: FestCardProps) {
  return (
    <Link
      href={`/fests/${fest.slug}`}
      className="group bg-white border border-border-warm rounded-card overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-emerald-800 flex flex-col justify-between"
    >
      {/* Dark Emerald Top Card Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 p-5 relative overflow-hidden text-white">
        <GeometricPattern className="absolute -top-4 -right-4 w-32 h-32 opacity-[0.12] text-white pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <LiveBadge label="Live Fest" />
          <OfficialChip label="Verified Page" />
        </div>

        <h3 className="font-amiri font-bold text-xl sm:text-2xl text-white group-hover:text-gold-200 transition-colors relative z-10 leading-tight">
          {fest.festName}
        </h3>

        <p className="text-xs text-emerald-100/90 mt-1.5 flex items-center gap-1.5 relative z-10">
          <Building2 className="w-3.5 h-3.5 text-gold-200 shrink-0" />
          <span>{fest.madrasaName}</span>
        </p>
      </div>

      {/* Card Body Info */}
      <div className="p-5 space-y-2.5 text-xs text-text-dark/80 bg-cream/40">
        <div className="flex items-center gap-2 text-text-dark/70">
          <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            {fest.area}, {fest.district}
          </span>
        </div>

        {fest.date && (
          <div className="flex items-center gap-2 text-text-dark/70">
            <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{fest.date}</span>
          </div>
        )}

        {fest.description && (
          <p className="text-xs text-text-dark/60 line-clamp-2 pt-1 border-t border-border-warm/60">
            {fest.description}
          </p>
        )}
      </div>

      {/* Card Footer CTA */}
      <div className="px-5 py-3.5 bg-white border-t border-border-warm flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
        <span>View Leaderboard & Results</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
