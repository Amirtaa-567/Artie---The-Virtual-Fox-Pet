import React, { useState } from "react";
import { Folder, FileCode, Play, Coffee, Layers, Braces } from "lucide-react";

interface VSCodeAppProps {
  onTypeChar: () => void;
  onCodeCompiled: () => void;
  stats: { keystrokes: number };
}

interface CodeFile {
  name: string;
  code: string;
}

const mockFiles: Record<string, CodeFile> = {
  "App.tsx": {
    name: "App.tsx",
    code: `import React from 'react';\nimport { Canvas } from './components/Fox';\n\nexport default function App() {\n  return (\n    <div className="workspace">\n      <ArtieCompanion \n         state="focus"\n         mood="blue-glow" \n      />\n    </div>\n  );\n}`
  },
  "types.ts": {
    name: "types.ts",
    code: `export type CompanionMood = 'cozy' | 'neon' | 'blue' | 'pulse';\n\nexport interface Stats {\n  level: number;\n  xp: number;\n  focusMinutes: number;\n}`
  },
  "behavior.rs": {
    name: "behavior.rs",
    code: `fn get_fox_reaction(user_typed: bool) -> FoxState {\n    if user_typed {\n        println!("Attentive gaze activated!");\n        FoxState::Focus\n    } else {\n        FoxState::Idle\n    }\n}`
  }
};

export default function VSCodeApp({ onTypeChar, onCodeCompiled, stats }: VSCodeAppProps) {
  const [selectedFile, setSelectedFile] = useState<string>("App.tsx");
  const [typedBuffer, setTypedBuffer] = useState<string>("");
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success'>('idle');

  const handleEditorInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedBuffer(e.target.value);
    onTypeChar(); // notify parent to gain XP and statistics!
  };

  const runCompileSimulator = () => {
    setCompileStatus('compiling');
    setTimeout(() => {
      setCompileStatus('success');
      onCodeCompiled(); // trigger Fox happy jumps!
      setTimeout(() => setCompileStatus('idle'), 2500);
    }, 1500);
  };

  const activeFileData = mockFiles[selectedFile] || mockFiles["App.tsx"];

  return (
    <div className="h-full flex flex-col text-slate-300 font-sans text-xs bg-[#1e1e1e]">
      {/* IDE Tooling top header bar */}
      <div className="h-8 bg-[#252526] border-b border-[#1d1d1d] flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Braces className="w-4 h-4 text-[#007acc]" />
          <span className="font-mono text-[11px] text-[#858585] tracking-wider">WORKSPACE_ARTIE</span>
        </div>
        <button
          onClick={runCompileSimulator}
          disabled={compileStatus === 'compiling'}
          className="flex items-center gap-1.5 px-2 py-1 bg-[#007acc] text-white hover:bg-[#0062a3] disabled:bg-slate-700 disabled:opacity-50 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          {compileStatus === 'compiling' ? "BUILDING..." : "COMPILE & DEPLOY"}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Directory */}
        <div className="w-36 bg-[#252526] border-r border-[#1e1e1e] flex flex-col pt-2 select-none">
          <span className="px-3 text-[10px] font-bold font-mono text-slate-500 tracking-wider mb-2">EXPLORER</span>
          <div className="space-y-0.5">
            {Object.keys(mockFiles).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left border-l-2 text-[11px] font-mono transition-all ${
                  selectedFile === fileName
                    ? "border-sky-500 bg-[#37373d] text-white"
                    : "border-transparent text-slate-400 hover:bg-[#2a2a2b] hover:text-slate-200"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-sky-400" />
                {fileName}
              </button>
            ))}
          </div>
          <div className="mt-auto p-3 border-t border-slate-800 text-[9px] font-mono text-slate-500">
            <p>Keystrokes: {stats.keystrokes}</p>
            <p>Lang: TypeScript</p>
          </div>
        </div>

        {/* Multi tab Code view + Input Sandbox */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Active file tabs */}
          <div className="h-8 bg-[#2d2d2d] flex items-center px-1.5 border-b border-[#1e1e1e]">
            <span className="px-3 py-1 bg-[#1e1e1e] text-slate-100 font-mono text-[10px] flex items-center gap-1.5 border-t border-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {activeFileData.name}
            </span>
          </div>

          {/* Code display panel */}
          <div className="flex-1 p-3 font-mono text-[#d4d4d4] overflow-auto leading-relaxed border-b border-zinc-800">
            <pre className="text-[10.5px] opacity-75">{activeFileData.code}</pre>
          </div>

          {/* INTERACTIVE INPUT TERMINAL SANDBOX */}
          <div className="h-44 bg-[#181818] border-t border-zinc-900 p-2.5 flex flex-col overflow-hidden font-mono text-[10.5px]">
            <div className="flex items-center justify-between text-[#858585] border-b border-zinc-800 pb-1.5 mb-1.5 leading-none shadow-sm">
              <span className="flex items-center gap-1 text-[#3b82f6]">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Interactive Sandbox Output Terminal (Type for XP!)
              </span>
              <span className="text-[9px] text-[#22c55e]">+5 XP per keystroke</span>
            </div>

            <textarea
              value={typedBuffer}
              onChange={handleEditorInput}
              placeholder="// Artie the Fox is watching you type... Add custom logic or code here to level up and gain energy!"
              className="flex-1 w-full bg-transparent border-0 focus:ring-0 outline-none resize-none overflow-y-auto text-[#a7f3d0] placeholder-[#4b5563] text-[11px] font-mono leading-relaxed"
            />

            {/* Simulated compiler stdout logs */}
            {compileStatus === 'compiling' && (
              <div className="text-yellow-400 font-bold border-t border-zinc-900 pt-1.5 animate-pulse">
                $ npm run compile-fox --verbose ... loading virtual VM ...
              </div>
            )}
            {compileStatus === 'success' && (
              <div className="text-[#22c55e] font-bold border-t border-zinc-900 pt-1.5">
                $ COMPILE OK. Embedded Fox code hot-loaded! Artie jumped in joy! 🦊✨ (+40 XP reward)
              </div>
            )}
            {compileStatus === 'idle' && (
              <div className="text-slate-500 border-t border-zinc-900 pt-1 text-[9px]">
                Build Status: Ready to execute compiler loops.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
