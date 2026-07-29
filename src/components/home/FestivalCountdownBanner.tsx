'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { GeometricPattern } from '@/components/ui/GeometricPattern';

interface FestItem {
  _id: string;
  slug: string;
  festName: string;
  madrasaName?: string;
  venue?: string;
  district?: string;
  area?: string;
  date?: string;
  description?: string;
}

interface FestivalCountdownBannerProps {
  fests: FestItem[];
}

function parseFestDate(dateStr?: string): number | null {
  if (!dateStr || !dateStr.trim()) return null;
  const str = dateStr.trim();

  let ts = new Date(str).getTime();
  if (!isNaN(ts)) return ts;

  const match = str.match(/\(([^)]+)\)/) || str.match(/\b(\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2})\b/);
  if (match) {
    ts = new Date(match[1] || match[0]).getTime();
    if (!isNaN(ts)) return ts;
  }

  return null;
}

export function FestivalCountdownBanner({ fests }: FestivalCountdownBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedFestIndex, setSelectedFestIndex] = useState(0);

  // Default target date if fest doesn't have a parseable future date (Default: September 15, 2026 - Meelad Season)
  const defaultFutureDate = new Date('2026-09-15T09:00:00+05:30').getTime();

  const currentFest = fests && fests.length > 0 ? fests[selectedFestIndex] : null;

  const targetTimestamp = currentFest?.date
    ? parseFestDate(currentFest.date) || defaultFutureDate
    : defaultFutureDate;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-gold-500/40 p-6 sm:p-10 text-white shadow-2xl">
        {/* Signature Islamic Lattice Overlays */}
        <GeometricPattern className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.14] text-gold-500 pointer-events-none" />
        <GeometricPattern className="absolute -bottom-10 -left-10 w-72 h-72 opacity-[0.12] text-emerald-400 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Fest Details */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-900/90 text-gold-200 border border-gold-500/40 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
              <span className="font-amiri text-sm font-bold text-gold-200">۞ مَهْرَجَانُ الْمِيلَاد ۞</span>
              <span className="hidden sm:inline text-emerald-300/60">•</span>
              <span className="hidden sm:inline">കൗണ്ട്‌ഡൗൺ ടൈമർ (Festival Spotlight)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-amiri font-bold tracking-wide text-gold-200 drop-shadow-md">
              {currentFest ? currentFest.festName : 'കേരള സ്റ്റേറ്റ് മീലാദ് ഫെസ്റ്റിവൽ 2026'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl font-light leading-relaxed">
              {currentFest?.description ||
                'ഖുർആൻ പാരായണം, നഅ്ത് ഷെരീഫ്, ഇസ്ലാമിക ഗാനങ്ങൾ, പ്രസംഗ മത്സരം തുടങ്ങി വിവിധ വേദികളിൽ നടക്കുന്ന മത്സരങ്ങളുടെ തത്സമയ പോയിന്റ് വിവരങ്ങൾ.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-emerald-200/90 pt-1">
              <div className="flex items-center gap-1.5 bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/50 shadow-sm">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{currentFest?.venue || currentFest?.area || 'സ്റ്റേറ്റ് തല വേദി'}</span>
                {currentFest?.district && <span className="text-emerald-300/80">({currentFest.district})</span>}
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-900/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/50 shadow-sm">
                <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{currentFest?.date || 'ഗ്രാൻഡ് ഫിനാലെ തിയ്യതി'}</span>
              </div>
            </div>

            {/* Select Fest Dropdown if multiple fests exist */}
            {fests && fests.length > 1 && (
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2">
                <label htmlFor="fest-select" className="text-xs text-gold-200 font-semibold font-amiri">
                  ഫെസ്റ്റിവൽ തിരഞ്ഞെടുക്കുക:
                </label>
                <select
                  id="fest-select"
                  value={selectedFestIndex}
                  onChange={(e) => setSelectedFestIndex(Number(e.target.value))}
                  className="bg-emerald-950 border border-gold-500/40 text-gold-100 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-gold-500 outline-none shadow-inner cursor-pointer"
                >
                  {fests.map((fest, idx) => (
                    <option key={fest._id} value={idx}>
                      {fest.festName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right Column: Countdown Clock with Islamic Card Framing */}
          <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs text-gold-200 font-semibold uppercase tracking-wider mb-3">
              <span className="font-amiri text-sm text-gold-500">۞</span>
              <Clock className="w-4 h-4 text-gold-500 animate-spin-slow" />
              <span>{timeLeft.isPast ? 'മത്സരം ആരംഭിച്ചു' : 'കൗണ്ട്‌ഡൗൺ (Starts In)'}</span>
              <span className="font-amiri text-sm text-gold-500">۞</span>
            </div>

            {mounted && timeLeft.isPast ? (
              <div className="bg-emerald-900/90 border border-gold-500/50 rounded-2xl p-6 text-center max-w-sm shadow-lg">
                <Trophy className="w-10 h-10 text-gold-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-lg font-amiri font-bold text-gold-200">ഫെസ്റ്റിവൽ പുരോഗമിക്കുന്നു!</h3>
                <p className="text-xs text-emerald-100/80 mt-1">തത്സമയ പോയിന്റ് നിലകളും റിസൾട്ടുകളും കാണുക.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-emerald-950/90 border border-gold-500/40 rounded-2xl p-3 sm:p-4 min-w-[72px] sm:min-w-[88px] shadow-lg flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gold-200 font-amiri">
                    {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-200 font-bold uppercase tracking-wider mt-1">
                    ദിവസം
                  </div>
                  <div className="text-[9px] text-emerald-300/60 font-amiri">أيام</div>
                </div>

                <div className="bg-emerald-950/90 border border-gold-500/40 rounded-2xl p-3 sm:p-4 min-w-[72px] sm:min-w-[88px] shadow-lg flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gold-200 font-amiri">
                    {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-200 font-bold uppercase tracking-wider mt-1">
                    മണിക്കൂർ
                  </div>
                  <div className="text-[9px] text-emerald-300/60 font-amiri">ساعات</div>
                </div>

                <div className="bg-emerald-950/90 border border-gold-500/40 rounded-2xl p-3 sm:p-4 min-w-[72px] sm:min-w-[88px] shadow-lg flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gold-200 font-amiri">
                    {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-200 font-bold uppercase tracking-wider mt-1">
                    മിനിറ്റ്
                  </div>
                  <div className="text-[9px] text-emerald-300/60 font-amiri">دقائق</div>
                </div>

                <div className="bg-emerald-950/90 border border-gold-500/40 rounded-2xl p-3 sm:p-4 min-w-[72px] sm:min-w-[88px] shadow-lg flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gold-200 font-amiri">
                    {mounted ? String(timeLeft.seconds).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-200 font-bold uppercase tracking-wider mt-1">
                    സെക്കൻഡ്
                  </div>
                  <div className="text-[9px] text-emerald-300/60 font-amiri">ثواني</div>
                </div>
              </div>
            )}

            {/* Action CTA */}
            {currentFest && (
              <Link
                href={`/fests/${currentFest.slug}`}
                className="mt-6 inline-flex items-center gap-2 bg-gold-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xl hover:shadow-gold/20 transform hover:-translate-y-0.5"
              >
                <span>ഷെഡ്യൂളും ലൈവ് പോയിന്റുകളും കാണുക</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

