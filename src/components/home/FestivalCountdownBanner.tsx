'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Trophy } from 'lucide-react';

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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border border-emerald-700/30 p-6 sm:p-10 text-white shadow-2xl">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Fest Details */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Upcoming Festival Spotlight</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-wide text-amber-100">
              {currentFest ? currentFest.festName : 'Kerala State Meelad Festival 2026'}
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl font-light">
              {currentFest?.description ||
                'Join thousands of participants across Kerala competing in Quran Recitation, Islamic Songs, Elocution, and Cultural Events.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200/90 pt-1">
              <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700/40">
                <MapPin className="w-4 h-4 text-gold" />
                <span>{currentFest?.venue || currentFest?.area || 'State Level Arena'}</span>
                {currentFest?.district && <span className="opacity-75">({currentFest.district})</span>}
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700/40">
                <Calendar className="w-4 h-4 text-gold" />
                <span>{currentFest?.date || 'Grand Finale Schedule'}</span>
              </div>
            </div>

            {/* Select Fest Dropdown if multiple fests exist */}
            {fests && fests.length > 1 && (
              <div className="pt-2">
                <label htmlFor="fest-select" className="text-xs text-emerald-300 mr-2 font-medium">
                  Select Fest:
                </label>
                <select
                  id="fest-select"
                  value={selectedFestIndex}
                  onChange={(e) => setSelectedFestIndex(Number(e.target.value))}
                  className="bg-emerald-950 border border-emerald-700/60 text-emerald-100 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-gold outline-none"
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

          {/* Right Column: Countdown Clock */}
          <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-3">
              <Clock className="w-4 h-4 text-gold animate-spin-slow" />
              <span>{timeLeft.isPast ? 'Status' : 'Event Starts In'}</span>
            </div>

            {mounted && timeLeft.isPast ? (
              <div className="bg-emerald-900/90 border border-emerald-500/50 rounded-2xl p-6 text-center max-w-sm">
                <Trophy className="w-10 h-10 text-gold mx-auto mb-2 animate-bounce" />
                <h3 className="text-lg font-bold text-white">Festival In Progress / Live!</h3>
                <p className="text-xs text-emerald-200 mt-1">Check out live scores and stage updates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-slate-900/90 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[84px] shadow-inner">
                  <div className="text-2xl sm:text-4xl font-black text-gold font-mono">
                    {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/70 font-bold uppercase tracking-wider mt-1">
                    Days
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[84px] shadow-inner">
                  <div className="text-2xl sm:text-4xl font-black text-gold font-mono">
                    {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/70 font-bold uppercase tracking-wider mt-1">
                    Hours
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[84px] shadow-inner">
                  <div className="text-2xl sm:text-4xl font-black text-gold font-mono">
                    {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/70 font-bold uppercase tracking-wider mt-1">
                    Mins
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[84px] shadow-inner">
                  <div className="text-2xl sm:text-4xl font-black text-gold font-mono">
                    {mounted ? String(timeLeft.seconds).padStart(2, '0') : '00'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/70 font-bold uppercase tracking-wider mt-1">
                    Secs
                  </div>
                </div>
              </div>
            )}

            {/* Action CTA */}
            {currentFest && (
              <Link
                href={`/fests/${currentFest.slug}`}
                className="mt-6 inline-flex items-center gap-2 bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-gold/20 transform hover:-translate-y-0.5"
              >
                <span>View Festival Schedule & Live Points</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
