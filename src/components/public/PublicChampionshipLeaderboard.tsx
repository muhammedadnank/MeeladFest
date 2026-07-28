'use client';

import { useState, useEffect } from 'react';
import { Award, Trophy, Medal, Sparkles, UserCheck } from 'lucide-react';

interface IIndividualLeaderboardItem {
  participantId: string;
  chestNo: string;
  name: string;
  teamName: string;
  teamCode: string;
  categoryName: string;
  totalPoints: number;
  firstCount: number;
  secondCount: number;
  thirdCount: number;
  rank: number;
}

export default function PublicChampionshipLeaderboard({ festId }: { festId: string }) {
  const [leaderboard, setLeaderboard] = useState<IIndividualLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`/api/fests/${festId}/leaderboard/championship`);
        if (res.ok) {
          const data = await res.json();
          // Extract championship array or leaderboard array
          const raw = data.championship || data.leaderboard || [];
          const formatted: IIndividualLeaderboardItem[] = raw.map((item: any) => ({
            participantId: item.participantId || item.participant?._id || Math.random().toString(),
            chestNo: item.chestNo || item.participant?.chestNo || '---',
            name: item.name || item.participant?.name || 'Participant',
            teamName: item.teamName || item.team?.name || 'Independent',
            teamCode: item.teamCode || item.team?.code || '',
            categoryName: item.categoryName || item.category?.name || 'General',
            totalPoints: item.totalPoints || 0,
            firstCount: item.firstCount || 0,
            secondCount: item.secondCount || 0,
            thirdCount: item.thirdCount || 0,
            rank: item.rank || 1,
          }));
          setLeaderboard(formatted);
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
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Calculating Individual Championship...</span>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
        <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">No Championship Scores Yet</h3>
        <p className="text-xs text-slate-500 mt-1">Individual points will appear here as item results are published.</p>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const categories = Array.from(new Set(leaderboard.map((item) => item.categoryName))).filter(Boolean);

  const filteredLeaderboard = filterCategory === 'all'
    ? leaderboard
    : leaderboard.filter((item) => item.categoryName === filterCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories ({leaderboard.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Top 3 Champions Podium Cards */}
      {top3.length > 0 && filterCategory === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rank 1 - Center or First */}
          {top3[0] && (
            <div className="relative group bg-gradient-to-b from-amber-500/15 via-slate-900/80 to-slate-900/90 border border-amber-500/40 rounded-3xl p-5 text-center shadow-xl shadow-amber-500/10 backdrop-blur-md md:order-2 md:-translate-y-2 transition-transform duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Trophy className="w-3 h-3" /> Champion #1
              </div>

              <div className="w-16 h-16 mx-auto mt-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                🥇
              </div>

              <div className="mt-3">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                  #{top3[0].chestNo}
                </span>
                <h4 className="text-base font-extrabold text-white mt-1.5 line-clamp-1">{top3[0].name}</h4>
                <p className="text-xs text-slate-400 font-medium">
                  {top3[0].teamName} {top3[0].teamCode && `(${top3[0].teamCode})`}
                </p>
                <div className="mt-1 text-[11px] text-amber-400/80 font-semibold">{top3[0].categoryName}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Points</span>
                <span className="text-xl font-black font-mono text-amber-300">{top3[0].totalPoints} pts</span>
              </div>
            </div>
          )}

          {/* Rank 2 */}
          {top3[1] && (
            <div className="relative group bg-gradient-to-b from-slate-400/10 via-slate-900/80 to-slate-900/90 border border-slate-400/30 rounded-3xl p-5 text-center shadow-lg backdrop-blur-md md:order-1 transition-transform duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Medal className="w-3 h-3" /> Runner Up #2
              </div>

              <div className="w-14 h-14 mx-auto mt-2 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                🥈
              </div>

              <div className="mt-3">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700">
                  #{top3[1].chestNo}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{top3[1].name}</h4>
                <p className="text-xs text-slate-400">
                  {top3[1].teamName} {top3[1].teamCode && `(${top3[1].teamCode})`}
                </p>
                <div className="mt-1 text-[11px] text-slate-400 font-semibold">{top3[1].categoryName}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Points</span>
                <span className="text-lg font-bold font-mono text-slate-200">{top3[1].totalPoints} pts</span>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3[2] && (
            <div className="relative group bg-gradient-to-b from-amber-700/15 via-slate-900/80 to-slate-900/90 border border-amber-700/30 rounded-3xl p-5 text-center shadow-lg backdrop-blur-md md:order-3 transition-transform duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Award className="w-3 h-3" /> 3rd Rank
              </div>

              <div className="w-14 h-14 mx-auto mt-2 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-amber-100 font-black text-lg flex items-center justify-center shadow-md">
                🥉
              </div>

              <div className="mt-3">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-amber-300 text-xs font-mono font-bold border border-slate-700">
                  #{top3[2].chestNo}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{top3[2].name}</h4>
                <p className="text-xs text-slate-400">
                  {top3[2].teamName} {top3[2].teamCode && `(${top3[2].teamCode})`}
                </p>
                <div className="mt-1 text-[11px] text-amber-500/80 font-semibold">{top3[2].categoryName}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Points</span>
                <span className="text-lg font-bold font-mono text-amber-400">{top3[2].totalPoints} pts</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Individual Leaderboard Table */}
      <div className="w-full overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Full Individual Leaderboard</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">{filteredLeaderboard.length} Participants</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 text-center w-16">Rank</th>
                <th className="px-4 py-3.5">Chest No</th>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">Team</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-center">1st/2nd/3rd</th>
                <th className="px-5 py-3.5 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLeaderboard.map((item) => (
                <tr key={item.participantId} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-5 py-4 text-center font-mono font-bold text-sm">
                    {item.rank === 1 && <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">🥇 #1</span>}
                    {item.rank === 2 && <span className="text-slate-300 bg-slate-400/10 px-2 py-1 rounded-lg border border-slate-400/20">🥈 #2</span>}
                    {item.rank === 3 && <span className="text-amber-600 bg-amber-700/10 px-2 py-1 rounded-lg border border-amber-700/20">🥉 #3</span>}
                    {item.rank > 3 && <span className="text-slate-400 font-mono">#{item.rank}</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      #{item.chestNo}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 text-slate-300 text-xs font-medium">
                    {item.teamName} {item.teamCode && <span className="text-slate-500 font-mono">({item.teamCode})</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-xs font-mono">
                    <span className="text-amber-400 font-bold">{item.firstCount}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-slate-300 font-bold">{item.secondCount}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-amber-600 font-bold">{item.thirdCount}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-black text-emerald-400 text-lg">
                    {item.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
