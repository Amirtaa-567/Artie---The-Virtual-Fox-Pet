import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  MessageSquare,
  Zap,
  Coffee,
  Heart,
  Music,
  Download,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Eye,
  Settings,
  HelpCircle,
  FileCode,
  Terminal,
  Clock,
  Compass,
  AlertCircle,
  TrendingUp,
  Layout
} from "lucide-react";
import FoxCharacter from "./components/FoxCharacter";
import { PetState, AppMood, AppStats, ChatMessage } from "./types";
import JSZip from "jszip";

export default function App() {
  // Fox Pet Stats (level, xp, focus time)
  const [stats, setStats] = useState<AppStats>(() => {
    const saved = localStorage.getItem("artie_stats");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      level: 1,
      xp: 35,
      xpToNextLevel: 100,
      keystrokes: 1420,
      mouseDistance: 240,
      focusMinutes: 15,
      doodlesUnlocked: 2
    };
  });

  // Save stats
  useEffect(() => {
    localStorage.setItem("artie_stats", JSON.stringify(stats));
  }, [stats]);

  // General App states
  const [petState, setPetState] = useState<PetState>("idle");
  const [appMood, setAppMood] = useState<AppMood>("cozy");
  const [activeApp, setActiveApp] = useState<string>("Desktop Home");
  const [ambientTheme, setAmbientTheme] = useState<string>("sunset"); // sunset, cyberpunk, forest, midnight
  
  // Simulated Chrome Extension installation states
  const [isExtensionActive, setIsExtensionActive] = useState<boolean>(() => {
    const saved = localStorage.getItem("artie_extension_active");
    return saved !== "false"; // Default to true
  });
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    localStorage.setItem("artie_extension_active", String(isExtensionActive));
  }, [isExtensionActive]);
  
  // Custom dialog notifications
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: string }[]>([]);

  // AI Chat States
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Yip! I'm Artie, your virtual pixel companion. Customize me using the compiler tab, download my unpacked archive, and load me as a permanent Google Chrome Extension! Let's chat!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Active Menu tabs: 'companion', 'chat', 'compiler', 'install'
  const [activeTab, setActiveTab] = useState("companion");

  // Extension Customizer state variable config
  const [extName, setExtName] = useState("Artie - AI Virtual Pet");
  const [extDesc, setExtDesc] = useState("Your animated, cursor-tracking, highly supportive AI virtual pet companion fox on any webpage!");
  const [extThemeColor, setExtThemeColor] = useState("#f97316"); // orange, pink, cyan, gold
  const [extPosition, setExtPosition] = useState("bottom-right"); // bottom-right, bottom-left
  const [extBubbleDuration, setExtBubbleDuration] = useState(5); // seconds
  const [extInitialGreeting, setExtInitialGreeting] = useState("Yip! I'm Artie. Let's inspect some web content together!");
  
  // Code Viewer file selections
  const [viewedFile, setViewedFile] = useState("manifest.json");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // Clock
  const [clockTime, setClockTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync pet moods with active configurations
  const handleMoodSync = (mood: AppMood, appName: string) => {
    setAppMood(mood);
    setActiveApp(appName);
    addNotification(`Fur coated in ${mood.toUpperCase()} glow!`, "info");
  };

  const addNotification = (text: string, type = "success") => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const receiveXp = (amount: number) => {
    setStats((prev) => {
      const nextXp = prev.xp + amount;
      const nextLevelXp = prev.xpToNextLevel;
      if (nextXp >= nextLevelXp) {
        const excess = nextXp - nextLevelXp;
        const nextLevel = prev.level + 1;
        const nextNextLevelXp = Math.floor(nextLevelXp * 1.35);
        
        setTimeout(() => {
          addNotification(`Level Up! Artie is now Level ${nextLevel}! 🦊✨`, "success");
        }, 0);

        return {
          ...prev,
          xp: excess,
          level: nextLevel,
          xpToNextLevel: nextNextLevelXp
        };
      } else {
        setTimeout(() => {
          addNotification(`+${amount} XP Gained!`, "success");
        }, 0);

        return {
          ...prev,
          xp: nextXp
        };
      }
    });
  };

  // Interact buttons callbacks
  const feedPet = (foodType: string) => {
    receiveXp(20);
    setPetState("excited");
    if (foodType === "coffee") {
      addNotification("Artie drank hot coffee! Hyperactive speed enabled!", "success");
      setTimeout(() => setPetState("focus"), 2000);
    } else {
      addNotification("Artie munched on cookie crumbs!", "success");
      setTimeout(() => setPetState("happy"), 2000);
    }
  };

  const triggerAcrobatics = () => {
    receiveXp(40);
    setPetState("pounce");
    addNotification("Artie performed high-speed pounce acrobatics!", "success");
    setTimeout(() => setPetState("excited"), 1200);
  };

  const triggerLofiListen = () => {
    receiveXp(15);
    setPetState("happy");
    setAppMood("pulse");
    setActiveApp("Spotify Beats");
    addNotification("Playing cozy ambient lo-fi tracks. Purple aura unlocked!", "info");
    setTimeout(() => setPetState("idle"), 3000);
  };

  const triggerSleep = () => {
    if (petState === "sleep") {
      setPetState("yawn");
      addNotification("Inspiration waking up! Artie stretched his ears.", "info");
      setTimeout(() => setPetState("idle"), 1500);
    } else {
      setPetState("sleep");
      addNotification("Zzz... Artie is cataloging some fluffy code bugs", "info");
    }
  };

  // AI chat API call
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userMsg = userInput.trim();
    setUserInput("");
    setIsSending(true);

    const newUserMessage: ChatMessage = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      content: userMsg,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory((prev) => [...prev, newUserMessage]);

    // Simple temporary placeholder reply to prevent UI freezing before API reply
    setPetState("focus");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          activeApp: activeApp,
          petState: petState,
          level: stats.level,
          xp: stats.xp,
          history: chatHistory.slice(-5)
        })
      });

      const data = await response.json();
      const botReply = data.reply || "Yip! (Artie looks at you curiously, head-tilted)";

      setChatHistory((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          content: botReply,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setPetState("happy");
    } catch (e) {
      // Rule-based elegant offline dialogs
      const fallbackReply = "Yip! Connected directly to your local workspace! (Check .env for GEMINI_API_KEY to activate full intelligence!)";
      setChatHistory((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setPetState("idle");
    } finally {
      setIsSending(false);
    }
  };

  // Get color hex values based on theme choice
  const getThemeHex = () => {
    switch (extThemeColor) {
      case "#ec4899": return { main: "#ec4899", accent: "#f43f5e", pulse: "rgba(236,72,153,0.3)" };
      case "#0ea5e9": return { main: "#0ea5e9", accent: "#3B82F6", pulse: "rgba(14,165,233,0.3)" };
      case "#10b981": return { main: "#10b981", accent: "#059669", pulse: "rgba(16,185,129,0.3)" };
      case "#eab308": return { main: "#eab308", accent: "#f59e0b", pulse: "rgba(234,179,8,0.3)" };
      case "#f97316":
      default: return { main: "#f97316", accent: "#c2410c", pulse: "rgba(249,115,22,0.3)" };
    }
  };

  // Dynamic code compiler scripts
  const compiledFiles = {
    "manifest.json": `{
  "manifest_version": 3,
  "name": "${extName}",
  "version": "1.0.0",
  "description": "${extDesc}",
  "permissions": ["storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "content_scripts": [
    {
      "js": ["content.js"],
      "css": ["style.css"],
      "matches": ["<all_urls>"]
    }
  ],
  "icons": {
    "128": "icon.png"
  }
}`,

    "style.css": `/* Floating Artie Shadow Host styling */
#artie-pet-extension-host {
  all: initial;
}

#artie-pet-container {
  position: fixed;
  z-index: 2147483647; /* absolute max zindex */
  ${extPosition === "bottom-right" ? "right: 25px; bottom: 25px;" : "left: 25px; bottom: 25px;"}
  width: 120px;
  height: 120px;
  cursor: grab;
  user-select: none;
  filter: drop-shadow(0 10px 25px rgba(0,0,0,0.25));
  transition: transform 0.2s ease, opacity 0.3s ease;
  animation: artie-sway 4s infinite ease-in-out;
}

#artie-pet-container:active {
  cursor: grabbing;
}

/* Chat bubble styling above Artie */
#artie-bubble {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #1f2937;
  border-radius: 14px;
  padding: 8px 12px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  width: 150px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  border: 1px solid #f3f4f6;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

#artie-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

#artie-bubble.visible {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-5px);
}

/* Animations */
@keyframes artie-sway {
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}

.artie-jump {
  animation: artie-jumping 0.6s cubic-bezier(0.25, 1, 0.5, 1) !important;
}

.artie-backflip {
  animation: artie-spinning 1s ease-in-out !important;
}

@keyframes artie-jumping {
  0% { transform: translateY(0); }
  45% { transform: translateY(-45px) scaleY(1.1); }
  65% { transform: translateY(5px) scaleY(0.9); }
  100% { transform: translateY(0) scaleY(1); }
}

@keyframes artie-spinning {
  0% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-50px) rotate(180deg); }
  80% { transform: translateY(5px) rotate(340deg); }
  100% { transform: translateY(0) rotate(360deg); }
}`,

    "content.js": `/**
 * Artie the AI Virtual Pet - Content Script
 */
(function() {
  if (document.getElementById('artie-pet-extension-host')) return;

  // Create containment host for shadow protection
  const host = document.createElement('div');
  host.id = 'artie-pet-extension-host';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // Styles Injection
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('style.css');
  shadow.appendChild(styleLink);

  // Fox Container
  const container = document.createElement('div');
  container.id = 'artie-pet-container';
  shadow.appendChild(container);

  // Dialog bubble
  const bubble = document.createElement('div');
  bubble.id = 'artie-bubble';
  bubble.innerText = "${extInitialGreeting}";
  container.appendChild(bubble);

  // Beautiful Vector Fox SVG elements
  const svgTheme = "${extThemeColor}";
  const svgThemeAccent = "${extThemeColor === '#f97316' ? '#c2410c' : extThemeColor === '#ec4899' ? '#f43f5e' : extThemeColor === '#0ea5e9' ? '#3B82F6' : '#059669'}";

  container.innerHTML += \`<svg viewBox="0 0 120 120" style="width:100%;height:100%;">
    <!-- DEFINITIONS -->
    <defs>
      <linearGradient id="artie-main-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="\${svgTheme}" />
        <stop offset="100%" stop-color="\s\${svgThemeAccent}" />
      </linearGradient>
    </defs>
    
    <!-- TAIL -->
    <path id="artie-tail" d="M 60 85 C 40 85, 30 70, 20 75 C 10 80, 5 95, 20 100 C 35 105, 55 95, 60 85 Z" fill="\${svgTheme}" />
    <path id="artie-tail-tip" d="M 20 75 C 15 76, 8 82, 10 90 C 12 96, 18 97, 23 93 Z" fill="#ffffff" />
    
    <!-- BACK EAR -->
    <path d="M 33 50 L 15 20 L 45 42 Z" fill="\${svgThemeAccent}" />
    <path d="M 31 46 L 20 25 L 40 40 Z" fill="#fda4af" opacity="0.8" />
    
    <!-- BODY -->
    <ellipse cx="60" cy="80" rx="24" ry="20" fill="\${svgTheme}" />
    <ellipse cx="60" cy="76" rx="14" ry="11" fill="#fffaf0" />
    
    <!-- FRONT EAR -->
    <path d="M 87 50 L 105 20 L 75 42 Z" fill="\${svgTheme}" />
    <path d="M 85 46 L 98 25 L 78 40 Z" fill="#fda4af" opacity="0.8" />
    
    <!-- HEAD -->
    <circle cx="60" cy="52" r="26" fill="\${svgTheme}" />
    <polygon points="50,56 70,56 60,69" fill="#ffffff" />
    <circle cx="60" cy="67" r="3" fill="#27272a" />
    
    <!-- EYES & PUPILS -->
    <g id="eyes-group">
      <circle cx="46" cy="49" r="6" fill="#ffffff" />
      <circle id="pupil-left" cx="46" cy="49" r="3" fill="#18181b" />
      
      <circle cx="74" cy="49" r="6" fill="#ffffff" />
      <circle id="pupil-right" cx="74" cy="49" r="3" fill="#18181b" />
    </g>

    <ellipse cx="37" cy="57" rx="3.5" ry="1.5" fill="#f472b6" opacity="0.4" />
    <ellipse cx="83" cy="57" rx="3.5" ry="1.5" fill="#f472b6" opacity="0.4" />

    <!-- Cute sitting paws -->
    <circle cx="46" cy="98" r="6" fill="#ffffff" stroke="#f1f5f9" stroke-width="0.5" />
    <circle cx="74" cy="98" r="6" fill="#ffffff" stroke="#f1f5f9" stroke-width="0.5" />
  </svg>\`;

  // Dialogue bubble timing controller
  let bubbleTimer;
  const dialogBubble = shadow.getElementById('artie-bubble');

  function showMessage(text, duration = ${extBubbleDuration} * 1000) {
    if (!dialogBubble) return;
    dialogBubble.innerText = text;
    dialogBubble.classList.add('visible');
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      dialogBubble.classList.remove('visible');
    }, duration);
  }

  // Trigger initial greeting bubble
  setTimeout(() => showMessage("${extInitialGreeting}"), 1000);

  // Trigonometry cursor tracking for pupils
  const pLeft = shadow.getElementById('pupil-left');
  const pRight = shadow.getElementById('pupil-right');

  document.addEventListener('mousemove', (e) => {
    const box = container.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Limit offset intensity of eye pupils
    const maxOffset = 3;
    const angle = Math.atan2(dy, dx);
    const intensity = Math.min(distance / 250, 1);
    
    const ox = Math.cos(angle) * maxOffset * intensity;
    const oy = Math.sin(angle) * maxOffset * intensity;

    if (pLeft && pRight) {
      pLeft.setAttribute('cx', (46 + ox).toFixed(1));
      pLeft.setAttribute('cy', (49 + oy).toFixed(1));
      pRight.setAttribute('cx', (74 + ox).toFixed(1));
      pRight.setAttribute('cy', (49 + oy).toFixed(1));
    }
  });

  // Developer motivational quotes list
  const devMotivation = [
    "You are doing amazing! Keep shipping clean code! 💻✨",
    "Stuck? Try using a 2-minute tea break. The bugs can wait!",
    "Commit early, push often! Your future self will thank you. 🦊🚀",
    "Did you remember to keep your back straight? Fox posture check!",
    "Double check those imports. Let's make this app bulletproof!",
    "Code is like poetry, only it is executable syntax! Sweet!",
    "Wow, looking beautiful! Let's conquer this deadline together."
  ];

  // Interactivity click handlers
  container.addEventListener('click', (e) => {
    if (container.classList.contains('artie-backflip') || container.classList.contains('artie-jump')) return;
    
    // Jump animation
    container.classList.add('artie-jump');
    showMessage(devMotivation[Math.floor(Math.random() * devMotivation.length)]);
    
    setTimeout(() => {
      container.classList.remove('artie-jump');
    }, 600);
  });

  container.addEventListener('dblclick', () => {
    container.classList.add('artie-backflip');
    showMessage("WOOHOO! Backflip! Pixel grade acrobatics complete! 🐾🤸‍♂️", 3000);
    setTimeout(() => {
      container.classList.remove('artie-backflip');
    }, 1000);
  });

  // Random automatic action triggers
  setInterval(() => {
    if (Math.random() < 0.2) {
      showMessage("Yip! Watching your browser carefully! 👀🦊", 2500);
    }
  }, 25000);

})();`,

    "popup.html": `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 250px;
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #fafafa;
      margin: 0;
      padding: 16px;
    }
    h3 {
      font-size: 15px;
      margin: 0 0 6px 0;
      color: ${extThemeColor};
      display: flex;
      align-items: center;
      gap: 6px;
    }
    p {
      font-size: 11px;
      color: #94a3b8;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: bold;
      border: 1px solid #334155;
    }
    .mood-grid {
      display: grid;
      grid-template-cols: repeat(4, 1fr);
      gap: 6px;
      margin-top: 12px;
    }
    .mood-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #e2e8f0;
      font-size: 9px;
      font-weight: bold;
      padding: 5px 0;
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
    }
    .mood-btn:hover {
      background: ${extThemeColor};
      color: white;
    }
    .footer {
      border-top: 1px solid #334155;
      margin-top: 14px;
      padding-top: 8px;
      font-size: 8px;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <h3>🦊 Artie Companion</h3>
  <p>Your interactive browser AI virtual companion is fully active. Let's write beautiful websites!</p>
  
  <div class="badge-bar">
    <span>Level 1 companion</span>
    <span style="color: ${extThemeColor}">+15% Focus Buff</span>
  </div>

  <div class="mood-grid">
    <button class="mood-btn" id="m-idle">Cozy</button>
    <button class="mood-btn" id="m-focus">Focus</button>
    <button class="mood-btn" id="m-draw">Art</button>
    <button class="mood-btn" id="m-pulse">Synth</button>
  </div>

  <div class="footer">
    Artie AI virtual extension v1.0.0
  </div>

  <script src="popup.js"></script>
</body>
</html>`,

    "popup.js": `/**
 * Artie Companion Menu trigger interface
 */
document.addEventListener('DOMContentLoaded', () => {
  const triggerMood = (moodName) => {
    // Save to storage
    chrome.storage.local.set({ artieMood: moodName }, () => {
      console.log('Artie mood set to', moodName);
    });
  };

  document.getElementById('m-idle')?.addEventListener('click', () => triggerMood('idle'));
  document.getElementById('m-focus')?.addEventListener('click', () => triggerMood('focus'));
  document.getElementById('m-draw')?.addEventListener('click', () => triggerMood('drawing'));
  document.getElementById('m-pulse')?.addEventListener('click', () => triggerMood('pulse'));
});`
  };

  // Compile Chrome Extension unpacked folder into zip
  const triggerExtensionZipDownload = async () => {
    addNotification("Drawing Canvas Artie Icon...", "info");
    
    const zip = new JSZip();
    
    // Add text files
    zip.file("manifest.json", compiledFiles["manifest.json"]);
    zip.file("style.css", compiledFiles["style.css"]);
    zip.file("content.js", compiledFiles["content.js"]);
    zip.file("popup.html", compiledFiles["popup.html"]);
    zip.file("popup.js", compiledFiles["popup.js"]);

    // Generate stunning matching SVG Canvas PNG launcher icon
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Circle background
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(64, 64, 62, 0, Math.PI * 2);
      ctx.fill();

      // Border glow
      ctx.strokeStyle = extThemeColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Simplified minimalist geometric fox
      ctx.fillStyle = extThemeColor;
      ctx.beginPath();
      ctx.moveTo(64, 98);
      ctx.lineTo(26, 45);
      ctx.lineTo(102, 45);
      ctx.closePath();
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.moveTo(35, 45);
      ctx.lineTo(20, 15);
      ctx.lineTo(55, 38);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(93, 45);
      ctx.lineTo(108, 15);
      ctx.lineTo(73, 38);
      ctx.closePath();
      ctx.fill();

      // White snout shape
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(52, 65);
      ctx.lineTo(76, 65);
      ctx.lineTo(64, 85);
      ctx.closePath();
      ctx.fill();

      // Nose
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(64, 82, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(44, 55, 5, 0, Math.PI * 2);
      ctx.arc(84, 55, 5, 0, Math.PI * 2);
      ctx.fill();

      // Wink shimmer
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(42, 53, 1.5, 0, Math.PI * 2);
      ctx.arc(82, 53, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const base64Data = canvas.toDataURL("image/png").split(',')[1];
    zip.file("icon.png", base64Data, { base64: true });

    // Download zip package
    try {
      addNotification("Assembling extension archive...", "info");
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `artie-extension-unpacked.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addNotification("Extension zip compiled successfully! check downloads folder.", "success");
    } catch (err) {
      addNotification("Failed to compress zip folder. Try copying codes manually", "error");
    }
  };

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates((prev) => ({ ...prev, [filename]: true }));
    addNotification(`${filename} copied to clipboard!`, "success");
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [filename]: false }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* HEADER BAR SYSTEM */}
      <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400">
            🦊
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-slate-100 uppercase">Artie Workspace Center</h1>
            <p className="text-[10px] text-slate-450 uppercase font-mono font-bold tracking-wider">Virtual Pet Compiler v1.2</p>
          </div>
        </div>

        {/* Global Level System stats */}
        <div className="hidden sm:flex items-center gap-4 bg-slate-950/80 border border-slate-800/70 py-1.5 px-3 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-mono font-black py-0.5 px-1.5 rounded">
              LVL {stats.level}
            </span>
            <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-400">
              {stats.xp}/{stats.xpToNextLevel} XP
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Clock Widget */}
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>{clockTime}</span>
          </div>
        </div>
      </header>

      {/* CORE GRID CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT COLUMN: INTERACTIVE VISUALIZER CANNES - spans 5 grid cols */}
        <div className="lg:col-span-5 flex flex-col gap-5 min-h-0">
          
          {/* SIMULATED GOOGLE CHROME EXTENSION CONNECTOR */}
          <div className="bg-slate-900 border border-slate-800/85 rounded-2xl p-4 flex flex-col gap-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-sm font-extrabold shadow-inner">
                  🦊
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                    {extName} 
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">LOCAL EXT</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px] font-medium">{extDesc}</p>
                </div>
              </div>

              {/* Action pulse dot status indicator */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2 py-1 rounded-lg">
                <span className={`w-1.5 h-1.5 rounded-full ${isExtensionActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                <span className={`text-[9px] font-mono font-black uppercase ${isExtensionActive ? "text-emerald-400" : "text-rose-400"}`}>
                  {isExtensionActive ? "Active" : "Removed"}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-800/60" />

            {/* Quick controller details */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                {isExtensionActive ? (
                  <>
                    <span className="text-emerald-500">✔</span> Content script loaded on page
                  </>
                ) : (
                  <>
                    <span className="text-rose-500">○</span> Sandboxed - companion offline
                  </>
                )}
              </p>

              {isExtensionActive ? (
                <button
                  onClick={() => {
                    setIsExtensionActive(false);
                    setPetState("idle");
                    addNotification("Artie uninstalled from page sandbox.", "error");
                  }}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-mono text-[9px] font-black rounded-xl transition-all cursor-pointer uppercase tracking-tight"
                  title="Remove Artie virtual pet component from page background"
                >
                  Unload Pet
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsInstalling(true);
                    setTimeout(() => {
                      setIsInstalling(false);
                      setIsExtensionActive(true);
                      addNotification("Content script mounted! Artie is active! 🦊✨", "success");
                    }, 1200);
                  }}
                  disabled={isInstalling}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-450 text-white font-mono text-[9px] font-black rounded-xl transition-all cursor-pointer uppercase tracking-tight shadow-md flex items-center gap-1 disabled:opacity-50"
                  title="Inject compiled virtual pet extension script into browser page"
                >
                  {isInstalling ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-white" />
                      Loading Unpacked...
                    </span>
                  ) : (
                    "Load Unpacked Ext"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* THE ARTIE PREVIEW VIEWPORT AREA */}
          <div className={`flex-1 min-h-[320px] rounded-3xl border border-slate-800/80 overflow-hidden relative flex flex-col justify-between p-5 transition-all duration-300 shadow-2xl bg-gradient-to-b ${
            ambientTheme === "cyberpunk"
              ? "from-purple-950/20 via-slate-950 to-slate-950"
              : ambientTheme === "forest"
                ? "from-emerald-950/20 via-slate-950 to-slate-950"
                : ambientTheme === "midnight"
                  ? "from-indigo-950/20 via-slate-950 to-slate-950"
                  : "from-orange-950/15 via-slate-950 to-slate-950"
          }`}>
            
            {/* Viewport Overlay Info metadata */}
            <div className="flex justify-between items-start relative z-10 gap-2">
              <div className="bg-slate-900/90 backdrop-blur border border-slate-800/80 rounded-xl px-2.5 py-1 text-[10px] font-mono text-slate-300 shadow-md">
                <span>Viewport: </span>
                <strong className={`capitalize ${
                  ambientTheme === "cyberpunk" ? "text-fuchsia-400" :
                  ambientTheme === "forest" ? "text-emerald-400" :
                  ambientTheme === "midnight" ? "text-indigo-400" : "text-orange-400"
                }`}>{ambientTheme} studio</strong>
              </div>

              {/* Theme selectors */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 p-1 rounded-xl shadow-md">
                <button 
                  onClick={() => setAmbientTheme("sunset")} 
                  className={`w-3.5 h-3.5 rounded-full bg-orange-500 cursor-pointer border ${ambientTheme === "sunset" ? "border-white border-2" : "border-transparent"}`} 
                  title="Sunset amber desk"
                />
                <button 
                  onClick={() => setAmbientTheme("cyberpunk")} 
                  className={`w-3.5 h-3.5 rounded-full bg-indigo-500 cursor-pointer border ${ambientTheme === "cyberpunk" ? "border-white border-2" : "border-transparent"}`} 
                  title="Neon cyberpunk studio"
                />
                <button 
                  onClick={() => setAmbientTheme("forest")} 
                  className={`w-3.5 h-3.5 rounded-full bg-emerald-500 cursor-pointer border ${ambientTheme === "forest" ? "border-white border-2" : "border-transparent"}`} 
                  title="Zen Emerald forest"
                />
                <button 
                  onClick={() => setAmbientTheme("midnight")} 
                  className={`w-3.5 h-3.5 rounded-full bg-slate-700 cursor-pointer border ${ambientTheme === "midnight" ? "border-white border-2" : "border-transparent"}`} 
                  title="Midnight coder darkroom"
                />
              </div>
            </div>

            {/* ARTIE DRAWS CONTAINER CENTER */}
            <div className="flex-1 flex items-center justify-center relative my-4 min-h-0">
              {isExtensionActive ? (
                <FoxCharacter
                  petState={petState}
                  setPetState={setPetState}
                  activeApp={activeApp}
                  appMood={appMood}
                  stats={stats}
                  onReceiveXp={receiveXp}
                  onDoodleTriggered={() => {}}
                  addNotification={(txt) => addNotification(txt, "success")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 w-full max-w-[280px]">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 animate-pulse text-xl">
                    💤
                  </div>
                  <h4 className="text-xs font-mono font-black text-slate-300 uppercase tracking-wide">Companion Detached</h4>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                    Artie has been detached from this webpage DOM. Click <strong className="text-slate-400">"Load Unpacked Ext"</strong> above to mount the pet on screen!
                  </p>
                  <button
                    onClick={() => {
                      setIsInstalling(true);
                      setTimeout(() => {
                        setIsInstalling(false);
                        setIsExtensionActive(true);
                        addNotification("Extension injected successfully! Fox active.", "success");
                      }, 1000);
                    }}
                    disabled={isInstalling}
                    className="mt-4 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-mono text-[9px] font-black tracking-wide rounded-xl uppercase pointer-events-auto shadow-md"
                  >
                    {isInstalling ? "Linking content.js..." : "Re-inject Extension"}
                  </button>
                </div>
              )}
            </div>

            {/* Micro Interactivity Toolbar buttons */}
            <div className={`bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-2xl p-2 flex flex-col gap-2 relative z-10 shadow-lg ${!isExtensionActive ? "opacity-30 pointer-events-none cursor-not-allowed" : ""}`}>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 px-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Feed & Nurture actions</span>
                <span className="text-[9px] font-mono text-orange-400 font-bold">🎯 Gain direct XP</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => feedPet("coffee")}
                  className="py-1.5 px-2 bg-slate-805 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/20 text-slate-300 font-medium text-[10px] rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all"
                  title="Feed hot espresso fuel (gains speedy focus state)"
                >
                  <Coffee className="w-4 h-4 text-orange-400" />
                  <span>Coffee</span>
                </button>
                <button
                  onClick={() => feedPet("cookie")}
                  className="py-1.5 px-2 bg-slate-805 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/20 text-slate-300 font-medium text-[10px] rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all"
                  title="Feed high-energy choc-chip cookie"
                >
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Cookie</span>
                </button>
                <button
                  onClick={triggerAcrobatics}
                  className="py-1.5 px-2 bg-slate-805 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/20 text-slate-300 font-medium text-[10px] rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all"
                  title="Train backflip speed loops"
                >
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Acrobatics</span>
                </button>
                <button
                  onClick={triggerSleep}
                  className={`py-1.5 px-2 border font-medium text-[10px] rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    petState === "sleep"
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                      : "bg-slate-805 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/20 text-slate-300"
                  }`}
                  title="Tuck Artie in to sleep/dreams"
                >
                  <Heart className={`w-4 h-4 ${petState === "sleep" ? "text-cyan-400 animate-pulse" : "text-cyan-500"}`} />
                  <span>{petState === "sleep" ? "Wake UP" : "Dream state"}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick Pet status metadata readout stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">Artie Status Readout</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/80 border border-slate-850 p-2.5 rounded-xl flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Attention stats</span>
                <span className="text-xs font-mono font-bold text-slate-200 capitalize mt-0.5">{petState}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-2.5 rounded-xl flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Glow shader</span>
                <span className="text-xs font-mono font-bold text-slate-200 capitalize mt-0.5">{appMood}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-2.5 rounded-xl flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Level Buff</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">+{stats.level * 15} XP/hr</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TABS CONFIGURATIONS PANEL - spans 7 grid cols */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-850/80 rounded-3xl overflow-hidden shadow-2xl min-h-0">
          
          {/* Tabs header list selector */}
          <div className="flex border-b border-slate-800 bg-slate-905 p-3.5 gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setActiveTab("companion")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all ${
                activeTab === "companion"
                  ? "bg-slate-800 text-orange-400 shadow border-b border-orange-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all ${
                activeTab === "chat"
                  ? "bg-slate-800 text-orange-400 shadow border-b border-orange-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Artie AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("compiler")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all ${
                activeTab === "compiler"
                  ? "bg-slate-800 text-orange-400 shadow border-b border-orange-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Compiler Hub</span>
            </button>
            <button
              onClick={() => setActiveTab("install")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all ${
                activeTab === "install"
                  ? "bg-slate-800 text-orange-400 shadow border-b border-orange-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Installation</span>
              <span className="inline sm:hidden">Load Guide</span>
            </button>
          </div>

          {/* ACTIVE TAB CONTENTS VIEW */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto min-h-0">
            <AnimatePresence mode="wait">
              
              {/* T1: COMPANION CONTROL ROOM */}
              {activeTab === "companion" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-6 flex flex-col h-full"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
                      Control Room Simulator
                    </h2>
                    <p className="text-xs text-slate-400">
                      Configure Artie's animation states and ambient modes to inspect how he reacts before compiling your extension assets.
                    </p>
                  </div>

                  {/* Character preset action blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fur Shader select card */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/65 flex flex-col gap-3">
                      <div>
                        <h4 className="text-xs font-mono font-black text-slate-300 uppercase tracking-wide">Sync Application Aura</h4>
                        <p className="text-[11px] text-slate-550 mt-0.5">Toggle workspaces to test Artie's reactive visual shaders.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleMoodSync("cozy", "Desktop Home")}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            appMood === "cozy" ? "bg-orange-500/10 border-orange-500/40 text-orange-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Laptop Idle (Amber)
                        </button>
                        <button 
                          onClick={() => handleMoodSync("blue", "VS Code Studio")}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            appMood === "blue" ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Code editor (Blue)
                        </button>
                        <button 
                          onClick={() => handleMoodSync("neon", "Figma design canvas")}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            appMood === "neon" ? "bg-pink-500/10 border-pink-500/40 text-pink-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Figma Vectors (Neon)
                        </button>
                        <button 
                          onClick={() => handleMoodSync("green", "Web explorer search")}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            appMood === "green" ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Chrome Browsing (Jade)
                        </button>
                      </div>
                    </div>

                    {/* Behavior focus controller */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/65 flex flex-col gap-3">
                      <div>
                        <h4 className="text-xs font-mono font-black text-slate-300 uppercase tracking-wide">Test Character States</h4>
                        <p className="text-[11px] text-slate-550 mt-0.5">Force specific posture poses and animations.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setPetState("idle"); addNotification("Activated standard standing state", "info"); }}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            petState === "idle" ? "bg-slate-800 border-orange-500/30 text-orange-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Idle
                        </button>
                        <button
                          onClick={() => { setPetState("focus"); addNotification("Glasses equipped! Code focus active.", "info"); }}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            petState === "focus" ? "bg-slate-800 border-orange-500/30 text-orange-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Glasses (Focus)
                        </button>
                        <button
                          onClick={() => { setPetState("curious"); addNotification("Artie is tilting head in curiosity", "info"); }}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            petState === "curious" ? "bg-slate-800 border-orange-500/30 text-orange-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Curious head
                        </button>
                        <button
                          onClick={() => { setPetState("drawing"); addNotification("Sketchbook mode unlocked!", "info"); }}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            petState === "drawing" ? "bg-slate-800 border-orange-500/30 text-orange-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Brush (Drawing)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lofi Beats workspace integration */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/65 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="text-xs font-mono font-black text-slate-300 uppercase tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                        <Music className="w-4 h-4 text-purple-400 animate-bounce" />
                        Tape Deck Audio Lofi vibes
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Synthesize some offline relaxing study background layers with real time focus widgets.
                      </p>
                    </div>
                    <button
                      onClick={triggerLofiListen}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-black rounded-xl cursor-pointer shadow-lg transition-all"
                    >
                      Initialize Lofi Synth
                    </button>
                  </div>

                  {/* Chrome Export Callout action card */}
                  <div className="flex-1 bg-slate-950/40 border border-slate-850 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <Download className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">Fulfill the goal: Create the Chrome Extension</h3>
                      <p className="text-xs text-slate-400 max-w-[420px] mx-auto leading-relaxed">
                        Export Artie directly into standard browser files! Customize his settings and click "Compile unpacked Zip" inside the compiler interface.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("compiler")}
                      className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 font-mono text-[10px] font-black rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Jump to Compiler Panel
                    </button>
                  </div>

                </motion.div>
              )}

              {/* T2: AI TERMINAL DIALOG SYSTEM */}
              {activeTab === "chat" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col h-[500px]"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                    <div className="space-y-0.5">
                      <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        AI Dialogue Desk
                      </h2>
                      <p className="text-[11px] text-slate-450">
                        Chat directly with the interactive server-side Gemini core that lives inside Artie's matrix neural loop.
                      </p>
                    </div>
                    <button 
                      onClick={() => setChatHistory([
                        {
                          id: "clear-1",
                          role: "assistant",
                          content: "Yip! Screen cleared and matrix flushed! What shall we discuss next, designer?",
                          timestamp: new Date().toLocaleTimeString()
                        }
                      ])}
                      className="p-1 px-2.5 bg-slate-950 border border-slate-850 hover:border-orange-500/20 text-slate-400 hover:text-white rounded-lg text-[9px] font-mono cursor-pointer transition-all uppercase font-bold tracking-tight"
                      title="Flush Dialogue logs"
                    >
                      Clear Memory
                    </button>
                  </div>

                  {/* Bubble logs history */}
                  <div className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl p-4 overflow-y-auto space-y-3.5 mb-4 max-h-[340px]">
                    {chatHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 select-none">
                          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">{msg.role === "user" ? "Designer Account" : "Artie Fox AI"}</span>
                          <span className="text-[8px] text-slate-650 font-mono italic">{msg.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed font-sans shadow-md ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-tr-none"
                            : "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="mr-auto items-start max-w-[80%]">
                        <div className="flex items-center gap-1 mb-1 font-mono text-[9px] text-slate-500">
                          <span>Artie is pondering...</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form submit panel */}
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask Artie to write a design joke, describe his fur aura, or study coding together..."
                      className="flex-1 bg-slate-950 border border-slate-850 px-4 py-3 rounded-2xl text-xs text-slate-200 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-slate-600"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isSending || !userInput.trim()}
                      className="px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-mono text-xs font-black rounded-2xl cursor-pointer transition-all shadow-md uppercase tracking-wider flex items-center justify-center"
                    >
                      Transmit
                    </button>
                  </div>

                </motion.div>
              )}

              {/* T3: CHROME EXTENSION COMPILER PANEL */}
              {activeTab === "compiler" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-6 flex flex-col h-full"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
                      Chrome Extension Customizer & Exporter
                    </h2>
                    <p className="text-xs text-slate-400">
                      Build your own personalized Google Chrome Extension. Tweek options dynamically, see compiled codes instantly, and download unpacked folder zip bundles with 1-click on the client!
                    </p>
                  </div>

                  {/* Form variables options card */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">Extension Name</label>
                        <input 
                          type="text" 
                          value={extName} 
                          onChange={(e) => setExtName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 mt-1 select-text outline-none focus:border-orange-500/45 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">Extension Description</label>
                        <textarea 
                          value={extDesc} 
                          onChange={(e) => setExtDesc(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 mt-1 select-text outline-none focus:border-orange-500/45 transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">Accent Theme</label>
                          <select 
                            value={extThemeColor} 
                            onChange={(e) => { 
                              setExtThemeColor(e.target.value);
                              // Auto sync visual appMood preview as well
                              if (e.target.value === "#f97316") setAppMood("cozy");
                              else if (e.target.value === "#ec4899") setAppMood("neon");
                              else if (e.target.value === "#0ea5e9") setAppMood("blue");
                              else setAppMood("green");
                            }}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 mt-1 cursor-pointer outline-none focus:border-orange-500/45 transition-all"
                          >
                            <option value="#f97316">Orange (Cozy)</option>
                            <option value="#ec4899">Pink (Neon vector)</option>
                            <option value="#0ea5e9">Blue (VS Code)</option>
                            <option value="#10b981">Green (Browsing)</option>
                            <option value="#eab308">Gold (Inspiration)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">Default Side</label>
                          <select 
                            value={extPosition} 
                            onChange={(e) => setExtPosition(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 mt-1 cursor-pointer outline-none focus:border-orange-500/45 transition-all"
                          >
                            <option value="bottom-right">Bottom-Right Corner</option>
                            <option value="bottom-left">Bottom-Left Corner</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">Speech Timer</label>
                          <input 
                            type="number" 
                            min={1} 
                            max={60} 
                            value={extBubbleDuration} 
                            onChange={(e) => setExtBubbleDuration(parseInt(e.target.value) || 5)}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 mt-1 select-text outline-none focus:border-orange-500/45 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">Spawn greeting</label>
                          <input 
                            type="text" 
                            value={extInitialGreeting} 
                            onChange={(e) => setExtInitialGreeting(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 mt-1 select-text outline-none focus:border-orange-500/45 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Download trigger action card */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono font-black text-slate-350 uppercase tracking-wide flex items-center gap-1.5 justify-center sm:justify-start">
                        <Compass className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '10s' }} />
                        Download Unpacked Extension Pack
                      </h4>
                      <p className="text-[11px] text-slate-500 text-center sm:text-left">
                        Generates manifests, active mouse pupils logic, styling configurations, popup dashboard, and custom color icon instantly in a ZIP.
                      </p>
                    </div>
                    <button
                      onClick={triggerExtensionZipDownload}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-indigo-600 hover:from-orange-400 hover:to-indigo-500 text-white font-mono text-xs font-black rounded-xl cursor-pointer shadow-lg transition-all flex items-center gap-2 uppercase tracking-wide"
                    >
                      <Download className="w-4 h-4" />
                      <span>Compile & Save Extensions</span>
                    </button>
                  </div>

                  {/* CODE SOURCE VIEWERS FILE SELECTIONS CARDS */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col">
                    
                    {/* Small tabs */}
                    <div className="flex bg-slate-905 border-b border-slate-850 px-2.5 py-2 gap-1 overflow-x-auto">
                      {Object.keys(compiledFiles).map((file) => (
                        <button
                          key={file}
                          onClick={() => setViewedFile(file)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                            viewedFile === file 
                              ? "bg-slate-900 border border-slate-800 text-orange-400" 
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {file}
                        </button>
                      ))}
                    </div>

                    {/* Viewer text box */}
                    <div className="p-4 relative">
                      <button
                        onClick={() => handleCopyCode(viewedFile, compiledFiles[viewedFile as keyof typeof compiledFiles])}
                        className="absolute right-6 top-6 p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-orange-500/20 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Copy file code to clipboard"
                      >
                        {copiedStates[viewedFile] ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <pre className="text-[10px] font-mono text-slate-400 select-text overflow-x-auto font-medium leading-relaxed bg-[#0a0f1d] p-4 rounded-xl border border-indigo-950/40 max-h-[220px]">
                        <code>
                          {compiledFiles[viewedFile as keyof typeof compiledFiles]}
                        </code>
                      </pre>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* T4: INSTALL GUIDE MANUAL */}
              {activeTab === "install" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-6 flex flex-col h-full"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-indigo-400" />
                      Local Import Setup Guide (60 seconds)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Follow these straight forward visual steps to quickly activate Artie inside your standard Google Chrome browser:
                    </p>
                  </div>

                  <div className="space-y-4">
                    
                    {/* step 1 */}
                    <div className="flex bg-slate-950 p-4 rounded-2xl border border-slate-850 gap-4">
                      <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-mono text-xs font-black text-orange-400 shrink-0">
                        1
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">Export and Extract the Archive</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Navigate to the <span className="text-orange-400 font-mono font-bold">Compiler Hub</span> tab in this application and click <strong className="text-slate-300">"Compile & Save Extensions"</strong>. This saves <code className="text-orange-400 font-mono text-[10px]">artie-extension-unpacked.zip</code> to your downloads. Extract the zip file to create an unpacked directory.
                        </p>
                      </div>
                    </div>

                    {/* step 2 */}
                    <div className="flex bg-slate-950 p-4 rounded-2xl border border-slate-850 gap-4">
                      <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-mono text-xs font-black text-orange-400 shrink-0">
                        2
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">Open Extension Manager in Chrome</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Open a new empty window or tab in Google Chrome, paste <span className="text-orange-400 font-mono font-semibold">chrome://extensions</span> into the navigation address bar, and hit Enter key to launch Chrome Extension Settings.
                        </p>
                      </div>
                    </div>

                    {/* step 3 */}
                    <div className="flex bg-slate-950 p-4 rounded-2xl border border-slate-850 gap-4">
                      <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-mono text-xs font-black text-orange-400 shrink-0">
                        3
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">Toggle "Developer Mode" On</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Locate the tiny toggle switch labeled <strong className="text-slate-200">"Developer mode"</strong> in the top-right corner of the Extensions panel, and toggle it <span className="text-emerald-400 font-medium">ON</span>. This unlocks localized manual loads!
                        </p>
                      </div>
                    </div>

                    {/* step 4 */}
                    <div className="flex bg-slate-950 p-4 rounded-2xl border border-slate-850 gap-4">
                      <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-mono text-xs font-black text-orange-400 shrink-0">
                        4
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">Click & Load "Unpacked Folder"</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Click the <strong className="text-slate-100 font-mono">"Load unpacked"</strong> button that appeared in the top-left corner, find and select the extracted folder directory on your desktop or disk!
                        </p>
                      </div>
                    </div>

                    {/* Verification wrapup */}
                    <div className="bg-indigo-600/15 border border-indigo-500/35 p-4 rounded-2xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 animate-bounce" />
                      <p className="text-[11px] text-indigo-300 font-sans leading-relaxed">
                        <strong>Success!</strong> Chrome will instantly infect any webpage you browse (StackOverflow, GitHub, Reddit) with active Artie, responsive eye coordinates, blinking, backflips, and lofi developer humor!
                      </p>
                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* FOOTER METRIC LABELS */}
      <footer className="bg-slate-950 border-t border-slate-805/85 px-6 py-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-mono leading-none">
          <span>Virtual Companion Engine running server-side live</span>
        </div>
        <div className="flex items-center gap-4 text-slate-550 text-[10px] font-mono select-none">
          <span>Active Client Session: <strong className="text-orange-500">READY</strong></span>
        </div>
      </footer>

      {/* FLOAT NOTIFICATIONS LOOPER */}
      <div className="fixed bottom-16 right-5 flex flex-col gap-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`px-3 py-2 text-[10px] font-mono font-black uppercase rounded-xl border shadow-xl flex items-center gap-2 pointer-events-auto ${
                notif.type === "success" 
                  ? "bg-slate-900 border-emerald-500/30 text-emerald-400" 
                  : notif.type === "error" 
                    ? "bg-slate-900 border-rose-500/30 text-rose-400"
                    : "bg-slate-900 border-indigo-500/30 text-indigo-400"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${notif.type === "success" ? "bg-emerald-400" : notif.type === "error" ? "bg-rose-400" : "bg-indigo-400"}`} />
              <span>{notif.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
