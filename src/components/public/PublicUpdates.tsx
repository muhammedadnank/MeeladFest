'use client';

import { useState, useEffect } from 'react';

interface IUpdate {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function PublicUpdates({ festId }: { festId: string }) {
  const [updates, setUpdates] = useState<IUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch(`/api/fests/${festId}/updates`);
        if (res.ok) {
          const data = await res.json();
          setUpdates(data.updates || []);
        }
      } catch (err) {
        console.error('Failed to load updates', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [festId]);

  if (loading) {
    return <div className="py-6 text-center text-slate-400 text-sm">Loading live updates...</div>;
  }

  if (updates.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {updates.map((update) => (
        <div
          key={update._id}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm hover:border-emerald-500/30 transition duration-300"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-100 text-base">{update.title}</h4>
            <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-3">
            {update.content}
          </p>
          {update.imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-800 max-h-80">
              <img
                src={update.imageUrl}
                alt={update.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
