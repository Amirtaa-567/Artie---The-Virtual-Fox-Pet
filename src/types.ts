/**
 * Types and interfaces for the Designer Fox desktop simulation
 */

export type PetState = 'idle' | 'walk' | 'sleep' | 'happy' | 'curious' | 'focus' | 'drawing' | 'pounce' | 'yawn' | 'excited';

export type AppMood = 'cozy' | 'neon' | 'blue' | 'green' | 'pulse';

export interface AppStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  keystrokes: number;
  mouseDistance: number;
  focusMinutes: number;
  doodlesUnlocked: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface VectorShape {
  type: 'line' | 'rect' | 'circle' | 'path';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  d?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface DoodleSketch {
  id: string;
  title: string;
  description: string;
  moodColor: string;
  timestamp: string;
  elements: VectorShape[];
  appOrigin: string;
}

export interface ActiveWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}
