import { CONFIG } from "./config";

export function BackgroundMedia() {
  const { backgroundType, backgroundSrc } = CONFIG;

  if (backgroundType === "video") {
    return (
      <>
        <video
          className="fixed inset-0 w-full h-full object-cover pointer-events-none"
          src={backgroundSrc}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="fixed inset-0 bg-black/40 pointer-events-none" />
      </>
    );
  }

  // image or gif
  return (
    <div
      className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundSrc})` }}
    />
  );
}
