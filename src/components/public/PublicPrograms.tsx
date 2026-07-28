'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface Program {
  _id: string;
  time: string;
  title: string;
  description?: string;
  order: number;
}

interface PublicProgramsProps {
  festIdOrSlug: string;
}

export default function PublicPrograms({ festIdOrSlug }: PublicProgramsProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await fetch(`/api/fests/${festIdOrSlug}/programs`);
      if (!res.ok) {
        throw new Error('Failed to load program schedule');
      }
      const data = await res.json();
      setPrograms(data.programs || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [festIdOrSlug]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span className="text-sm">Loading schedule...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
        <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-semibold">Program schedule not announced yet</p>
        <p className="text-xs text-slate-500 mt-1">Please check back closer to the event date.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-4 sm:pl-6 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500/50 before:to-slate-800">
      {programs.map((item) => (
        <div key={item._id} className="relative group">
          {/* Timeline Dot */}
          <div className="absolute -left-[21px] sm:-left-[29px] top-1.5 w-3 h-3 rounded-full bg-emerald-400 border-4 border-slate-950 group-hover:scale-125 transition-transform" />

          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="w-3.5 h-3.5" />
                {item.time}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-100">{item.title}</h4>

            {item.description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
