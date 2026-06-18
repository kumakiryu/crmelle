import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BackgroundMedia } from "./components/BackgroundMedia";
import { SplashScreen } from "./components/SplashScreen";
import { ProfilePage } from "./components/ProfilePage";
import { CONFIG } from "./components/config";
// MusicBar is now rendered inline inside ProfilePage as a pill widget

export default function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    setEntered(true);
    if (audioRef.current && CONFIG.musicSrc) {
      audioRef.current.volume = 0.35;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {CONFIG.musicSrc && (
        <audio ref={audioRef} src={CONFIG.musicSrc} loop preload="auto" />
      )}

      {/* Background */}
      <BackgroundMedia />

      {/* Splash */}
      <AnimatePresence mode="wait">
        {!entered && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <SplashScreen onEnter={handleEnter} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile */}
      <AnimatePresence>
        {entered && (
          <motion.div
            key="profile"
            className="relative z-10"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
          >
            <ProfilePage
              audioRef={audioRef}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
