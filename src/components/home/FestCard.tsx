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
      className="group bg-white border border-border-warm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:border-gold-500/60 flex flex-col justify-between"
    >
      {/* Dark Emerald Top Card Header with Arch Accent */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-5 relative overflow-hidden text-white border-b-2 border-gold-500/40">
        <GeometricPattern className="absolute -top-4 -right-4 w-36 h-36 opacity-[0.14] text-gold-500 pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <LiveBadge label="Live Fest" />
          <OfficialChip label="Verified Fest" />
        </div>

        <h3 className="font-amiri font-bold text-xl sm:text-2xl text-white group-hover:text-gold-200 transition-colors relative z-10 leading-tight">
          {fest.festName}
        </h3>

        <p className="text-xs text-emerald-100/90 mt-2 flex items-center gap-1.5 relative z-10 font-medium">
          <Building2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
          <span>{fest.madrasaName}</span>
        </p>
      </div>

      {/* Card Body Info */}
      <div className="p-5 space-y-2.5 text-xs text-text-dark/80 bg-cream/30">
        <div className="flex items-center gap-2 text-text-dark/80">
          <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            <strong>{fest.area}</strong>, {fest.district}
          </span>
        </div>

        {fest.date && (
          <div className="flex items-center gap-2 text-text-dark/80">
            <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{fest.date}</span>
          </div>
        )}

        {fest.description && (
          <p className="text-xs text-text-dark/70 line-clamp-2 pt-2 border-t border-border-warm/60 font-light">
            {fest.description}
          </p>
        )}
      </div>

      {/* Card Footer CTA */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50 to-white border-t border-border-warm flex items-center justify-between text-xs font-bold text-emerald-950 group-hover:text-emerald-800">
        <span>View Points & Live Results</span>
        <ArrowRight className="w-4 h-4 text-gold-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

