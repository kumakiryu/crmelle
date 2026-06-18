import { motion } from "motion/react";
import {
  Github,
  Twitter,
  Instagram,
  Globe,
  Mail,
  Youtube,
  Twitch,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { CONFIG } from "./config";
import { DiscordPresence } from "./DiscordPresence";

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-white/60 hover:text-white transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      whileHover={{
        scale: 1.02,
        background: "rgba(255,255,255,0.07)",
        borderColor: "rgba(167,139,250,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className="text-xs"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
    </motion.a>
  );
}

const DISCORD_ICON = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.114 18.105.134 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const SPOTIFY_ICON = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export function ProfileCard() {
  const { socials, name, tagline, bio, location } = CONFIG;

  const socialLinks = [
    socials.github && { href: socials.github, icon: <Github size={14} />, label: "GitHub" },
    socials.twitter && { href: socials.twitter, icon: <Twitter size={14} />, label: "Twitter" },
    socials.instagram && { href: socials.instagram, icon: <Instagram size={14} />, label: "Instagram" },
    socials.discord && { href: socials.discord, icon: DISCORD_ICON, label: "Discord" },
    socials.spotify && { href: socials.spotify, icon: SPOTIFY_ICON, label: "Spotify" },
    socials.youtube && { href: socials.youtube, icon: <Youtube size={14} />, label: "YouTube" },
    socials.twitch && { href: socials.twitch, icon: <Twitch size={14} />, label: "Twitch" },
    socials.website && { href: socials.website, icon: <Globe size={14} />, label: "Website" },
    socials.email && {
      href: `mailto:${socials.email}`,
      icon: <Mail size={14} />,
      label: socials.email,
    },
  ].filter(Boolean) as SocialLinkProps[];

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {/* Main profile card */}
      <motion.div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={glass}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Name + tagline */}
        <div>
          <h1
            className="text-white leading-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </h1>
          <p
            className="mt-1 text-violet-300/70"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.04em" }}
          >
            {tagline}
          </p>
        </div>

        {/* Bio */}
        {bio && (
          <p
            className="text-white/60 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem" }}
          >
            {bio}
          </p>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-white/40">
            <MapPin size={12} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
              {location}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/6" />

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((link) => (
              <SocialLink key={link.href} {...link} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Discord presence */}
      <DiscordPresence />
    </div>
  );
}
