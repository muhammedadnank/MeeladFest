'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Award, RefreshCw, User, Shield, Search, Filter } from 'lucide-react';

interface PublicLeaderboardProps {
  festIdOrSlug: string;
  categories?: Array<{ _id: string; name: string }>;
}

export default function PublicLeaderboard({ festIdOrSlug, categories: initialCategories }: PublicLeaderboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'teams' | 'championship'>('teams');
  const [teamLeaderboard, setTeamLeaderboard] = useState<any[]>([]);
  const [championship, setChampionship] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>(initialCategories || []);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetch(`/api/fests/${festIdOrSlug}/categories`)
        .then((res) => res.json())
        .then((data) => {
          if (data.categories) setCategories(data.categories);
        })
        .catch((err) => console.error('Failed to load categories:', err));
    }
  }, [festIdOrSlug, initialCategories]);

  const fetchLeaderboards = useCallback(async () => {
    try {
      setLoading(true);
      const [teamRes, champRes] = await Promise.all([
        fetch(`/api/fests/${festIdOrSlug}/leaderboard/teams`),
        fetch(
          `/api/fests/${festIdOrSlug}/leaderboard/championship${
            selectedCategory ? `?categoryId=${selectedCategory}` : ''
          }`
        ),
      ]);

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamLeaderboard(teamData.leaderboard || []);
      }
      if (champRes.ok) {
        const champData = await champRes.json();
        setChampionship(champData.championship || []);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load leaderboards:', err);
    } finally {
      setLoading(false);
    }
  }, [festIdOrSlug, selectedCategory]);

  useEffect(() => {
    fetchLeaderboards();
  }, [fetchLeaderboards]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLeaderboards();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLeaderboards]);

  // Leading team max points for relative progress bar calculation
  const maxTeamPoints = teamLeaderboard.length > 0 ? teamLeaderboard[0].totalPoints || 1 : 1;

  // Filtered championship items
  const filteredChampionship = championship.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const pName = item.participant?.name?.toLowerCase() || '';
    const pChest = item.participant?.chestNo?.toLowerCase() || '';
    const tName = item.team?.name?.toLowerCase() || '';
    return pName.includes(query) || pChest.includes(query) || tName.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Controls & Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex items-center gap-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'teams'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Team Standings
          </button>
          <button
            onClick={() => setActiveSubTab('championship')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'championship'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Individual Championship
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="hidden sm:inline text-slate-500">Auto-refresh (30s):</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-colors ${
                autoRefresh
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>

          <button
            onClick={fetchLeaderboards}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline font-semibold">Refresh</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Team Standings */}
      {activeSubTab === 'teams' && (
        <div className="space-y-4">
          {loading && teamLeaderboard.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading live team leaderboard...</p>
            </div>
          ) : teamLeaderboard.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Team Standings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Points will appear automatically as competition results are declared.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamLeaderboard.map((item) => {
                const percentage = Math.max(
                  5,
                  Math.min(100, Math.round((item.totalPoints / maxTeamPoints) * 100))
                );

                return (
                  <div
                    key={item.team._id}
                    className="relative overflow-hidden bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg"
                  >
                    {/* Background Subtle Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-emerald-500/5 transition-all duration-700 pointer-events-none"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between gap-4">
                      {/* Rank & Team Details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                            item.rank === 1
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/10'
                              : item.rank === 2
                              ? 'bg-slate-300/20 border-slate-300/40 text-slate-200'
                              : item.rank === 3
                              ? 'bg-amber-700/20 border-amber-700/40 text-amber-500'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                              style={{ backgroundColor: item.team.color || '#10b981' }}
                            />
                            <h4 className="text-base font-bold text-white truncate">
                              {item.team.name}
                            </h4>
                            {item.team.code && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                                {item.team.code}
                              </span>
                            )}
                          </div>

                          {/* Position Tallies */}
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                            <span className="text-amber-400 font-semibold">🥇 {item.firstCount} Firsts</span>
                            <span className="text-slate-300 font-semibold">🥈 {item.secondCount} Seconds</span>
                            <span className="text-amber-600 font-semibold">🥉 {item.thirdCount} Thirds</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Points Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                          {item.totalPoints}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Points
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: Individual Championship */}
      {activeSubTab === 'championship' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search participant name, chest no, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none transition-colors"
              />
            </div>

            {/* Category Dropdown Filter */}
            {categories.length > 0 && (
              <div className="relative sm:w-64">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 text-slate-200 text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none appearance-none transition-colors"
                >
                  <option value="">All Age Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {loading && championship.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading championship standings...</p>
            </div>
          ) : filteredChampionship.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Individual Results Match</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search query or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChampionship.map((item) => (
                <div
                  key={item.participant._id}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-all shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${
                        item.rank === 1
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : item.rank === 2
                          ? 'bg-slate-300/20 border-slate-300/40 text-slate-200'
                          : item.rank === 3
                          ? 'bg-amber-700/20 border-amber-700/40 text-amber-500'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/20">
                          #{item.participant.chestNo}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">
                          {item.participant.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        {item.team && (
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{ color: item.team.color || '#10b981' }}
                          >
                            <Shield className="w-3 h-3" />
                            {item.team.name}
                          </span>
                        )}
                        {item.category && (
                          <span className="text-slate-500">
                            • {item.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {item.totalPoints}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">
                      Pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="text-right text-[11px] text-slate-500">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}
