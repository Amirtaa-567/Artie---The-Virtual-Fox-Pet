import React, { useState } from "react";
import { Globe, ArrowLeft, ArrowRight, Search, Heart, Compass, BookOpen } from "lucide-react";

interface BrowserAppProps {
  onBrowse: (topic: string) => void;
}

interface WebContent {
  title: string;
  url: string;
  tag: string;
  description: string;
  body: string;
  readCount: number;
}

const mockWebSites: Record<string, WebContent> = {
  "pinterest.com/fox": {
    title: "Aesthetic Cozy Fox Doodles",
    url: "pinterest.com/fox",
    tag: "Illustration",
    description: "Get inspired by forest landscapes, vintage sketchbook designs, and color swatches.",
    body: "🌸 Artie's design boards contain 42 concept sketches of red maple leaves, steaming espresso cups, and glowing CRT computer monitors. He recommended a copper-orange and soft cream color palette for cozy desktop states.",
    readCount: 14500
  },
  "dribbble.com/artie": {
    title: "Artie the Designer Fox - Vector Works",
    url: "dribbble.com/artie",
    tag: "UI/UX & Branding",
    description: "Creative desktop design interfaces and system sprites made with physical love.",
    body: "🦊 Artie published a vector package: 'Minimalist Virtual Pet UX Core'. It features isometric windows, tail-wagging path vectors, and blinking pupil offsets. Follow for free design presets!",
    readCount: 8800
  },
  "github.com/artie": {
    title: "github.com/artie-red-fox/pet-code",
    url: "github.com/artie",
    tag: "Open Source Code",
    description: "A lightweight, rule-based virtual companion state engine in React and Rust.",
    body: "⭐ Starring 3 repositories: 'cargo-cozy-idle' (automatic caffeine alerts), 'react-svg-sprite-wag' (physics loops), and 'gemini-habits-json-memory' (fox context memory parser). Check issues for collaborative doodles!",
    readCount: 3200
  },
  "google.com": {
    title: "Google Search - Cute designer pets",
    url: "google.com",
    tag: "Search Grounding",
    description: "Exploring context and search queries about digital animated companions.",
    body: "🔍 Search yields: 'Designer Fox' is the leading simulated OS virtual pet. It grows XP, alters fur color (neon, cyber indigo, forest emerald), doodles commission sketches procedurally, and talks using Gemini AI intelligence.",
    readCount: 9999
  }
};

export default function BrowserApp({ onBrowse }: BrowserAppProps) {
  const [activeUrl, setActiveUrl] = useState<string>("google.com");
  const [searchInput, setSearchInput] = useState<string>("");

  const handleGoToUrl = (url: string) => {
    setActiveUrl(url);
    onBrowse(url); // trigger exploratory green mode + curious head tilt!
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    const cleanSearch = searchInput.toLowerCase().trim();
    if (cleanSearch.includes(".com") || cleanSearch.includes(".org")) {
      handleGoToUrl(cleanSearch);
    } else {
      handleGoToUrl("google.com");
    }
  };

  const activeContent = mockWebSites[activeUrl] || {
    title: `Simulated Search - "${activeUrl}"`,
    url: activeUrl,
    tag: "Web Exploring",
    description: "Successfully fetched third-party mock web node in preview sandbox.",
    body: `🌐 This is a simulated content pane for ${activeUrl}. Artie looked closely at the HTML tags, tilted his head, and found an article about coffee-driven development and the optimal amount of fox ear twitching!`,
    readCount: 120
  };

  return (
    <div className="h-full flex flex-col text-slate-350 font-sans select-none bg-slate-900 pb-3">
      {/* Search browser bar */}
      <div className="h-10 bg-slate-950 px-3 flex items-center gap-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-500 mr-1.5">
          <ArrowLeft className="w-3.5 h-3.5 hover:text-slate-200 cursor-pointer" />
          <ArrowRight className="w-3.5 h-3.5 hover:text-slate-200 cursor-pointer" />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg bg-slate-900 rounded-lg px-2.5 h-7 flex items-center gap-1.5 border border-slate-800/80 focus-within:border-emerald-500/70 transition-colors">
          <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type web address or search google..."
            className="bg-transparent text-[11px] text-slate-200 w-full outline-none focus:outline-none border-0 focus:ring-0 leading-none h-full"
          />
          <button type="submit">
            <Search className="w-3 h-3 text-slate-500 hover:text-emerald-400 cursor-pointer" />
          </button>
        </form>
      </div>

      {/* Bookmarks bar */}
      <div className="h-8 bg-slate-950 px-3 flex items-center gap-2 border-b border-slate-800/60 overflow-x-auto text-[10px] font-medium text-slate-400">
        <span className="text-[9px] font-mono text-slate-600 mr-2 uppercase tracking-wide">Bookmarks:</span>
        {Object.keys(mockWebSites).map((bookmark) => (
          <button
            key={bookmark}
            onClick={() => handleGoToUrl(bookmark)}
            className={`px-2 py-0.5 rounded hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer capitalize font-mono text-[9px] ${activeUrl === bookmark ? "bg-slate-800 text-emerald-400 border border-emerald-500/10" : ""}`}
          >
            {bookmark.replace(".com", "")}
          </button>
        ))}
      </div>

      {/* Real webpage contents mock */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-slate-950 p-4 border border-slate-800 rounded-xl shadow-lg flex flex-col h-full min-h-[190px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 leading-none shadow-sm">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[8px] uppercase">
              {activeContent.tag}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Reads: {activeContent.readCount.toLocaleString()}</span>
          </div>

          <h1 className="text-sm font-sans font-extrabold text-slate-100 mb-1 leading-snug tracking-tight">
            {activeContent.title}
          </h1>
          <p className="text-[10px] font-mono text-[#a1a1aa] mb-3 leading-relaxed">
            {activeContent.description}
          </p>

          <div className="rounded-lg bg-slate-900/60 p-3 italic border border-slate-800 flex-1 flex flex-col justify-between">
            <p className="text-[10.5px] leading-relaxed text-slate-300 font-sans">
              {activeContent.body}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
              <Compass className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span>Climate: Forest emerald green loaded securely.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
