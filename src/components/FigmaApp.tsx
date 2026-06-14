import React, { useState, useRef } from "react";
import { PenTool, Target, Image, Trash2, Heart, Award, Sparkles } from "lucide-react";

interface FigmaAppProps {
  onStampShape: () => void;
  onMasterpiecePublished: () => void;
}

interface PlacedShape {
  id: string;
  type: 'rect' | 'circle' | 'heart' | 'star';
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function FigmaApp({ onStampShape, onMasterpiecePublished }: FigmaAppProps) {
  const [shapes, setShapes] = useState<PlacedShape[]>([]);
  const [activeTool, setActiveTool] = useState<'rect' | 'circle' | 'heart' | 'star'>('circle');
  const [brushColor, setBrushColor] = useState<string>("#ec4899"); // neon pink by default!
  const canvasRef = useRef<HTMLDivElement>(null);

  const neonColors = [
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#a855f7", // purple
    "#10b981", // emerald
    "#fb7185", // rose
    "#f59e0b"  // amber
  ];

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newShape: PlacedShape = {
      id: `shape-${Date.now()}-${Math.random()}`,
      type: activeTool,
      x: x,
      y: y,
      size: 15 + Math.random() * 30,
      color: brushColor
    };

    setShapes([...shapes, newShape]);
    onStampShape(); // switches Artie to neon fur + drawing!
  };

  const clearCanvas = () => {
    setShapes([]);
  };

  const handlePublish = () => {
    if (shapes.length === 0) return;
    onMasterpiecePublished(); // big happy rewards trigger!
    setShapes([]);
  };

  return (
    <div className="h-full flex flex-col text-slate-300 font-sans select-none bg-slate-950">
      {/* Figma Ribbon bar header */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3">
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 text-[10px] font-bold font-mono">F</span>
          <span className="text-slate-400 text-[10.5px] font-bold">Artie Figma Studio (Neon Canvas)</span>
        </div>

        {/* Toolbar selection */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTool('circle')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${activeTool === 'circle' ? "bg-pink-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
            title="Stamp Circle"
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
          </button>
          <button
            onClick={() => setActiveTool('rect')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${activeTool === 'rect' ? "bg-pink-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
            title="Stamp Rectangle"
          >
            <div className="w-3.5 h-3.5 border-2 border-current" />
          </button>
          <button
            onClick={() => setActiveTool('heart')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${activeTool === 'heart' ? "bg-pink-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
            title="Stamp Heart"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('star')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${activeTool === 'star' ? "bg-pink-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
            title="Stamp Star"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Palette selectors */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          {neonColors.map((col) => (
            <button
              key={col}
              onClick={() => setBrushColor(col)}
              style={{ backgroundColor: col }}
              className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer hover:scale-125 ${brushColor === col ? "border-white scale-110 shadow-lg shadow-white/20" : "border-transparent"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Figma Sidebar properties */}
        <div className="w-36 bg-slate-900 border-r border-slate-800 p-2 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider">LAYERS LIST</span>
            <div className="mt-1 space-y-1 h-36 overflow-y-auto">
              {shapes.map((s, index) => (
                <div key={s.id} className="text-[10px] p-1 rounded hover:bg-slate-800/80 flex items-center justify-between text-slate-400">
                  <span className="capitalize font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                    {s.type} {index + 1}
                  </span>
                  <span className="text-[9px] text-pink-500/80">Vector</span>
                </div>
              ))}
              {shapes.length === 0 && (
                <span className="text-[10px] text-slate-600 block pl-1 italic">Canvas empty...</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-800 pt-2 text-[10px]">
            <p className="text-slate-400 flex items-center gap-1.5">
              <PenTool className="w-3 h-3 text-pink-400" />
              Draw on Canvas
            </p>
            <p className="text-[9px] text-pink-500/80 font-mono italic">Artie is mimicking sketches!</p>

            <div className="pt-1 flex gap-1">
              <button
                onClick={clearCanvas}
                className="flex-1 py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Wipe canvas clean"
              >
                <Trash2 className="w-2.5 h-2.5 text-red-400" />
                Clear
              </button>
              <button
                onClick={handlePublish}
                disabled={shapes.length === 0}
                className="flex-1 py-1 px-1.5 bg-pink-500 hover:bg-pink-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:pointer-events-none text-white rounded text-[9px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Award className="w-2.5 h-2.5" />
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Matrix Design Board (Interactive Canvas clicker) */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden" style={{ minWidth: "220px" }}>
          {/* Neon grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:20px_20px] opacity-25"></div>

          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="absolute inset-2 bg-slate-950/80 border border-dashed border-slate-800 rounded-lg cursor-crosshair overflow-hidden"
          >
            {shapes.map((s) => {
              const half = s.size / 2;
              if (s.type === 'circle') {
                return (
                  <div
                    key={s.id}
                    style={{
                      left: s.x - half,
                      top: s.y - half,
                      width: s.size,
                      height: s.size,
                      border: `2px solid ${s.color}`,
                      boxShadow: `0 0 10px ${s.color}`,
                    }}
                    className="absolute rounded-full pointer-events-none transition-transform hover:scale-110"
                  />
                );
              } else if (s.type === 'rect') {
                return (
                  <div
                    key={s.id}
                    style={{
                      left: s.x - half,
                      top: s.y - half,
                      width: s.size,
                      height: s.size,
                      border: `2px solid ${s.color}`,
                      boxShadow: `0 0 10px ${s.color}`,
                    }}
                    className="absolute rounded-md pointer-events-none"
                  />
                );
              } else if (s.type === 'heart') {
                return (
                  <div
                    key={s.id}
                    style={{
                      left: s.x - half,
                      top: s.y - half,
                      color: s.color,
                      fontSize: `${s.size}px`,
                      filter: `drop-shadow(0 0 5px ${s.color})`,
                    }}
                    className="absolute pointer-events-none leading-none select-none"
                  >
                    ❤️
                  </div>
                );
              } else {
                return (
                  <div
                    key={s.id}
                    style={{
                      left: s.x - half,
                      top: s.y - half,
                      color: s.color,
                      fontSize: `${s.size}px`,
                      filter: `drop-shadow(0 0 5px ${s.color})`,
                    }}
                    className="absolute pointer-events-none leading-none select-none"
                  >
                    ✨
                  </div>
                );
              }
            })}

            {shapes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <p className="text-slate-600 font-bold mb-1">Click Anywhere on Canvas to Draw Shapes!</p>
                <p className="text-[10px] text-pink-500/50 font-mono">Artie's fur adapts to your neon palette immediately & starts sketching!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
