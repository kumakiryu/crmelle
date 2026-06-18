import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Gamepad2, Tv2, MonitorPlay, Play, Pause } from "lucide-react";
import { CONFIG } from "./config";
import { useLanyard, getAvatarUrl, statusColors, LanyardActivity } from "./useLanyard";
import fallbackImg from "../../imports/image.png";

// ── View counter — persists in localStorage, counts once per browser session ──
function useViewCount() {
  const [views, setViews] = useState(0);
  useEffect(() => {
    const STORAGE_KEY = "profile_views";
    const SESSION_KEY = "profile_session_counted";
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyCounted) {
      const next = stored + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      sessionStorage.setItem(SESSION_KEY, "1");
      setViews(next);
    } else {
      setViews(stored);
    }
  }, []);
  return views;
}

// ── Social icons ──────────────────────────────────────────────────────────────
const GITHUB = (<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>);
const TWITTER = (<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
const INSTAGRAM = (<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>);
const DISCORD_SVG = (<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.045.034.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>);
const TIKTOK = (<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" /></svg>);

function SocialBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  if (!href) return null;
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,150,190,0.2)", color: "rgba(252,190,215,0.8)" }}
      whileHover={{ scale: 1.12, background: "rgba(0,0,0,0.6)", borderColor: "rgba(255,150,190,0.45)", color: "rgba(255,220,235,1)" }}
      whileTap={{ scale: 0.93 }}
    >{icon}</motion.a>
  );
}

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.span className="absolute pointer-events-none select-none"
      style={{ fontFamily: "serif", fontSize: "0.55rem", color: "rgba(255,150,190,0.4)", ...style }}
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.15, 0.9] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    >✦</motion.span>
  );
}

// ── Inline music pill (iPhone-style) ─────────────────────────────────────────
function MusicPill({ audioRef, isPlaying, setIsPlaying }: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress(audio.currentTime / (audio.duration || 1));
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [audioRef]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  return (
    <motion.div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl w-full"
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,140,180,0.12)",
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      {/* Animated album art square */}
      <div className="relative flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden flex items-end justify-center gap-0.5 px-1 pb-1"
        style={{ background: "rgba(200,80,130,0.15)", border: "1px solid rgba(255,140,180,0.1)" }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="w-0.5 rounded-full"
            style={{ background: "rgba(255,160,200,0.6)" }}
            animate={isPlaying ? { height: ["25%", "85%", "45%", "70%", "25%"] } : { height: "25%" }}
            transition={{ duration: 0.75 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
          />
        ))}
      </div>

      {/* Track info + progress */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="truncate leading-none"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,215,230,0.9)" }}>
          {CONFIG.musicTitle}
          <span style={{ color: "rgba(255,160,190,0.35)", margin: "0 5px" }}>·</span>
          <span style={{ color: "rgba(255,160,190,0.5)", fontWeight: 400 }}>{CONFIG.musicArtist}</span>
        </p>
        {/* Progress bar */}
        <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,150,185,0.1)" }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, rgba(255,130,175,0.7), rgba(220,80,140,0.9))" }} />
        </div>
      </div>

      {/* Play / pause */}
      <motion.button onClick={toggle}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,140,180,0.15)", border: "1px solid rgba(255,140,180,0.2)", color: "rgba(255,210,228,0.9)" }}
        whileHover={{ scale: 1.1, background: "rgba(255,140,180,0.25)" }}
        whileTap={{ scale: 0.92 }}
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
      </motion.button>
    </motion.div>
  );
}

// ── Live activity (game / streaming only — Spotify handled in MusicPill) ─────
function LiveActivity({ activities }: { activities: LanyardActivity[] }) {
  // Custom status (type 4) — show the actual state text
  const customStatus = activities.find((a) => a.type === 4);
  // Rich activity (game / stream etc.)
  const richAct = activities.find((a) => a.type !== 2 && a.type !== 4);

  if (!customStatus && !richAct) return null;

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      {/* Custom status pill */}
      {customStatus && (customStatus.state || customStatus.name !== "Custom Status") && (
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,140,180,0.12)" }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {customStatus.emoji?.name && (
            <span style={{ fontSize: "0.8rem" }}>{customStatus.emoji.name}</span>
          )}
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,215,232,0.8)" }}>
            {customStatus.state || customStatus.name}
          </span>
        </motion.div>
      )}

      {/* Rich activity pill */}
      {richAct && (
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,140,180,0.1)" }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <span style={{ color: "rgba(255,170,200,0.7)" }}>
            {richAct.type === 0 ? <Gamepad2 size={10} /> : richAct.type === 1 ? <Tv2 size={10} /> : <MonitorPlay size={10} />}
          </span>
          <span className="truncate max-w-[180px]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,225,237,0.85)" }}>
            {richAct.details ? `${richAct.name} — ${richAct.details}` : richAct.name}
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ── Pink shine keyframe injected once ────────────────────────────────────────
const SHINE_STYLE = `
@keyframes pinkShine {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

interface ProfilePageProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

export function ProfilePage({ audioRef, isPlaying, setIsPlaying }: ProfilePageProps) {
  const views = useViewCount();
  const { socials, name, bio, DISCORD_ID } = CONFIG;
  const { data } = useLanyard(DISCORD_ID);
  const isDemo = DISCORD_ID === "1234567890";

  const avatarUrl = data
    ? (CONFIG.avatar || getAvatarUrl(data.discord_user))
    : fallbackImg as unknown as string;

  const statusColor = data ? (statusColors[data.discord_status] ?? "#6b7280") : null;

  const hasNonSpotifyActivity = data?.activities.some((a) => a.type !== 2);
  const showActivity = data && hasNonSpotifyActivity;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      {/* Inject shine keyframe */}
      <style>{SHINE_STYLE}</style>

      <Sparkle style={{ top: "20%", left: "24%" }} />
      <Sparkle style={{ top: "32%", right: "22%" }} />
      <Sparkle style={{ top: "58%", left: "18%" }} />
      <Sparkle style={{ top: "48%", right: "20%" }} />
      <Sparkle style={{ top: "70%", right: "28%" }} />

      {/* Center stack */}
      <div className="flex flex-col items-center gap-3 px-6 max-w-xs w-full">

        {/* Card: avatar + name + bio */}
        <motion.div
          className="flex flex-col items-center gap-2 text-center px-5 pt-5 pb-4 rounded-3xl w-full"
          style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,140,180,0.1)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Avatar */}
          <div className="relative">
            <motion.div className="absolute inset-0 rounded-full pointer-events-none"
              animate={{ boxShadow: [
                "0 0 0 2.5px rgba(255,100,160,0.3), 0 0 28px 8px rgba(220,60,110,0.15)",
                "0 0 0 2.5px rgba(255,140,190,0.5), 0 0 40px 12px rgba(220,60,110,0.28)",
                "0 0 0 2.5px rgba(255,100,160,0.3), 0 0 28px 8px rgba(220,60,110,0.15)",
              ]}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <img src={avatarUrl} alt={name}
              className="w-20 h-20 rounded-full object-cover relative z-10"
              style={{ border: "2px solid rgba(255,130,175,0.25)", boxShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
            />
            {statusColor && !isDemo && (
              <div className="absolute bottom-0.5 right-0.5 z-20 w-3.5 h-3.5 rounded-full"
                style={{ background: statusColor, border: "2.5px solid rgba(5,2,4,0.9)", boxShadow: `0 0 6px ${statusColor}99` }} />
            )}
          </div>

          {/* Name with pink shine */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            fontStyle: "italic",
            letterSpacing: "0.03em",
            lineHeight: 1.1,
            background: "linear-gradient(90deg, #f9a8c9 0%, #fce4ef 30%, #ffb6d9 45%, #ffe0ef 55%, #f472b6 70%, #fce4ef 85%, #f9a8c9 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "pinkShine 4s linear infinite",
            textShadow: "none",
          }}>
            {name}
          </h1>

          {/* Bio — bold */}
          {bio && (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "rgba(255,200,220,0.7)",
              lineHeight: 1.6,
              maxWidth: "22ch",
            }}>
              {bio}
            </p>
          )}
        </motion.div>

        {/* Custom status + rich activity */}
        <AnimatePresence>
          {showActivity && (
            <motion.div className="w-full flex justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LiveActivity activities={data!.activities} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline music pill */}
        {CONFIG.musicSrc && (
          <MusicPill audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        )}

        {/* Social buttons */}
        <motion.div className="flex items-center gap-2.5 flex-wrap justify-center"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {socials.github    && <SocialBtn href={socials.github}    icon={GITHUB} />}
          {socials.twitter   && <SocialBtn href={socials.twitter}   icon={TWITTER} />}
          {socials.instagram && <SocialBtn href={socials.instagram} icon={INSTAGRAM} />}
          {socials.discord   && <SocialBtn href={socials.discord}   icon={DISCORD_SVG} />}
          {socials.tiktok    && <SocialBtn href={socials.tiktok}    icon={TIKTOK} />}
        </motion.div>

        {/* View counter — under social links */}
        <motion.div className="flex items-center gap-1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Eye size={11} style={{ color: "rgba(255,150,190,0.4)" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "rgba(255,150,190,0.4)" }}>
            {views} {views === 1 ? "view" : "views"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
