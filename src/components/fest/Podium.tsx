import React from 'react';

export interface TeamScore {
  teamId: string;
  teamName: string;
  teamCode?: string;
  colorCode?: string;
  totalPoints: number;
  rank: number;
}

interface PodiumProps {
  topTeams: TeamScore[];
}

export function Podium({ topTeams }: PodiumProps) {
  if (!topTeams || topTeams.length === 0) return null;

  const first = topTeams.find((t) => t.rank === 1) || topTeams[0];
  const second = topTeams.find((t) => t.rank === 2) || topTeams[1];
  const third = topTeams.find((t) => t.rank === 3) || topTeams[2];

  return (
    <div className="bg-white border border-border-warm rounded-card p-6 shadow-sm mb-6">
      <h3 className="font-amiri font-bold text-center text-xl text-emerald-950 mb-6">
        🏆 Top 3 Team Champions
      </h3>

      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-xl mx-auto pt-4">
        {/* 2nd Place (Silver) */}
        {second ? (
          <div className="flex-1 flex flex-col items-center">
            <div className="text-center mb-2">
              <span className="text-xl">🥈</span>
              <div className="font-amiri font-bold text-xs sm:text-sm text-emerald-950 line-clamp-1">
                {second.teamName}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800">
                {second.totalPoints} pts
              </div>
            </div>
            <div className="w-full h-24 bg-gradient-to-t from-slate-300 to-slate-200 border border-slate-400/50 rounded-t-lg flex items-center justify-center shadow-xs">
              <span className="font-amiri font-bold text-xl text-slate-700">#2</span>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* 1st Place (Gold) */}
        {first ? (
          <div className="flex-1 flex flex-col items-center">
            <div className="text-center mb-2">
              <span className="text-2xl animate-bounce">🥇</span>
              <div className="font-amiri font-bold text-sm sm:text-base text-emerald-950 line-clamp-1">
                {first.teamName}
              </div>
              <div className="text-xs font-bold text-gold-500">
                {first.totalPoints} pts
              </div>
            </div>
            <div className="w-full h-32 bg-gradient-to-t from-gold-500 to-gold-200 border border-gold-500 rounded-t-lg flex items-center justify-center shadow-md relative">
              <span className="font-amiri font-bold text-2xl text-emerald-950">#1</span>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* 3rd Place (Bronze) */}
        {third ? (
          <div className="flex-1 flex flex-col items-center">
            <div className="text-center mb-2">
              <span className="text-xl">🥉</span>
              <div className="font-amiri font-bold text-xs sm:text-sm text-emerald-950 line-clamp-1">
                {third.teamName}
              </div>
              <div className="text-[11px] font-semibold text-amber-800">
                {third.totalPoints} pts
              </div>
            </div>
            <div className="w-full h-16 bg-gradient-to-t from-amber-700 to-amber-600 border border-amber-800 rounded-t-lg flex items-center justify-center shadow-xs text-white">
              <span className="font-amiri font-bold text-lg text-amber-100">#3</span>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
