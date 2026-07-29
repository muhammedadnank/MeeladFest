import React from 'react';
import { TeamScore } from './Podium';

interface LeaderboardRowProps {
  team: TeamScore;
  maxPoints?: number;
}

export function LeaderboardRow({ team, maxPoints = 1 }: LeaderboardRowProps) {
  const percentage = Math.min(100, Math.round((team.totalPoints / (maxPoints || 1)) * 100));

  return (
    <div className="bg-white border border-border-warm rounded-lg p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-emerald-800/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {/* Rank Badge */}
        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0">
          #{team.rank}
        </span>

        {/* Color Dot & Team Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {team.colorCode && (
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                style={{ backgroundColor: team.colorCode }}
              />
            )}
            <h4 className="font-amiri font-bold text-sm text-emerald-950 truncate">
              {team.teamName}
            </h4>
            {team.teamCode && (
              <span className="text-[10px] bg-emerald-100/60 text-emerald-800 px-1.5 py-0.5 rounded font-mono uppercase">
                {team.teamCode}
              </span>
            )}
          </div>

          {/* Points Progress Bar */}
          <div className="w-32 sm:w-48 bg-emerald-100/50 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-800 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Total Points Callout */}
      <div className="text-right shrink-0">
        <span className="font-amiri font-bold text-base text-emerald-950">
          {team.totalPoints}
        </span>
        <span className="text-[10px] text-text-dark/60 block -mt-1 font-medium">points</span>
      </div>
    </div>
  );
}
