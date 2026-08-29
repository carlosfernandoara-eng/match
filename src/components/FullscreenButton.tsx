import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

function isFullscreen() {
  return !!document.fullscreenElement;
}

export function FullscreenButton() {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setFullscreen(isFullscreen());
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function toggle() {
    if (isFullscreen()) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  return (
    <button
      onClick={toggle}
      title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
      aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
      className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-black/70 text-lime border border-white/15 backdrop-blur hover:bg-black hover:scale-105 transition-all"
    >
      {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );
}
