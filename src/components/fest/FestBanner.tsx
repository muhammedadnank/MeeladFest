import { Building2, MapPin, Calendar, Sparkles } from 'lucide-react';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { OfficialChip } from '@/components/ui/OfficialChip';
import { GeometricPattern } from '@/components/ui/GeometricPattern';
import FestCountdown from '@/components/public/FestCountdown';

interface FestBannerProps {
  fest: {
    _id: string;
    festName: string;
    madrasaName: string;
    area: string;
    district: string;
    venue?: string;
    date?: string;
    description?: string;
    isActive?: boolean;
  };
}

export function FestBanner({ fest }: FestBannerProps) {
  return (
    <section className="relative bg-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-lg">
      <GeometricPattern className="absolute -top-10 -right-10 w-96 h-96 opacity-[0.08] text-white pointer-events-none" />
      <GeometricPattern className="absolute -bottom-20 -left-20 w-80 h-80 opacity-[0.05] text-white pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <OfficialChip label="Official Fest Page" />
            {fest.isActive && <LiveBadge label="Live Event" />}
          </div>
          <p className="font-amiri text-lg text-gold-200 tracking-widest hidden sm:block">
            مَوْلِدُ النَّبِيِّ ﷺ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="font-amiri font-bold text-3xl sm:text-5xl text-white leading-tight">
              {fest.festName}
            </h1>

            <p className="text-sm sm:text-base text-gold-200 font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-500 shrink-0" />
              <span>{fest.madrasaName}</span>
            </p>

            {fest.description && (
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
                {fest.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2.5 pt-2 text-xs text-white/90">
              <div className="flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-800 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>
                  {fest.area}, {fest.district}
                </span>
              </div>

              {fest.venue && (
                <div className="flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-800 px-3 py-1.5 rounded-lg">
                  <Building2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>Venue: {fest.venue}</span>
                </div>
              )}

              {fest.date && (
                <div className="flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-800 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>{fest.date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Widget */}
          <div className="w-full">
            <FestCountdown targetDate={fest.date} festName={fest.festName} />
          </div>
        </div>
      </div>
    </section>
  );
}
