'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Award, RefreshCw, Shield, Search, Filter, Sparkles, Medal } from 'lucide-react';
import { Podium } from '@/components/fest/Podium';
import { LeaderboardRow } from '@/components/fest/LeaderboardRow';

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

  const maxTeamPoints = teamLeaderboard.length > 0 ? teamLeaderboard[0].totalPoints || 1 : 1;

  const filteredChampionship = championship.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const pName = item.participant?.name?.toLowerCase() || item.name?.toLowerCase() || '';
    const pChest = item.participant?.chestNo?.toLowerCase() || item.chestNo?.toLowerCase() || '';
    const tName = item.team?.name?.toLowerCase() || item.teamName?.toLowerCase() || '';
    return pName.includes(query) || pChest.includes(query) || tName.includes(query);
  });

  const top3Teams = teamLeaderboard.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Navigation Header & Auto Refresh Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-2.5 sm:p-3.5 rounded-3xl backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 p-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'teams'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Team Standings ({teamLeaderboard.length})
          </button>
          <button
            onClick={() => setActiveSubTab('championship')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'championship'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Individual Championship
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 px-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="relative flex h-2 w-2">
              {autoRefresh && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${autoRefresh ? 'bg-emerald-500' : 'bg-slate-600'}`} />
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Live (30s)</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-wider transition-colors ${
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
            className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 transition-all flex items-center gap-1.5 active:scale-95"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline text-xs font-bold">Refresh</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Team Standings */}
      {activeSubTab === 'teams' && (
        <div className="space-y-8">
          {loading && teamLeaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading Live Team Standings...</p>
            </div>
          ) : teamLeaderboard.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Team Standings Declared Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Scores will automatically calculate as program results are submitted.
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Teams Podium */}
              {top3Teams.length > 0 && (
                <Podium
                  topTeams={top3Teams.map((item) => ({
                    teamId: item.team._id,
                    teamName: item.team.name,
                    teamCode: item.team.code,
                    colorCode: item.team.color,
                    totalPoints: item.totalPoints,
                    rank: item.rank,
                  }))}
                />
              )}

              {/* All Teams Progress List */}
              <div className="space-y-3">
                {teamLeaderboard.map((item) => (
                  <LeaderboardRow
                    key={item.team._id}
                    team={{
                      teamId: item.team._id,
                      teamName: item.team.name,
                      teamCode: item.team.code,
                      colorCode: item.team.color,
                      totalPoints: item.totalPoints,
                      rank: item.rank,
                    }}
                    maxPoints={maxTeamPoints}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Sub-tab 2: Individual Championship View */}
      {activeSubTab === 'championship' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by participant name, chest no, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 text-slate-200 text-xs rounded-2xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
            </div>

            {categories.length > 0 && (
              <div className="relative sm:w-64">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 text-slate-200 text-xs rounded-2xl pl-10 pr-8 py-3 outline-none appearance-none transition-colors"
                >
                  <option value="">All Categories</option>
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
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading Individual Rankings...</p>
            </div>
          ) : filteredChampionship.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Participants Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChampionship.map((item) => {
                const participantName = item.participant?.name || item.name || 'Participant';
                const chestNo = item.participant?.chestNo || item.chestNo || '---';
                const teamName = item.team?.name || item.teamName || 'Independent';
                const teamColor = item.team?.color || '#10b981';
                const categoryName = item.category?.name || item.categoryName || 'General';

                return (
                  <div
                    key={item.participant?._id || item.participantId || Math.random()}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-3xl p-5 transition-all shadow-xl backdrop-blur-xl flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 border ${
                          item.rank === 1
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : item.rank === 2
                            ? 'bg-slate-400/20 border-slate-400/40 text-slate-200'
                            : item.rank === 3
                            ? 'bg-amber-700/20 border-amber-700/40 text-amber-400'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 font-mono'
                        }`}
                      >
                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                            #{chestNo}
                          </span>
                          <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                            {participantName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1 font-semibold" style={{ color: teamColor }}>
                            <Shield className="w-3 h-3" />
                            {teamName}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 font-medium">{categoryName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-emerald-400 font-mono">{item.totalPoints}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="text-right text-[11px] font-medium text-slate-500 flex items-center justify-end gap-1.5">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>Live Scores Sync • Last updated: {lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
