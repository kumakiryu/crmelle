import { motion } from "motion/react";
import {
  useLanyard,
  getAvatarUrl,
  getActivityImageUrl,
  statusColors,
  statusLabels,
  LanyardActivity,
} from "./useLanyard";
import { CONFIG } from "./config";
import { Monitor, Smartphone, Globe } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

function ActivityCard({ activity }: { activity: LanyardActivity }) {
  const imgUrl = getActivityImageUrl(activity);

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt={activity.name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white/90 text-xs font-medium truncate"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          {activity.name}
        </p>
        {activity.details && (
          <p className="text-white/50 text-xs truncate mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {activity.details}
          </p>
        )}
        {activity.state && (
          <p className="text-white/40 text-xs truncate"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {activity.state}
          </p>
        )}
      </div>
    </div>
  );
}

export function DiscordPresence() {
  const { data } = useLanyard(CONFIG.DISCORD_ID);

  const isDemoMode = CONFIG.DISCORD_ID === "1234567890";

  if (isDemoMode) {
    return (
      <motion.div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={glass}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white/60 text-xl"
              style={{ background: "rgba(124,58,237,0.2)" }}
            >
              ?
            </div>
            <div
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black/60"
              style={{ background: "#6b7280" }}
            />
          </div>
          <div>
            <p className="text-white font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
              your_username
            </p>
            <p className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              set your Discord ID in config.ts
            </p>
          </div>
        </div>
        <div className="text-xs text-violet-400/70 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
          Replace DISCORD_ID in config.ts with your real ID to show live presence.
        </div>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        className="rounded-2xl p-5"
        style={glass}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 bg-white/5 rounded animate-pulse w-24" />
            <div className="h-2.5 bg-white/5 rounded animate-pulse w-16" />
          </div>
        </div>
      </motion.div>
    );
  }

  const avatarUrl = CONFIG.avatar || getAvatarUrl(data.discord_user);
  const displayName =
    data.discord_user.global_name ||
    data.discord_user.display_name ||
    data.discord_user.username;
  const statusColor = statusColors[data.discord_status] || "#6b7280";
  const statusLabel = statusLabels[data.discord_status] || "offline";

  const nonSpotifyActivities = data.activities.filter((a) => a.type !== 2).slice(0, 2);

  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={glass}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Avatar + status */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div
            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black/60"
            style={{ background: statusColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold leading-tight truncate"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {displayName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            <p className="text-white/50 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              {statusLabel}
            </p>
          </div>
        </div>

        {/* Active platforms */}
        <div className="flex items-center gap-1.5">
          {data.active_on_discord_desktop && (
            <Monitor size={12} className="text-white/30" />
          )}
          {data.active_on_discord_mobile && (
            <Smartphone size={12} className="text-white/30" />
          )}
          {data.active_on_discord_web && (
            <Globe size={12} className="text-white/30" />
          )}
        </div>
      </div>

      {/* Spotify */}
      {data.listening_to_spotify && data.spotify && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.15)" }}
        >
          <img
            src={data.spotify.album_art_url}
            alt={data.spotify.album}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="#1db954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="text-xs font-medium" style={{ color: "#1db954", fontFamily: "'Inter', sans-serif" }}>
                Listening on Spotify
              </span>
            </div>
            <p className="text-white/90 text-xs font-medium truncate mt-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {data.spotify.song}
            </p>
            <p className="text-white/50 text-xs truncate"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {data.spotify.artist}
            </p>
          </div>
        </div>
      )}

      {/* Other activities */}
      {nonSpotifyActivities.length > 0 && (
        <div className="flex flex-col gap-2">
          {nonSpotifyActivities.map((act, i) => (
            <ActivityCard key={i} activity={act} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
