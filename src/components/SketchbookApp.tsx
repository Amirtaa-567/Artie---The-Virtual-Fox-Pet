import React, { useState, useEffect } from "react";
import { Edit3, Image as ImageIcon, Send, Sparkles, Zap, Award, Coffee, Slash, Spline } from "lucide-react";
import { DoodleSketch, VectorShape } from "../types";

interface SketchbookAppProps {
  sketches: DoodleSketch[];
  onCommissionSketch: (customPrompt: string, drawingMode: 'line' | 'spline') => Promise<boolean>;
  isGenerating: boolean;
}

export default function SketchbookApp({ sketches, onCommissionSketch, isGenerating }: SketchbookAppProps) {
  const [selectedSketchId, setSelectedSketchId] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState<string>("");
  const [drawnCount, setDrawnCount] = useState<number>(0);
  const [brushMode, setBrushMode] = useState<'solid' | 'pencil'>('pencil');
  const [drawingMode, setDrawingMode] = useState<'line' | 'spline'>('line');

  const selectedSketch = sketches.find(s => s.id === selectedSketchId) || sketches[0];

  // Procedural sketching trace loop!
  useEffect(() => {
    if (!selectedSketch) return;
    setDrawnCount(0);
    const interval = setInterval(() => {
      setDrawnCount((prev) => {
        if (prev >= selectedSketch.elements.length) {
          clearInterval(interval);
          return selectedSketch.elements.length;
        }
        return prev + 1;
      });
    }, 180); // stroke interval speed

    return () => clearInterval(interval);
  }, [selectedSketchId, selectedSketch]);

  const handleCommissionClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isGenerating) return;
    const success = await onCommissionSketch(promptInput, drawingMode);
    if (success) {
      setPromptInput("");
      // select latest sketch upon successful AI creation
      if (sketches.length > 0) {
        setSelectedSketchId(sketches[0].id);
      }
    }
  };

  const handleApplyPreset = (preset: string) => {
    setPromptInput(preset);
  };

  const presetChips = ["sleeping lazy kitty", "pixel art floppy disk", "cute hot lofi soup", "neon space rocket"];

  return (
    <div className="h-full flex flex-col text-slate-300 font-sans select-none bg-slate-900 overflow-hidden">
      {/* Top Sketchbook info header */}
      <div className="h-10 bg-slate-950 px-3 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Edit3 className="w-4 h-4 text-orange-400" />
          <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-widest">
            Artie's Sketchbook & Gallery
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
            Unlocked: {sketches.length} Sketches
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Unlocked Sketches Gallery List */}
        <div className="w-40 bg-slate-950/90 border-r border-slate-800 flex flex-col overflow-y-auto p-2 gap-2 flex-shrink-0">
          <span className="text-[8.5px] font-mono font-bold tracking-wider text-slate-500 uppercase px-1">Gallery Catalog</span>

          <div className="space-y-1">
            {sketches.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSketchId(s.id)}
                className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex flex-col gap-0.5 ${
                  (selectedSketchId === s.id || (!selectedSketchId && s === sketches[0]))
                    ? "bg-orange-500/15 border-orange-500/30 text-white shadow-md shadow-orange-500/5"
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 text-slate-400"
                }`}
              >
                <span className="text-[10.5px] font-sans font-extrabold truncate">{s.title}</span>
                <span className="text-[8px] font-mono text-slate-500 flex items-center justify-between">
                  <span>origin: {s.appOrigin}</span>
                  <span>{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </button>
            ))}
          </div>

          {/* AI Commission box footer inside gallery panel */}
          <div className="mt-auto border-t border-slate-800/80 pt-2 font-sans">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] font-mono font-bold text-slate-500 tracking-wider block">PROMPT PET ARTIST</span>
              <span className={`text-[7.5px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                drawingMode === 'spline' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              }`}>
                {drawingMode} active
              </span>
            </div>
            <form onSubmit={handleCommissionClick} className="flex flex-col gap-1">
              <input
                type="text"
                disabled={isGenerating}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Doodle a sleeping cat..."
                className="w-full bg-slate-900 text-[10px] text-slate-200 border border-slate-800 rounded px-1.5 py-1 focus:ring-1 focus:ring-orange-500 outline-none leading-none placeholder-slate-600 font-sans"
              />
              <button
                type="submit"
                disabled={isGenerating || !promptInput.trim()}
                className="w-full py-1.5 px-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-650 rounded text-[9.5px] font-bold text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-yellow-350" />
                {isGenerating ? "SKETCHING..." : "ORDER DOODLE"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Big Interactive Sketch Canvas */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden min-w-[200px]">
          {selectedSketch ? (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {/* Drafting Board Tool Palette bar */}
              <div className="mb-3 flex items-center justify-between bg-slate-950/60 p-2 border border-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  <span className="text-[9.5px] font-mono font-extrabold text-slate-300 uppercase tracking-widest">
                    Fox Drawing Engine
                  </span>
                </div>
                
                {/* INTERACTIVE DUAL TOOL PALETTE */}
                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-0.5 rounded-lg shadow-inner">
                  <button
                    onClick={() => setDrawingMode('line')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                      drawingMode === 'line'
                        ? 'bg-orange-500 text-white shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                    title="Render geometries as sharp straight lines and exact grids"
                  >
                    <Slash className="w-2.5 h-2.5" />
                    <span>Line Mode</span>
                  </button>
                  <button
                    onClick={() => setDrawingMode('spline')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                      drawingMode === 'spline'
                        ? 'bg-orange-500 text-white shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                    title="Render geometries as fluid curved bezier spline tracks"
                  >
                    <Spline className="w-2.5 h-2.5" />
                    <span>Spline Mode</span>
                  </button>
                </div>
              </div>

              {/* Sketches card detailing */}
              <div className="flex-1 bg-[#fffdfa] border border-orange-200/40 rounded-xl relative p-4 flex flex-col justify-between shadow-lg text-slate-800 overflow-hidden">
                {/* Traditional drawing grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.22] pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-orange-100 pb-1.5 leading-none shadow-sm relative z-10 select-none">
                  <span className="text-[9px] font-mono font-bold uppercase text-orange-600">
                    🦊 Physical Sketchpad
                  </span>
                  <span className="text-[9px] text-[#4b5563] font-mono bg-orange-100/10 px-1.5 py-0.5 rounded">
                    Complexity: {selectedSketch.elements.length} strokes
                  </span>
                </div>

                {/* THE SVG DRAWING SURFACE */}
                <div className="flex-1 flex items-center justify-center relative my-4 overflow-hidden" style={{ minHeight: "130px" }}>
                  <svg viewBox="-100 -100 200 200" className="w-36 h-36 border border-transparent mx-auto relative z-10" strokeLinecap="round">
                    {selectedSketch.elements.slice(0, drawnCount).map((el, i) => {
                      const computedStroke = el.strokeWidth || 3.5;
                      const strokeColor = el.fill && el.fill !== "none" ? el.fill : selectedSketch.moodColor || "#f97316";

                      if (el.type === 'line') {
                        return (
                          <line
                            key={i}
                            x1={el.x1 ?? -30}
                            y1={el.y1 ?? 0}
                            x2={el.x2 ?? 30}
                            y2={el.y2 ?? 0}
                            stroke={strokeColor}
                            strokeWidth={computedStroke}
                          />
                        );
                      } else if (el.type === 'rect') {
                        return (
                          <rect
                            key={i}
                            x={(el.x ?? -15)}
                            y={(el.y ?? -15)}
                            width={el.w ?? 30}
                            height={el.h ?? 30}
                            stroke={strokeColor}
                            strokeWidth={computedStroke}
                            fill={el.fill || 'none'}
                          />
                        );
                      } else if (el.type === 'circle') {
                        return (
                          <circle
                            key={i}
                            cx={el.cx ?? 0}
                            cy={el.cy ?? 0}
                            r={el.r ?? 15}
                            stroke={strokeColor}
                            strokeWidth={computedStroke}
                            fill={el.fill || 'none'}
                          />
                        );
                      } else if (el.type === 'path') {
                        return (
                          <path
                            key={i}
                            d={el.d ?? 'M 0 0'}
                            stroke={strokeColor}
                            strokeWidth={computedStroke}
                            fill={el.fill || 'none'}
                          />
                        );
                      }
                      return null;
                    })}

                    {/* Miniature pencil locator simulating drawing */}
                    {drawnCount < selectedSketch.elements.length && selectedSketch.elements[drawnCount] && (
                      <g className="animate-pulse">
                        <line
                          x1={(selectedSketch.elements[drawnCount].x1 ?? selectedSketch.elements[drawnCount].x ?? selectedSketch.elements[drawnCount].cx ?? 0) - 3}
                          y1={(selectedSketch.elements[drawnCount].y1 ?? selectedSketch.elements[drawnCount].y ?? selectedSketch.elements[drawnCount].cy ?? 0) - 15}
                          x2={(selectedSketch.elements[drawnCount].x1 ?? selectedSketch.elements[drawnCount].x ?? selectedSketch.elements[drawnCount].cx ?? 0)}
                          y2={selectedSketch.elements[drawnCount].y1 ?? selectedSketch.elements[drawnCount].y ?? selectedSketch.elements[drawnCount].cy ?? 0}
                          stroke="#71717a"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx={selectedSketch.elements[drawnCount].x1 ?? selectedSketch.elements[drawnCount].x ?? selectedSketch.elements[drawnCount].cx ?? 0}
                          cy={selectedSketch.elements[drawnCount].y1 ?? selectedSketch.elements[drawnCount].y ?? selectedSketch.elements[drawnCount].cy ?? 0}
                          r="2.5"
                          fill="#f97316"
                        />
                      </g>
                    )}
                  </svg>
                </div>

                <div className="border-t border-orange-100/80 pt-2 text-[#4b5563] text-center max-w-sm mx-auto relative z-10 leading-relaxed font-sans select-none">
                  <h3 className="text-xs font-extrabold text-slate-800 leading-none mb-1">
                    "{selectedSketch.title}"
                  </h3>
                  <p className="text-[10px] leading-relaxed italic text-gray-500 font-sans">
                    {drawnCount < selectedSketch.elements.length
                      ? "✍️ Artie is sketching..."
                      : `"${selectedSketch.description}"`}
                  </p>
                </div>
              </div>

              {/* Commission prompt quick-preset tags selector header */}
              <div className="mt-3 flex items-center gap-1.5 overflow-x-auto text-[9.5px]">
                <span className="text-slate-500 text-[8px] font-mono uppercase tracking-wider flex-shrink-0">presets:</span>
                {presetChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleApplyPreset(chip)}
                    className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-[9px] hover:border-orange-500/20 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 leading-relaxed font-sans">
              <ImageIcon className="w-10 h-10 text-slate-700 mb-2 animate-bounce" />
              <p className="font-extrabold text-slate-400">Sketchbook is pristine...</p>
              <p className="text-[10px] text-slate-600 font-mono mt-1">Open VS Code, Figma, browser, or tape decks to trigger automatic sketches, or prompt custom designs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
