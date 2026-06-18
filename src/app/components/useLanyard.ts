import { useEffect, useState } from "react";

export interface LanyardActivity {
  name: string;
  type: number;
  details?: string;
  state?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  emoji?: { name: string; id?: string; animated?: boolean };
}

export interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id: string;
  timestamps: { start: number; end: number };
}

export interface LanyardData {
  discord_user: {
    username: string;
    discriminator: string;
    avatar: string;
    id: string;
    global_name?: string;
    display_name?: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
}

const WS_URL = "wss://api.lanyard.rest/socket";

export function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || userId === "1234567890") return;

    let ws: WebSocket;
    let heartbeatInterval: ReturnType<typeof setInterval>;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.op === 1) {
          // Hello — start heartbeat and subscribe
          heartbeatInterval = setInterval(() => {
            ws.send(JSON.stringify({ op: 3 }));
          }, msg.d.heartbeat_interval);

          ws.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: userId },
            })
          );
        }

        if (msg.op === 0) {
          if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
            setData(msg.d);
          }
        }
      };

      ws.onerror = () => setError("WebSocket error");
      ws.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(connect, 5000);
      };
    };

    connect();
    return () => {
      clearInterval(heartbeatInterval);
      ws?.close();
    };
  }, [userId]);

  return { data, error };
}

export function getAvatarUrl(discordUser: LanyardData["discord_user"]) {
  if (!discordUser.avatar) {
    const disc = parseInt(discordUser.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${disc}.png`;
  }
  const ext = discordUser.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${ext}?size=256`;
}

export function getActivityImageUrl(activity: LanyardActivity) {
  if (!activity.assets?.large_image) return null;
  const img = activity.assets.large_image;
  if (img.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${img.slice("mp:external/".length)}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }
  return null;
}

export const statusColors: Record<string, string> = {
  online: "#22c55e",
  idle: "#eab308",
  dnd: "#ef4444",
  offline: "#6b7280",
};

export const statusLabels: Record<string, string> = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};
