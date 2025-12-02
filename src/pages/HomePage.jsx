import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [songTitle, setSongTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState(""); // animated dots
  const clickAudio = useRef(null);

  const playlistId = "PLGt6T0xqilGDpSOfWvva0GyxA8JegxaYM";

  // Initialize click audio
  useEffect(() => {
    clickAudio.current = new Audio("/click.mp3"); // put click.mp3 in public folder
  }, []);

  const playClickSound = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.play().catch((err) => {
        // handle auto-play restrictions in browsers
        console.log("Click sound failed:", err);
      });
    }
  };

  // Loading screen timer (5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Animate dots
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
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
    if (event.data === 1) {
      const info = event.target.getVideoData();
      setSongTitle(info.title || "Unknown Track");
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  const handleButtonClick = (action) => {
    playClickSound();
    action();
  };

  const togglePlay = () => {
    if (!player) return;
    if (!isPlaying) {
      player.playVideo();
      setIsPlaying(true);
    } else {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    if (player) player.nextVideo();
  };

  const prevSong = () => {
    if (player) player.previousVideo();
  };

  // Loading screen
  if (loading) {
    return (
      <div className="bg-yellow-200 min-h-screen w-screen flex items-center justify-center">
        <div className="bg-[#f4e7c3] border-6 border-black rounded-xl shadow-[12px_12px_0_#5c3b2e] p-8 flex flex-col items-center w-64 h-32 md:w-80 md:h-40">
          <h1 className="text-5xl font-bold text-[#5c3b2e] mb-4">ব্যঞ্জন</h1>
          <p className="text-lg md:text-2xl font-mono text-[#2d2d2d]">{dots}</p>
        </div>
      </div>
    );
  }

  const Button = ({ onClick, children }) => {
    const [pressed, setPressed] = useState(false);
    return (
      <button
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={() => handleButtonClick(onClick)}
        className={`w-12 md:w-16 h-12 md:h-16 bg-[#5c3b2e] border-4 border-black rounded-lg flex items-center justify-center transition-all duration-100 ${
          pressed ? "shadow-[6px_6px_0_#3a1f0e]" : "shadow-none"
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="bg-yellow-200 min-h-screen w-screen flex items-center justify-center p-4">
      <div className="bg-[#f4e7c3] w-full max-w-4xl md:h-[60vh] h-[70vh] border-6 border-black rounded-xl shadow-[12px_12px_0_#5c3b2e] p-4 md:p-6 flex flex-col">
        <YouTube opts={opts} onReady={onReady} onStateChange={onStateChange} />

        {/* Top Panel */}
        <div className="bg-[#d88b5d] w-full md:h-[18vh] h-[20vh] border-4 border-black rounded-lg flex items-center justify-center gap-4 md:gap-8 px-2 md:px-6">
          <div className="w-10 md:w-14 h-10 md:h-14 border-4 border-black bg-[#f4e7c3] rounded-full"></div>
          <div className="flex-1 h-8 md:h-10 bg-[#2d2d2d] border-4 border-black rounded-md flex items-center justify-start px-2 overflow-hidden relative">
            {songTitle.length > 15 ? (
              <p className="text-yellow-300 font-mono text-xs md:text-sm whitespace-nowrap absolute animate-marquee">
                {songTitle}&nbsp;&nbsp;&nbsp;
              </p>
            ) : (
              <p className="text-yellow-300 font-mono text-xs md:text-sm truncate w-full text-center">
                {songTitle}
              </p>
            )}
          </div>
          <div className="w-10 md:w-14 h-10 md:h-14 border-4 border-black bg-[#f4e7c3] rounded-full"></div>
        </div>

        {/* Cassette Area */}
        <div className="mt-4 md:mt-6 bg-[#d88b5d] w-full md:h-[25vh] h-[28vh] border-4 border-black rounded-lg flex items-center justify-center gap-8 md:gap-20 p-4 md:p-6 relative">
          {/* Left Reel */}
          <div
            className={`w-16 md:w-24 h-16 md:h-24 rounded-full border-5 border-black bg-[#f4e7c3] flex items-center justify-center relative ${
              isPlaying ? "animate-spin-medium" : ""
            }`}
          >
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full"></div>
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-45"></div>
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-90"></div>
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-[135deg]"></div>
            <div className="w-4 md:w-6 h-4 md:h-6 bg-black rounded-full z-10"></div>
          </div>

          {/* Right Reel */}
          <div
            className={`w-16 md:w-24 h-16 md:h-24 rounded-full border-5 border-black bg-[#f4e7c3] flex items-center justify-center relative ${
              isPlaying ? "animate-spin-medium" : ""
            }`}
          >
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full"></div>
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-45"></div>
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-90"></div>
            <div className="absolute w-1 h-8 md:h-10 bg-black rounded-full rotate-[135deg]"></div>
            <div className="w-4 md:w-6 h-4 md:h-6 bg-black rounded-full z-10"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 md:mt-6 w-full flex justify-center items-center gap-4 md:gap-8">
          {/* Prev */}
          <Button onClick={prevSong}>
            <div className="w-0 h-0 border-t-6 md:border-t-8 border-b-6 md:border-b-8 border-r-8 md:border-r-12 border-t-transparent border-b-transparent border-r-white"></div>
          </Button>

          {/* Play/Pause */}
          <Button onClick={togglePlay}>
            {isPlaying ? (
              <div className="flex gap-2 md:gap-3">
                <div className="w-4 md:w-5 h-10 md:h-12 bg-white rounded-sm"></div>
                <div className="w-4 md:w-5 h-10 md:h-12 bg-white rounded-sm"></div>
              </div>
            ) : (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  borderLeft: "22px solid white",
                }}
              ></div>
            )}
          </Button>

          {/* Next */}
          <Button onClick={nextSong}>
            <div className="w-0 h-0 border-t-6 md:border-t-8 border-b-6 md:border-b-8 border-l-8 md:border-l-12 border-t-transparent border-b-transparent border-l-white"></div>
          </Button>
        </div>
      </div>
    </div>
  );
}
