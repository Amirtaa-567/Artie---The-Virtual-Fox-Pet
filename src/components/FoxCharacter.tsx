import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Heart, Zap, Gamepad2, Brain } from "lucide-react";
import { PetState, AppMood } from "../types";

interface FoxCharacterProps {
  petState: PetState;
  setPetState: (state: PetState) => void;
  activeApp: string;
  appMood: AppMood;
  stats: any;
  onReceiveXp: (amount: number) => void;
  onDoodleTriggered: () => void;
  addNotification: (title: string, msg: string, type: 'success' | 'info' | 'error' | 'warning') => void;
}

export default function FoxCharacter({
  petState,
  setPetState,
  activeApp,
  appMood,
  stats,
  onReceiveXp,
  onDoodleTriggered,
  addNotification
}: FoxCharacterProps) {
  const [bubbleText, setBubbleText] = useState<string>("Yip! I'm Artie, your design companion! Float me anywhere!");
  const [showBubble, setShowBubble] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  const foxRef = useRef<HTMLDivElement>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set mood-based color gradients
  const getGradients = () => {
    switch (appMood) {
      case 'neon': // Figma / Canva
        return {
          primary: "url(#grad-neon-primary)",
          secondary: "url(#grad-neon-accent)",
          belly: "#ffe4e6",
          glow: "rgba(236, 72, 153, 0.6)",
        };
      case 'blue': // VS Code / Developer
        return {
          primary: "url(#grad-blue-primary)",
          secondary: "url(#grad-blue-accent)",
          belly: "#ecfeff",
          glow: "rgba(6, 182, 212, 0.6)",
        };
      case 'green': // Web Browser / Research
        return {
          primary: "url(#grad-green-primary)",
          secondary: "url(#grad-green-accent)",
          belly: "#f0fdf4",
          glow: "rgba(34, 197, 94, 0.6)",
        };
      case 'pulse': // Spotify / Music
        return {
          primary: "url(#grad-pulse-primary)",
          secondary: "url(#grad-pulse-accent)",
          belly: "#faf5ff",
          glow: "rgba(168, 85, 247, 0.7)",
        };
      case 'cozy': // Idle OS Desk
      default:
        return {
          primary: "url(#grad-cozy-primary)",
          secondary: "url(#grad-cozy-accent)",
          belly: "#fffaf0",
          glow: "rgba(249, 115, 22, 0.4)",
        };
    }
  };

  const colors = getGradients();

  // Dialog bubble auto-hide
  const triggerBubble = (text: string, duration = 4500) => {
    setBubbleText(text);
    setShowBubble(true);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, duration);
  };

  // Cursor tracking for eye pupils
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!foxRef.current || petState === 'sleep') return;
      const rect = foxRef.current.getBoundingClientRect();
      const foxCenterX = rect.left + rect.width / 2;
      const foxCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - foxCenterX;
      const dy = e.clientY - foxCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Trigger curious head tilt if cursor is very close
      if (distance < 120 && petState === 'idle') {
        setTargetRotation(dx > 0 ? 12 : -12);
        if (Math.random() < 0.05) {
          setPetState('curious');
        }
      } else if (petState !== 'curious') {
        setTargetRotation(0);
      }

      // Limit pupil translation inside the eye sockets
      const maxOffset = 6;
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(distance / 200, 1);
      setPupilOffset({
        x: Math.cos(angle) * maxOffset * intensity,
        y: Math.sin(angle) * maxOffset * intensity
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [petState, setPetState]);

  // Handle dialog triggers based on activeApp & petState transitions
  useEffect(() => {
    if (petState === 'sleep') {
      triggerBubble("Zzz... (Artie is dreaming of geometric rabbits...)", 3500);
      return;
    }
    if (petState === 'pounce') {
      triggerBubble("Leaping loops! Pouncing directly on those cute design pixels! 🐾🚀", 3500);
      return;
    }
    if (petState === 'yawn') {
      triggerBubble("Yaaaawwwn... Stretching my red fox whiskers. Inspiration to the sky! 🥱✨", 3500);
      return;
    }
    if (petState === 'excited') {
      triggerBubble("OMG, I'm so excited! Tail is wagging at ultrasonic frequencies! 🦊🎉✨", 4005);
      return;
    }

    switch (activeApp) {
      case 'Figma':
        if (petState === 'drawing') {
          triggerBubble("Ooh, let's draw some vectors together! *pant pant*", 4000);
        } else {
          triggerBubble("Whoa, Figma! Fur setting is NEON gradient. Let's make art!", 4000);
        }
        break;
      case 'VS Code':
        triggerBubble("Coding! Staring intensely at your syntax. Perfect tech Blue!", 4000);
        break;
      case 'Spotify':
        triggerBubble("Subwoofers active! I'm vibing to the beats. Purple aura unlocked!", 4000);
        break;
      case 'Browser':
        triggerBubble("We are exploring! Emerald Green mode. Looking for ideas...", 4000);
        break;
      case 'Desktop':
      default:
        if (petState === 'happy') {
          triggerBubble("Yip yee! Jump! Jump! We are smashing tasks today!", 3000);
        } else {
          triggerBubble("Cozy ambient orange active. Sizzling down on our desktop!", 4000);
        }
        break;
    }
  }, [activeApp, petState]);

  // Random blink interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (petState === 'sleep') return;
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 4000);

    return () => clearInterval(blinkInterval);
  }, [petState]);

  // Click Artie behavior
  const handlePetClicked = () => {
    onReceiveXp(15);
    setIsJumping(true);
    const originalState = petState;
    setPetState('happy');
    const clicksDialogs = [
      "Yip! That tickles! +15 Cozy XP!",
      "I love sitting on your screen. Keep creating!",
      "Yawn... Keep typing, I'm boosting your designer luck!",
      "Wait! Did you check my sketchbook? I left some doodles!",
      "Click click! You are leveling me up!",
      "Did you know my fur glows violet when Spotify is playing?"
    ];
    triggerBubble(clicksDialogs[Math.floor(Math.random() * clicksDialogs.length)]);

    setTimeout(() => {
      setIsJumping(false);
      setPetState(originalState);
    }, 1200);
  };

  // Double click acrobatics
  const handlePetDoubleClicked = () => {
    onReceiveXp(50);
    setIsJumping(true);
    setPetState('happy');
    addNotification("Double-Click Acrobatics!", "Artie performed a perfect backflip! +50 XP", "success");
    triggerBubble("YIPPIEE! Double-flip! Pure physical design excellence! 🦊✨", 4000);

    setTimeout(() => {
      setIsJumping(false);
      setPetState('idle');
    }, 1500);
  };

  return (
    <div id="designer-fox-pet" className="relative group select-none select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 text-center bg-white border border-gray-100 rounded-2xl shadow-xl p-3 z-50 text-xs font-semibold text-gray-800"
            style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" }}
          >
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100 -mt-2"></div>
            <p className="relative z-10 leading-relaxed text-[11px] font-sans text-gray-700">
              {bubbleText}
            </p>
            <div className="mt-1.5 flex justify-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-400 animate-ping"></span>
              <span className="text-[9px] text-orange-500 font-mono">Artie</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Aura Halo for Spotify pulse mood */}
      {appMood === 'pulse' && (
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-purple-500/25 rounded-full blur-2xl -z-10"
        />
      )}

      {/* Main Draggable Fox Canvas */}
      <motion.div
        ref={foxRef}
        onClick={handlePetClicked}
        onDoubleClick={handlePetDoubleClicked}
        animate={{
          y: isJumping 
            ? [0, -40, 0] 
            : petState === 'sleep' 
              ? [0, 2, 0] 
              : petState === 'pounce' 
                ? [0, 12, -28, 0] // crouch down, launch high, land
                : petState === 'excited' 
                  ? [0, -12, 0, -12, 0] // rapid excited hopping
                  : [0, -4, 0],
          rotate: petState === 'pounce'
            ? [0, -10, 15, 0]
            : petState === 'excited'
              ? [0, -6, 6, -6, 6, 0]
              : targetRotation,
          scaleY: petState === 'pounce'
            ? [1, 0.7, 1.25, 0.9, 1] // squash and stretch during jump
            : petState === 'excited'
              ? [1, 1.08, 0.95, 1.08, 1]
              : petState === 'yawn'
                ? [1, 1.04, 1, 0.98, 1] // breathing stretch
                : 1,
          scaleX: petState === 'pounce'
            ? [1, 1.2, 0.85, 1.1, 1]
            : petState === 'excited'
              ? [1, 0.95, 1.05, 0.95, 1]
              : petState === 'sleep'
                ? 0.9
                : 1,
        }}
        transition={{
          y: isJumping
            ? { duration: 0.6, ease: "easeOut" }
            : petState === 'pounce'
              ? { duration: 1.0, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }
              : petState === 'excited'
                ? { duration: 0.5, ease: "easeInOut", repeat: Infinity }
                : { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          rotate: petState === 'pounce' || petState === 'excited'
            ? { duration: petState === 'excited' ? 0.4 : 1.0, repeat: Infinity }
            : { duration: 0.2 },
          scaleY: { duration: petState === 'pounce' ? 1.0 : petState === 'excited' ? 0.5 : 2.5, repeat: Infinity },
          scaleX: { duration: petState === 'pounce' ? 1.0 : petState === 'excited' ? 0.5 : 2.5, repeat: Infinity }
        }}
        className="w-32 h-32 cursor-grab active:cursor-grabbing relative flex items-center justify-center filter drop-shadow-lg"
      >
        {/* Sleeping Snore indicators */}
        {petState === 'sleep' && (
          <div className="absolute top-0 right-2 flex flex-col font-mono text-cyan-500 text-[10px] space-y-1 font-bold italic animate-pulse">
            <motion.span animate={{ y: [0, -10], x: [0, 5], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>Z</motion.span>
            <motion.span animate={{ y: [0, -10], x: [0, 5], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>z</motion.span>
            <motion.span animate={{ y: [0, -10], x: [0, 5], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}>z</motion.span>
          </div>
        )}

        {/* Custom SVG Fox Character Component */}
        <svg viewBox="0 0 120 120" className="w-full h-full select-none">
          {/* Definitions for Gradients */}
          <defs>
            {/* Cozy Gradient (Main Desktop Theme) */}
            <linearGradient id="grad-cozy-primary" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="grad-cozy-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            {/* Neon Gradient (Figma Mode) */}
            <linearGradient id="grad-neon-primary" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="grad-neon-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Blue Tech Gradient (VS Code Mode) */}
            <linearGradient id="grad-blue-primary" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="grad-blue-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Browser Green Gradient (Research Mode) */}
            <linearGradient id="grad-green-primary" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="grad-green-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Spotify Pulsing Violet Gradient */}
            <linearGradient id="grad-pulse-primary" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="grad-pulse-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* TAIL (Back Layer) */}
          <motion.path
            d="M 60 85 C 40 85, 30 70, 20 75 C 10 80, 5 95, 20 100 C 35 105, 55 95, 60 85 Z"
            fill={colors.primary}
            animate={{
              rotate: petState === 'sleep' ? [10, 15, 10] : (petState === 'happy' || petState === 'excited') ? [-50, 45, -50] : petState === 'pounce' ? [-10, -25, 10, 0] : [-5, 5, -5],
              x: petState === 'sleep' ? -10 : 0,
              y: petState === 'sleep' ? -5 : 0
            }}
            transition={{ duration: (petState === 'happy' || petState === 'excited') ? 0.15 : 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "85px" }}
          />
          {/* Fluffy Tail Tip */}
          <motion.path
            d="M 20 75 C 15 76, 8 82, 10 90 C 12 96, 18 97, 23 93 Z"
            fill="#ffffff"
            animate={{
              rotate: petState === 'sleep' ? [10, 15, 10] : (petState === 'happy' || petState === 'excited') ? [-50, 45, -50] : petState === 'pounce' ? [-10, -25, 10, 0] : [-5, 5, -5],
              x: petState === 'sleep' ? -10 : 0,
              y: petState === 'sleep' ? -5 : 0
            }}
            transition={{ duration: (petState === 'happy' || petState === 'excited') ? 0.15 : 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "85px" }}
          />

          {/* BACK EAR */}
          <motion.path
            d="M 33 50 L 15 20 L 45 42 Z"
            fill={colors.secondary}
            animate={{
              rotate: petState === 'curious' ? [-5, -15, -5] : petState === 'yawn' ? [-15, -10, -15] : [0, 5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "33px", originY: "50px" }}
          />
          {/* Inner Back Ear */}
          <path d="M 31 46 L 20 25 L 40 40 Z" fill="#fda4af" opacity="0.8" />

          {/* BODY / TORSO */}
          <motion.ellipse
            cx="60"
            cy="80"
            rx="24"
            ry="20"
            fill={colors.primary}
            animate={{
              scaleY: petState === 'sleep' ? 0.85 : [1, 1.02, 1]
            }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ originX: "60px", originY: "90px" }}
          />
          {/* Fluffy Belly Patch */}
          <motion.ellipse
            cx="60"
            cy="76"
            rx="14"
            ry="11"
            fill={colors.belly}
            animate={{
              scaleY: petState === 'sleep' ? 0.85 : [1, 1.02, 1]
            }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ originX: "60px", originY: "90px" }}
          />

          {/* FRONT EAR */}
          <motion.path
            d="M 87 50 L 105 20 L 75 42 Z"
            fill={colors.primary}
            animate={{
              rotate: petState === 'curious' ? [5, 20, 5] : petState === 'yawn' ? [15, 10, 15] : [0, -4, 0]
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "87px", originY: "50px" }}
          />
          {/* Inner Front Ear */}
          <path d="M 85 46 L 98 25 L 78 40 Z" fill="#fda4af" opacity="0.8" />

          {/* HEAD */}
          <motion.circle
            cx="60"
            cy="52"
            r="26"
            fill={colors.primary}
            animate={{
              y: petState === 'sleep' ? 4 : [0, -1.5, 0],
              rotate: petState === 'curious' ? 15 : petState === 'sleep' ? 5 : 0
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "52px" }}
          />

          {/* Cheeks (Cute fluff) */}
          <motion.path
            d="M 34 52 Q 22 56 31 63 L 40 58 Z"
            fill={colors.primary}
            animate={{
              y: petState === 'sleep' ? 4 : [0, -1.5, 0],
              rotate: petState === 'curious' ? 15 : petState === 'sleep' ? 5 : 0
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "52px" }}
          />
          <motion.path
            d="M 86 52 Q 98 56 89 63 L 80 58 Z"
            fill={colors.primary}
            animate={{
              y: petState === 'sleep' ? 4 : [0, -1.5, 0],
              rotate: petState === 'curious' ? 15 : petState === 'sleep' ? 5 : 0
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "52px" }}
          />

          {/* Snout Mask */}
          <motion.polygon
            points="50,56 70,56 60,69"
            fill="#ffffff"
            animate={{
              y: petState === 'sleep' ? 4 : [0, -1.5, 0],
              rotate: petState === 'curious' ? 15 : petState === 'sleep' ? 5 : 0
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "52px" }}
          />
          <motion.circle
            cx="60"
            cy="67"
            r="3"
            fill="#27272a"
            animate={{
              y: petState === 'sleep' ? 4 : [0, -1.5, 0],
              rotate: petState === 'curious' ? 15 : petState === 'sleep' ? 5 : 0
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "60px", originY: "52px" }}
          />

          {/* Cute Yawning or Excited Open Smile Mouth */}
          {(petState === 'yawn' || petState === 'excited') && (
            <g>
              {/* Mouth Cavity */}
              <motion.ellipse
                cx="60"
                cy="73"
                rx={petState === 'yawn' ? 5 : 4}
                ry={petState === 'yawn' ? 7.2 : 4.5}
                fill="#310808"
                animate={{
                  scaleY: petState === 'yawn' ? [0, 1.15, 1.15, 0] : [0.6, 1, 0.6],
                }}
                transition={{
                  duration: petState === 'yawn' ? 2.5 : 0.45,
                  repeat: Infinity,
                }}
                style={{ originX: "60px", originY: "73px" }}
              />
              {/* Little Soft Pink Tongue */}
              <motion.path
                d="M 57.2 75.5 C 57.2 78.5, 62.8 78.5, 62.8 75.5 Z"
                fill="#fda4af"
                animate={{
                  scaleY: petState === 'yawn' ? [0, 1.15, 1.15, 0] : [0.6, 1, 0.6],
                }}
                transition={{
                  duration: petState === 'yawn' ? 2.5 : 0.45,
                  repeat: Infinity,
                }}
                style={{ originX: "60px", originY: "73px" }}
              />
            </g>
          )}

          {/* EYES LAYER */}
          {(petState === 'sleep' || petState === 'yawn') ? (
            // Sleeping eyes or squeezed shut yawning eyes arcs
            <g>
              <path d="M 42 51 Q 47 55 52 51" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 68 51 Q 73 55 78 51" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          ) : isBlinking ? (
            // Blink horizontal slits
            <g>
              <line x1="41" y1="50" x2="51" y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <line x1="69" y1="50" x2="79" y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (petState === 'happy' || petState === 'excited') ? (
            // Sparkly Star / Curvy Eyes
            <g>
              <path d="M 41 52 Q 46 45 51 52" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 69 52 Q 74 45 79 52" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Cute little blush */}
              <ellipse cx="37" cy="58" rx="4" ry="2" fill="#fb7185" opacity="0.7" />
              <ellipse cx="83" cy="58" rx="4" ry="2" fill="#fb7185" opacity="0.7" />
            </g>
          ) : petState === 'pounce' ? (
            // Extreme dilated hunting star-pupil eyes for pounce!
            <g>
              <circle cx="46" cy="49" r="7.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <motion.circle
                cx="46"
                cy="49"
                r="5.5"
                fill="#1e293b"
                animate={{ scale: [1, 1.22, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle cx="44.2" cy="47.2" r="1.5" fill="#ffffff" />

              <circle cx="74" cy="49" r="7.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <motion.circle
                cx="74"
                cy="49"
                r="5.5"
                fill="#1e293b"
                animate={{ scale: [1, 1.22, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle cx="72.2" cy="47.2" r="1.5" fill="#ffffff" />
            </g>
          ) : (
            // Standard reactive interactive eyes with pupil tracking!
            <g>
              {/* Left Eye Whites */}
              <circle cx="46" cy="49" r="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="0.5" />
              {/* Left Pupil */}
              <circle
                cx={46 + pupilOffset.x}
                cy={49 + pupilOffset.y}
                r="3.5"
                fill="#18181b"
              />
              <circle cx={44.5 + pupilOffset.x} cy={47.5 + pupilOffset.y} r="1" fill="#ffffff" />

              {/* Right Eye Whites */}
              <circle cx="74" cy="49" r="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="0.5" />
              {/* Right Pupil */}
              <circle
                cx={74 + pupilOffset.x}
                cy={49 + pupilOffset.y}
                r="3.5"
                fill="#18181b"
              />
              <circle cx={72.5 + pupilOffset.x} cy={47.5 + pupilOffset.y} r="1" fill="#ffffff" />

              {/* Nerd glasses for focus coding state! */}
              {petState === 'focus' && (
                <g>
                  <circle cx="46" cy="49" r="9" stroke="#fda4af" strokeWidth="2.5" fill="none" />
                  <circle cx="74" cy="49" r="9" stroke="#fda4af" strokeWidth="2.5" fill="none" />
                  <line x1="55" y1="49" x2="65" y2="49" stroke="#fda4af" strokeWidth="2.5" />
                  <line x1="37" y1="49" x2="31" y2="45" stroke="#fda4af" strokeWidth="2" />
                  <line x1="83" y1="49" x2="89" y2="45" stroke="#fda4af" strokeWidth="2" />
                </g>
              )}
            </g>
          )}

          {/* Mini Cute Cheeks blush */}
          {petState === 'idle' || petState === 'focus' || petState === 'curious' ? (
            <g>
              <ellipse cx="37" cy="57" rx="3.5" ry="1.5" fill="#f472b6" opacity="0.4" />
              <ellipse cx="83" cy="57" rx="3.5" ry="1.5" fill="#f472b6" opacity="0.4" />
            </g>
          ) : null}

          {/* SKECHING ARMS / Paws */}
          {petState === 'drawing' ? (
            <g>
              {/* Drawing Paws holding a brush/pencil of correct theme color */}
              <motion.g
                animate={{
                  x: [0, 5, -2, 3, 0],
                  y: [0, -4, 4, -2, 0]
                }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Pencil */}
                <line x1="72" y1="77" x2="90" y2="60" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
                {/* Pencil tip */}
                <polygon points="90,60 93,60 92,57" fill="#ef4444" />
                {/* Left Paw */}
                <circle cx="72" cy="78" r="6" fill="#ffffff" stroke="#c084fc" strokeWidth="1" />
              </motion.g>
              <circle cx="48" cy="80" r="5" fill="#ffffff" />
            </g>
          ) : petState === 'pounce' ? (
            <g>
              {/* Wide extended ready pouncing claws paws */}
              <motion.g
                animate={{
                  y: [0, -5, 3, 0],
                  x: [-2, 2, -1, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx="34" cy="90" r="6.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                <circle cx="86" cy="90" r="6.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              </motion.g>
            </g>
          ) : (
            // Idle cute standard sitting paws
            <g>
              {/* Left Paws */}
              <circle cx="46" cy="98" r="6" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1" />
              <rect x="43" y="93" width="6" height="6" fill="#18181b" rx="1.5" opacity="0.1" />

              {/* Right Paws */}
              <circle cx="74" cy="98" r="6" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1" />
              <rect x="71" y="93" width="6" height="6" fill="#18181b" rx="1.5" opacity="0.1" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
