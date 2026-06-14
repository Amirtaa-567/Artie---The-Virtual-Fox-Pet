import React from "react";
import { motion } from "motion/react";
import { X, Minus, Square } from "lucide-react";
import { ActiveWindow } from "../types";

interface DesktopWindowProps {
  windowState: ActiveWindow;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export default function DesktopWindow({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children
}: DesktopWindowProps) {
  if (!windowState.isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={
        windowState.isMaximized
          ? {
              x: 0,
              y: 0,
              width: "100%",
              height: "calc(100% - 56px)", // avoid taskbar overlap
              opacity: 1,
              scale: 1,
            }
          : {
              x: windowState.x,
              y: windowState.y,
              width: windowState.width,
              height: windowState.height,
              opacity: 1,
              scale: 1,
            }
      }
      transition={{ duration: 0.22, ease: "easeOut" }}
      drag={!windowState.isMaximized}
      dragHandleClassName="window-drag-handle"
      dragMomentum={false}
      dragElastic={0.03}
      onPointerDown={onFocus}
      style={{
        zIndex: windowState.zIndex,
        position: "absolute",
      }}
      className={`bg-slate-900/95 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl flex flex-col ${
        windowState.isMaximized ? "rounded-none border-0" : ""
      }`}
    >
      {/* OS TITLE BAR */}
      <div
        className="window-drag-handle h-11 bg-slate-950/80 border-b border-slate-800/80 px-4 flex items-center justify-between cursor-move select-none"
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-2">
          {/* Windows / Mac OS layout control dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <button
              onClick={onClose}
              id={`btn-close-${windowState.id}`}
              className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-400 flex items-center justify-center group/dot transition-colors cursor-pointer"
            >
              <X className="w-2 h-2 text-red-950 opacity-0 group-hover/dot:opacity-100" />
            </button>
            <button
              onClick={onMinimize}
              id={`btn-min-${windowState.id}`}
              className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 flex items-center justify-center group/dot transition-colors cursor-pointer"
            >
              <Minus className="w-2 h-2 text-yellow-950 opacity-0 group-hover/dot:opacity-100" />
            </button>
            <button
              onClick={onMaximize}
              id={`btn-max-${windowState.id}`}
              className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-400 flex items-center justify-center group/dot transition-colors cursor-pointer"
            >
              <Square className="w-[6px] h-[6px] text-green-950 opacity-0 group-hover/dot:opacity-100" />
            </button>
          </div>

          <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
            {windowState.title}
          </span>
        </div>

        {/* Small Active Badge indicator */}
        <div className="flex items-center gap-2 pr-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500/80 animate-pulse"></span>
          <span className="text-[10px] font-mono font-medium text-slate-500">active</span>
        </div>
      </div>

      {/* WINDOW CONTENT */}
      <div className="flex-1 overflow-auto bg-slate-950/40 relative">
        {children}
      </div>
    </motion.div>
  );
}
