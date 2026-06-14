import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Music, Sparkles, Volume2, RefreshCw } from "lucide-react";

interface SpotifyAppProps {
  onPlayStateChanged: (isPlaying: boolean) => void;
}

interface Track {
  title: string;
  artist: string;
  duration: string;
}

const mockTracks: Track[] = [
  { title: "Cozy Fox Forest Lofi", artist: "Artie Beats", duration: "2:45" },
  { title: "Sizzling Cozy Code Beats", artist: "Syntax Squirrel", duration: "3:10" },
  { title: "Cyber Sunset Synth", artist: "Designer Fox", duration: "4:02" },
  { title: "Rainy Cafe Sketchpad", artist: "Quiet Coffee", duration: "2:20" }
];

export default function SpotifyApp({ onPlayStateChanged }: SpotifyAppProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [progressSecs, setProgressSecs] = useState<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTrack = mockTracks[currentTrackIndex];

  // progress bar timer
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setProgressSecs((prev) => {
          if (prev >= 150) {
            // loop or skip track
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, currentTrackIndex]);

  const togglePlayback = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    onPlayStateChanged(nextPlay); // notify parent to trigger violet glow on Artie!
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % mockTracks.length);
    setProgressSecs(0);
  };

  const percentProgress = (progressSecs / 150) * 100;

  // convert seconds to min:sec
  const getProgressString = () => {
    const min = Math.floor(progressSecs / 60);
    const sec = progressSecs % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="h-full flex flex-col text-slate-300 font-sans select-none bg-slate-950 p-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* PHYSICAL GLOWING CASSETTE TAPE SCHEMATIC */}
        <div className="w-56 h-36 bg-slate-900 border-2 border-purple-500/40 rounded-xl relative p-3 flex flex-col justify-between shadow-xl shadow-purple-500/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 leading-none shadow-sm">
            <span className="text-[8px] font-mono font-bold tracking-wider text-purple-400">DESIGNER PET CONSOLE</span>
            <span className="text-[8px] font-mono text-purple-400">A - SIDE</span>
          </div>

          <div className="flex justify-center my-1.5">
            {/* Spinning Tape Wheels simulated when playing */}
            <div className="flex justify-between w-32 relative px-4 text-purple-300">
              {/* Wheel Left */}
              <div className="w-10 h-10 border-2 border-dashed border-purple-500/80 rounded-full flex items-center justify-center">
                <div className={`w-4 h-4 border border-purple-400/50 rounded-full ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              </div>
              {/* Spinning tape mesh */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-2 bg-gradient-to-r from-purple-800 to-purple-600 rounded opacity-60"></div>
              {/* Wheel Right */}
              <div className="w-10 h-10 border-2 border-dashed border-purple-500/80 rounded-full flex items-center justify-center">
                <div className={`w-4 h-4 border border-purple-400/50 rounded-full ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-center leading-none">
            <span className="text-[10px] font-mono font-bold text-slate-100 truncate block">
              {activeTrack.title}
            </span>
            <span className="text-[8px] text-purple-400 font-mono italic">
              {activeTrack.artist}
            </span>
          </div>
        </div>

        {/* Dynamic Visualizer block (jumping bars) */}
        <div className="h-4 flex items-end gap-1 w-24 justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                height: isPlaying ? `${15 + Math.random() * 85}%` : "15%",
                transition: "height 0.15s ease",
              }}
              className="w-1 rounded-full bg-purple-500"
            />
          ))}
        </div>
      </div>

      {/* MEDIA INTERACTIVE CONTROLS PANEL */}
      <div className="mt-auto border-t border-slate-900 pt-3">
        {/* Track duration progress */}
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mb-1.5">
          <span>{getProgressString()}</span>
          <div className="flex-1 mx-3 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-purple-500" style={{ width: `${percentProgress}%` }}></div>
          </div>
          <span>{activeTrack.duration}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[9px] font-mono text-slate-500 font-bold">100% AMBIENCE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className={`p-2 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                isPlaying ? "bg-purple-600 text-white" : "bg-purple-950 text-purple-300 border border-purple-500/30"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleNextTrack}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Next beat"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center mt-2.5 text-[9px] text-purple-500 font-mono tracking-wider">
          {isPlaying ? "📻 ARTIE IS VIBING & FUR GLOW SET TO VIOLET" : "📻 PAUSED - CLICK PLAY TO START BEATS"}
        </div>
      </div>
    </div>
  );
}
