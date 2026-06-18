import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Pause, Play, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { CONFIG } from "./config";

interface MusicPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

export function MusicPlayer({ audioRef, isPlaying, setIsPlaying }: MusicPlayerProps) {
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted, audioRef]);

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
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(12, 12, 24, 0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(167,139,250,0.15)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              width: 240,
            }}
          >
            {/* Progress bar */}
            <div className="w-full h-0.5 bg-white/10">
              <div
                className="h-full bg-violet-400 transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)" }}
                >
                  <Music size={16} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm font-medium leading-tight truncate"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {CONFIG.musicTitle}
                  </p>
                  <p className="text-white/40 text-xs truncate"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {CONFIG.musicArtist}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggle}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  style={{ background: "rgba(167,139,250,0.15)" }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <button
                  onClick={() => setMuted((m) => !m)}
                  className="text-white/50 hover:text-white/90 transition-colors"
                >
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setMuted(false);
                  }}
                  className="flex-1 h-1 appearance-none cursor-pointer rounded-full"
                  style={{ accentColor: "#a78bfa" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill button */}
      <motion.button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
        style={{
          background: "rgba(12, 12, 24, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(167,139,250,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Bars animation */}
        <div className="flex items-end gap-0.5 h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full bg-violet-400"
              animate={
                isPlaying
                  ? { height: ["40%", "100%", "60%", "80%", "40%"] }
                  : { height: "30%" }
              }
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              style={{ minHeight: 4 }}
            />
          ))}
        </div>
        <span
          className="text-white/70 text-xs"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {isPlaying ? CONFIG.musicTitle : "paused"}
        </span>
        {expanded ? (
          <ChevronDown size={12} className="text-white/40" />
        ) : (
          <ChevronUp size={12} className="text-white/40" />
        )}
      </motion.button>
    </motion.div>
  );
}
