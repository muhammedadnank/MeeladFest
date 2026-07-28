'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface FestCountdownProps {
  targetDate?: string;
  festName: string;
}

export default function FestCountdown({ targetDate, festName }: FestCountdownProps) {
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
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Sparkles className="w-4 h-4" />
        Festival Active
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        🎉 Competition Live Now
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
        <Clock className="w-4 h-4 text-emerald-400" />
        Countdown to {festName}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px]">
          <div className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Days
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px]">
          <div className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Hours
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px]">
          <div className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Mins
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px]">
          <div className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Secs
          </div>
        </div>
      </div>
    </div>
  );
}
