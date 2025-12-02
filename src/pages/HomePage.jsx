import React, { useState } from "react";
import YouTube from "react-youtube";

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [songTitle, setSongTitle] = useState("Loading...");

  // YouTube playlist ID
  const playlistId = "PL9LkJszkF_Z6bJ82689htd2wch-HVbzCO";

  // YouTube options
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
    if (event.data === 1) { // playing
      const info = event.target.getVideoData();
      setSongTitle(info.title || "Unknown Track");
      setIsPlaying(true);
    } else if (event.data === 2) { // paused
      setIsPlaying(false);
    }
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

  return (
    <div className="bg-yellow-200 min-h-screen w-screen flex items-center justify-center">

      {/* Main Cassette Player */}
      <div className="bg-[#f4e7c3] w-[70vw] h-[60vh] border-[6px] border-black rounded-xl shadow-[12px_12px_0_#5c3b2e] p-6 relative">

        {/* Invisible YouTube Player */}
        <YouTube opts={opts} onReady={onReady} onStateChange={onStateChange} />

        {/* TOP PANEL */}
        <div className="bg-[#d88b5d] w-full h-[18vh] border-[4px] border-black rounded-lg 
                        flex items-center justify-center gap-8 px-6">

          {/* Left Knob */}
          <div className="w-14 h-14 border-[4px] border-black bg-[#f4e7c3] rounded-full"></div>

          {/* Song Title */}
          <div className="w-64 h-10 bg-[#2d2d2d] border-[4px] border-black rounded-md 
                          flex items-center justify-start px-2 overflow-hidden relative">
            {songTitle.length > 15 ? (
              <p className="text-yellow-300 font-mono text-sm whitespace-nowrap absolute animate-marquee">
                {songTitle}&nbsp;&nbsp;&nbsp;
              </p>
            ) : (
              <p className="text-yellow-300 font-mono text-sm truncate w-full text-center">
                {songTitle}
              </p>
            )}
          </div>

          {/* Right Knob */}
          <div className="w-14 h-14 border-[4px] border-black bg-[#f4e7c3] rounded-full"></div>
        </div>

        {/* CASSETTE AREA */}
        <div className="mt-6 bg-[#d88b5d] w-full h-[25vh] border-[4px] border-black rounded-lg 
                        flex items-center justify-center gap-20 p-6 relative">

          {/* Left Reel */}
          <div className={`w-24 h-24 rounded-full border-[5px] border-black bg-[#f4e7c3] 
                           flex items-center justify-center relative ${isPlaying ? "animate-spin-medium" : ""}`}>
            <div className="absolute w-1 h-10 bg-black rounded-full"></div>
            <div className="absolute w-1 h-10 bg-black rounded-full rotate-45"></div>
            <div className="absolute w-1 h-10 bg-black rounded-full rotate-90"></div>
            <div className="absolute w-1 h-10 bg-black rounded-full rotate-[135deg]"></div>
            <div className="w-6 h-6 bg-black rounded-full z-10"></div>
          </div>

          {/* Tape Window */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-56 h-10 bg-black opacity-30 rounded"></div>

          {/* Right Reel */}
          <div className={`w-24 h-24 rounded-full border-[5px] border-black bg-[#f4e7c3] 
                           flex items-center justify-center relative ${isPlaying ? "animate-spin-medium" : ""}`}>
            <div className="absolute w-1 h-10 bg-black rounded-full"></div>
            <div className="absolute w-1 h-10 bg-black rounded-full rotate-45"></div>
            <div className="absolute w-1 h-10 bg-black rounded-full rotate-90"></div>
            <div className="absolute w-1 h-10 bg-black rounded-full rotate-[135deg]"></div>
            <div className="w-6 h-6 bg-black rounded-full z-10"></div>
          </div>

        </div>

        {/* Controls */}
        <div className="mt-6 w-full flex justify-center items-center gap-8">

          {/* Previous */}
          <button
            onClick={prevSong}
            className="bg-[#5c3b2e] text-white px-6 py-3 text-lg font-bold 
                       border-[3px] border-black rounded-lg"
          >
            ◀
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="bg-[#5c3b2e] text-white px-10 py-3 text-lg font-bold 
                       border-[3px] border-black rounded-lg"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          {/* Next */}
          <button
            onClick={nextSong}
            className="bg-[#5c3b2e] text-white px-6 py-3 text-lg font-bold 
                       border-[3px] border-black rounded-lg"
          >
            ▶
          </button>

        </div>

      </div>
    </div>
  );
}
