import { motion } from "motion/react";
import { CONFIG } from "./config";

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={onEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Soft radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Floating sparkles */}
      {[
        { top: "30%", left: "28%" },
        { top: "35%", right: "26%" },
        { top: "62%", left: "32%" },
        { top: "58%", right: "30%" },
      ].map((pos, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none"
          style={{
            ...pos,
            fontFamily: "serif",
            fontSize: "0.55rem",
            color: "rgba(244,168,199,0.3)",
          }}
          animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
          ✦
        </motion.span>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        {/* Script above */}
        <motion.p
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            color: "rgba(244,168,199,0.55)",
            letterSpacing: "0.02em",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          
        </motion.p>

        {/* Display name */}
        <motion.h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3rem, 11vw, 6rem)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "rgba(255,240,246,0.95)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            textShadow: "0 4px 40px rgba(180,60,100,0.35)",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {CONFIG.splashTitle}
        </motion.h1>

        {/* Hint */}
        <motion.p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(244,168,199,0.35)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
        >
          {CONFIG.splashSubtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
