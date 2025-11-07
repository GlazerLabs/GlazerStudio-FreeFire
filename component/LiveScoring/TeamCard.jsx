'use client';

import React from 'react';

const TeamCard = ({ team, logoPath, hpFolderPath }) => {
  // Calculate total kills for the team
  const totalKills = team.player_stats?.reduce((sum, player) => sum + (player.kills || 0), 0) || team.kill_count || 0;

  // Helper to check if player is knocked/eliminated
  const isKnocked = (player) => {
    const status = getPlayerStatus(player);
    return status === 'knockdown' || status === 'dead';
  };

  // Helper to get player status
  const getPlayerStatus = (player) => {
    if (player.player_state !== undefined) {
      // player_state: 0 = alive, 1 = dead, 2 = knockdown
      if (player.player_state === 0) return 'alive';
      if (player.player_state === 1) return 'dead';
      if (player.player_state === 2) return 'knockdown';
    }
    // Fallback logic
    if (player.hp_info?.current_hp !== undefined) {
      return player.hp_info.current_hp === 0 ? 'dead' : 'alive';
    }
    return player.is_eliminated ? 'dead' : 'alive';
  };

  // Get HP info
  const getHP = (player) => {
    if (player.hp_info) {
      return {
        current: player.hp_info.current_hp || 0,
        total: player.hp_info.total_hp || 100
      };
    }
    return { current: 0, total: 100 };
  };

  // Helper function to get HP image path
  const getHpImagePath = (player) => {
    if (!hpFolderPath || !player) return null;
    
    const hp = getHP(player).current;
    const clampedHP = Math.max(0, Math.min(200, Math.round(hp)));
    return `${hpFolderPath.replace(/\/$/, '')}/${clampedHP}.png`;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/60 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-cyan-600/10 transition-all duration-500"></div>
      
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Team Name Header with Logo */}
        <div className="mb-6 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3 mb-2">
            {/* Team Logo */}
            {logoPath && (
              <div className="flex-shrink-0">
                <img 
                  src={`/api/logo?path=${encodeURIComponent(logoPath)}`}
                  alt={team.team_name || 'Team Logo'}
                  className="w-12 h-12 object-contain rounded-lg border-2 border-slate-600/50 bg-slate-900/50 p-1"
                  onError={(e) => {
                    // Show error in console and display placeholder
                    console.error('Failed to load logo:', logoPath);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Logo loaded successfully:', logoPath);
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 drop-shadow-lg truncate">
                  {team.team_name || 'Unknown Team'}
                </h3>
                {team.booyah && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-black text-xs font-black rounded-full shadow-lg animate-pulse border-2 border-yellow-300 ml-2">
                    🏆 BOOYAH
                  </span>
                )}
              </div>
            </div>
          </div>
          {team.ranking_score !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-slate-400 text-xs font-medium">Rank Score:</span>
              <span className="text-yellow-400 font-bold text-sm bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/30">
                {team.ranking_score}
              </span>
            </div>
          )}
        </div>

        {/* Players List */}
        <div className="space-y-3 mb-6">
          {team.player_stats?.slice(0, 4).map((player, index) => {
            const hp = getHP(player);
            const playerStatus = getPlayerStatus(player);
            const isDead = playerStatus === 'dead';
            const isKnockedDown = playerStatus === 'knockdown';
            const isInjured = isDead || isKnockedDown;
            const hpPercentage = hp.total > 0 ? (hp.current / hp.total) * 100 : 0;
            const hpImagePath = getHpImagePath(player);

            return (
              <div
                key={player.account_id || index}
                className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isDead
                    ? 'bg-gradient-to-r from-red-950/70 via-red-900/50 to-red-950/70 border-2 border-red-700/70 shadow-lg shadow-red-900/30' 
                    : isKnockedDown
                    ? 'bg-gradient-to-r from-red-900/60 via-orange-900/40 to-red-900/60 border-2 border-red-600/60 shadow-lg shadow-red-800/20'
                    : 'bg-gradient-to-r from-slate-700/70 via-slate-700/50 to-slate-700/70 border-2 border-slate-600/50 hover:border-slate-500 hover:shadow-lg hover:shadow-blue-500/10'
                } backdrop-blur-sm`}
              >
                {/* Status Indicator with glow */}
                <div className="flex-shrink-0 relative">
                  <div className={`w-4 h-4 rounded-full shadow-lg ${
                    isDead
                      ? 'bg-red-700 animate-pulse ring-4 ring-red-600/50' 
                      : isKnockedDown
                      ? 'bg-red-500 animate-pulse ring-4 ring-red-400/50'
                      : 'bg-green-500 ring-4 ring-green-400/50'
                  }`}>
                    {!isInjured && (
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>
                </div>

                {/* HP Image */}
                {hpImagePath && (
                  <div className="flex-shrink-0">
                    <img 
                      src={`/api/logo?path=${encodeURIComponent(hpImagePath)}`}
                      alt={`HP ${hp.current}`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`font-bold text-sm truncate ${
                      isDead ? 'text-red-200' : isKnockedDown ? 'text-orange-200' : 'text-white'
                    }`}>
                      {player.nickname || 'Unknown Player'}
                    </span>
                    {isDead && (
                      <span className="text-red-100 text-xs font-black px-2.5 py-1 bg-red-800/80 rounded-lg border border-red-700/70 shadow-md">
                        💀 DEAD
                      </span>
                    )}
                    {isKnockedDown && (
                      <span className="text-orange-200 text-xs font-black px-2.5 py-1 bg-red-900/70 rounded-lg border border-red-600/60 shadow-md">
                        ⚠ KNOCKED DOWN
                      </span>
                    )}
                    {player.kills > 0 && !isInjured && (
                      <span className="text-red-400 text-xs font-bold px-2 py-0.5 bg-red-600/30 rounded-md border border-red-500/40">
                        {player.kills}K
                      </span>
                    )}
                  </div>
                  
                  {/* HP Bar with improved design */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-900/90 rounded-full h-3 overflow-hidden shadow-inner border border-slate-800">
                      <div
                        className={`h-full transition-all duration-700 rounded-full relative ${
                          isDead || isKnockedDown
                            ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800'
                            : hpPercentage > 75 ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500' :
                            hpPercentage > 50 ? 'bg-gradient-to-r from-green-500 via-yellow-400 to-yellow-500' :
                            hpPercentage > 25 ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-500' :
                            'bg-gradient-to-r from-orange-500 via-red-500 to-red-600'
                        } shadow-lg`}
                        style={{ width: `${isDead || isKnockedDown ? 0 : Math.max(0, Math.min(100, hpPercentage))}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <span className={`text-xs font-black min-w-[55px] text-right ${
                      isDead || isKnockedDown ? 'text-red-400' :
                      hpPercentage > 75 ? 'text-green-400' :
                      hpPercentage > 50 ? 'text-yellow-400' :
                      hpPercentage > 25 ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {isDead || isKnockedDown ? '0' : `${hp.current}/${hp.total}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Kills Footer */}
        <div className="pt-4 border-t border-slate-700/60">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700/60 via-slate-800/60 to-slate-700/60 rounded-xl border-2 border-slate-600/40 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-sm font-semibold">Total Kills</span>
              <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-700">
                {team.player_stats?.length || 0} players
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-3xl font-black drop-shadow-lg tracking-tight">
                {totalKills}
              </span>
              <span className="text-red-500 text-2xl animate-pulse">💀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
