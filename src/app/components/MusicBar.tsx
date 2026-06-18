import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { CONFIG } from "./config";

interface MusicBarProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MusicBar({ audioRef, isPlaying, setIsPlaying }: MusicBarProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progress = duration ? currentTime / duration : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audioRef]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const skip = (dir: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + dir * 10));
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-30 px-4 py-3"
      style={{
        background: "rgba(10, 3, 7, 0.6)",
        backdropFilter: "blur(28px)",
        borderTop: "1px solid rgba(255, 170, 200, 0.08)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-lg mx-auto flex items-center gap-4">
        {/* Album art — animated bars */}
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden flex items-end justify-center gap-0.5 px-1 pb-1"
          style={{ background: "rgba(200,80,120,0.12)", border: "1px solid rgba(244,168,199,0.1)" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ background: "rgba(244,168,199,0.45)" }}
              animate={
                isPlaying
                  ? { height: ["25%", "80%", "45%", "65%", "25%"] }
                  : { height: "25%" }
              }
              transition={{
                duration: 0.8 + i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.13,
              }}
            />
          ))}
        </div>

        {/* Track + progress */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p
            className="text-xs leading-none truncate"
            style={{ fontFamily: "'Inter', sans-serif", color: "rgba(252,190,215,0.75)" }}
          >
            {CONFIG.musicTitle}
            <span style={{ color: "rgba(244,168,199,0.3)", margin: "0 6px" }}>·</span>
            <span style={{ color: "rgba(244,168,199,0.4)" }}>{CONFIG.musicArtist}</span>
          </p>

          {/* Progress bar */}
          <div
            className="w-full h-0.5 rounded-full cursor-pointer overflow-hidden"
            style={{ background: "rgba(255,170,200,0.1)" }}
            onClick={seek}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, rgba(244,168,199,0.6), rgba(220,100,150,0.8))",
              }}
            />
          </div>

          <div className="flex justify-between">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "rgba(244,168,199,0.3)" }}>
              {fmt(currentTime)}
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "rgba(244,168,199,0.3)" }}>
              {duration ? fmt(duration) : "–:––"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => skip(-1)} style={{ color: "rgba(244,168,199,0.35)" }}
            className="hover:opacity-80 transition-opacity">
            <SkipBack size={13} />
          </button>
          <motion.button
            onClick={toggle}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(244,168,199,0.12)",
              border: "1px solid rgba(244,168,199,0.2)",
              color: "rgba(252,210,228,0.9)",
            }}
            whileHover={{ scale: 1.08, background: "rgba(244,168,199,0.2)" }}
            whileTap={{ scale: 0.93 }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </motion.button>
          <button onClick={() => skip(1)} style={{ color: "rgba(244,168,199,0.35)" }}
            className="hover:opacity-80 transition-opacity">
            <SkipForward size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
