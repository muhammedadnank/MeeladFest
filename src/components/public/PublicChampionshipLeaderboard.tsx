'use client';

import { useState, useEffect } from 'react';

interface IIndividualLeaderboardItem {
  participantId: string;
  chestNo: string;
  name: string;
  teamName: string;
  teamCode: string;
  categoryName: string;
  totalPoints: number;
  rank: number;
}

export default function PublicChampionshipLeaderboard({ festId }: { festId: string }) {
  const [leaderboard, setLeaderboard] = useState<IIndividualLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`/api/fests/${festId}/leaderboard/championship`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (err) {
        console.error('Failed to load championship leaderboard', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [festId]);

  if (loading) {
    return <div className="py-6 text-center text-slate-400 text-sm">Loading individual championship...</div>;
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        No individual championship scores calculated yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 text-center">Rank</th>
              <th className="px-4 py-3">Chest No</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leaderboard.map((item) => (
              <tr key={item.participantId} className="hover:bg-slate-800/30 transition">
                <td className="px-4 py-3 text-center font-mono font-bold">
                  {item.rank === 1 && <span className="text-amber-400">🥇 1</span>}
                  {item.rank === 2 && <span className="text-slate-300">🥈 2</span>}
                  {item.rank === 3 && <span className="text-amber-600">🥉 3</span>}
                  {item.rank > 3 && <span className="text-slate-400">#{item.rank}</span>}
                </td>
                <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{item.chestNo}</td>
                <td className="px-4 py-3 font-medium text-slate-100">{item.name}</td>
                <td className="px-4 py-3 text-slate-400">
                  {item.teamName} <span className="text-xs text-slate-500">({item.teamCode})</span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{item.categoryName}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 text-base">
                  {item.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
