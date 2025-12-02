import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";

/* ---------- RetroButton (reusable) ---------- */
function RetroButton({ onAction, children, className = "" }) {
  // Track pressed state locally for visual press effect
  const [pressed, setPressed] = useState(false);

  // ensure both mouse and touch produce press effect
  const handlePressStart = (e) => {
    e.preventDefault?.(); // avoid ghost clicks on touch
    setPressed(true);
    // play audio is handled by parent via onAction wrapper or global ref
  };
  const handlePressEnd = () => setPressed(false);

  return (
    <button
      onMouseDown={handlePressStart}
      onTouchStart={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchEnd={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onClick={onAction}
      className={
        "flex items-center justify-center rounded-lg border-4 border-black bg-[#5c3b2e] transition-all duration-100 " +
        (pressed ? "shadow-[6px_6px_0_#3a1f0e] translate-y-1" : "shadow-none") +
        " " +
        className
      }
      aria-pressed={pressed}
    >
      {children}
    </button>
  );
}

/* ---------- Main Component ---------- */
export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [songTitle, setSongTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("");
  const clickAudio = useRef(null);

  // replace with your playlist id
  const playlistId = "PLGt6T0xqilGDpSOfWvva0GyxA8JegxaYM";

  // preload click audio once
  useEffect(() => {
    const audio = new Audio("/click.mp3");
    audio.preload = "auto";
    clickAudio.current = audio;
  }, []);

  // play sound safely: call on mousedown/touchstart (user gesture)
  const playClickSound = () => {
    const a = clickAudio.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play();
    } catch (err) {
      // swallow; autoplay policy may block until user gesture
      // we'll rely on mousedown to usually allow it
      // console.log("click audio play error", err);
    }
  };

  // loading screen 5s
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // dots animation
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(id);
  }, [loading]);

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      listType: "playlist",
      list: playlistId,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    const info = event.target.getVideoData();
    setSongTitle(info.title || "Unknown Track");
  };

  const onStateChange = (event) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) {
      const info = event.target.getVideoData();
      setSongTitle(info.title || "Unknown Track");
      setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  // action wrappers call sound first then action (ensures gesture)
  const handleTogglePlay = () => {
    // ensure click sound starts on the user's interaction
    playClickSound();
    if (!player) return;
    if (!isPlaying) {
      player.playVideo();
      setIsPlaying(true);
    } else {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (player) player.nextVideo();
  };

  const handlePrev = () => {
    playClickSound();
    if (player) player.previousVideo();
  };

  /* ---------- Loading screen (fixed size) ---------- */
  if (loading) {
    return (
      <div className="bg-yellow-200 min-h-screen w-screen flex items-center justify-center">
        <div className="relative">
          {/* Watermark behind even on loading */}
          <div className="watermark pointer-events-none">ব্যঞ্জন</div>

          <div className="bg-[#f4e7c3] border-[6px] border-black rounded-xl p-6 flex flex-col items-center justify-center w-64 h-32 md:w-80 md:h-44">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#5c3b2e] leading-tight">ব্যঞ্জন</h1>
            <p className="h-6 text-lg md:text-2xl font-mono text-[#2d2d2d]">{dots}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Main UI (fade in) ---------- */
  return (
    <div className="bg-yellow-200 min-h-screen w-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Watermark behind cassette */}
        <div className="watermark">ব্যঞ্জন</div>

        <div className="bg-[#f4e7c3] md:h-[60vh] h-[70vh] border-[6px] border-black rounded-xl p-4 md:p-6 flex flex-col fade-in">
          <YouTube opts={opts} onReady={onReady} onStateChange={onStateChange} />

          {/* Top Panel */}
          <div className="bg-[#d88b5d] w-full md:h-[18vh] h-[20vh] border-4 border-black rounded-lg flex items-center gap-4 md:gap-8 px-3 md:px-6">
            <div className="w-10 md:w-14 h-10 md:h-14 border-4 border-black bg-[#f4e7c3] rounded-full" />
            {/* Title box with marquee */}
            <div className="flex-1 h-8 md:h-10 bg-[#2d2d2d] border-4 border-black rounded-md relative overflow-hidden">
              {songTitle.length > 20 ? (
                <div className="marquee-container">
                  <div className="marquee-content">
                    <span className="marquee-item text-yellow-300 font-mono text-xs md:text-sm px-4">{songTitle}</span>
                    <span className="marquee-item text-yellow-300 font-mono text-xs md:text-sm px-4">{songTitle}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-yellow-300 font-mono text-xs md:text-sm truncate px-2 text-center">{songTitle}</p>
                </div>
              )}
            </div>
            <div className="w-10 md:w-14 h-10 md:h-14 border-4 border-black bg-[#f4e7c3] rounded-full" />
          </div>

          {/* Cassette Area */}
          <div className="mt-4 md:mt-6 bg-[#d88b5d] flex-1 border-4 border-black rounded-lg flex items-center justify-center gap-8 md:gap-20 p-4 md:p-6 relative">
            {/* Tape window */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 md:w-64 h-8 md:h-10 bg-black opacity-30 rounded" />

            {/* Left Reel */}
            <div className={`relative flex items-center justify-center ${isPlaying ? "animate-spin-medium" : ""}`}>
              <div className="w-16 md:w-24 h-16 md:h-24 rounded-full border-[5px] border-black bg-[#f4e7c3] flex items-center justify-center">
                {/* spokes */}
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full" />
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-45" />
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-90" />
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-[135deg]" />
                <div className="w-4 md:w-6 h-4 md:h-6 bg-black rounded-full z-10" />
              </div>
            </div>

            {/* Right Reel */}
            <div className={`relative flex items-center justify-center ${isPlaying ? "animate-spin-medium" : ""}`}>
              <div className="w-16 md:w-24 h-16 md:h-24 rounded-full border-[5px] border-black bg-[#f4e7c3] flex items-center justify-center">
                {/* spokes */}
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full" />
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-45" />
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-90" />
                <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-[135deg]" />
                <div className="w-4 md:w-6 h-4 md:h-6 bg-black rounded-full z-10" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 md:mt-6 flex justify-center items-center gap-4 md:gap-8">
            {/* Prev */}
            <RetroButton
              onAction={() => {
                playClickSound();
                prevSong();
              }}
              className="w-12 md:w-16 h-12 md:h-16"
            >
              <div className="w-0 h-0 border-t-[6px] md:border-t-[8px] border-b-[6px] md:border-b-[8px] border-r-[8px] md:border-r-[12px] border-t-transparent border-b-transparent border-r-white" />
            </RetroButton>

            {/* Play / Pause */}
            <RetroButton
              onAction={() => {
                playClickSound();
                togglePlay();
              }}
              className="w-20 md:w-24 h-14 md:h-16"
            >
              {isPlaying ? (
                <div className="flex gap-2 md:gap-3">
                  <div className="w-4 md:w-5 h-10 md:h-12 bg-white rounded-sm" />
                  <div className="w-4 md:w-5 h-10 md:h-12 bg-white rounded-sm" />
                </div>
              ) : (
                <div
                  className="w-0 h-0"
                  style={{
                    borderTop: "14px solid transparent",
                    borderBottom: "14px solid transparent",
                    borderLeft: "22px solid white",
                  }}
                />
              )}
            </RetroButton>

            {/* Next */}
            <RetroButton
              onAction={() => {
                playClickSound();
                nextSong();
              }}
              className="w-12 md:w-16 h-12 md:h-16"
            >
              <div className="w-0 h-0 border-t-[6px] md:border-t-[8px] border-b-[6px] md:border-b-[8px] border-l-[8px] md:border-l-[12px] border-t-transparent border-b-transparent border-l-white" />
            </RetroButton>
          </div>
        </div>
      </div>
    </div>
  );

  // local helper functions (defined here to avoid hoisting issues)
  function togglePlay() {
    if (!player) return;
    if (!isPlaying) {
      player.playVideo();
      setIsPlaying(true);
    } else {
      player.pauseVideo();
      setIsPlaying(false);
    }
  }
  function nextSong() {
    if (player) player.nextVideo();
  }
  function prevSong() {
    if (player) player.previousVideo();
  }
}
