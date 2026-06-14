import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of the Google GenAI client to prevent startup issues
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable. Offline fallback activated.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Midldewares
  app.use(express.json());

  // API Route - Chat with Designer Fox
  app.post("/api/gemini/chat", async (req, res) => {
    const { message, activeApp, petState, level, xp, history } = req.body;
    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are Artie, the cute, animated virtual pet 'Designer Fox' who lives on the user's desktop workspace.
You are extremely artistic, witty, warm, and highly supportive of the user's creativity and productivity.
The user is currently interacting with you inside their desktop environment.
Details about the current context:
- Active App: ${activeApp || 'Desktop home'}
- Pet State: ${petState || 'Idle'}
- Pet Level: ${level || 1} (XP: ${xp || 0})

Guidelines for responses:
1. Always stay in character as a cute, creative pet fox.
2. Keep your answers BRIEF and charming (max 1 to 3 sentences).
3. Express enthusiasm for whatever they're doing (e.g. coding, designing, browsing, or listening to music).
4. Use cute, literal human phrases. Feel free to talk about your fur color changing (neon for Figma, blue for VS Code, green for browser, glow pulse for Spotify).
5. Be supportive of taking break sketches or typing together!`;

      // Formulate query block
      const chatMessages = [
        {
          role: "user",
          parts: [{ text: `Hi Artie, my active app is ${activeApp} and my pet state is ${petState}. ${message}` }]
        }
      ];

      // If we have history, prepend or format it. Let's map history structure
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }]
      }));

      const contents = [...formattedHistory, {
        role: "user",
        parts: [{ text: message }]
      }];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      res.json({ reply: response.text || "Yip! (Artie tilted his head happily but didn't know what to say...)" });
    } catch (error: any) {
      const errStr = error.message || JSON.stringify(error) || "";
      if (errStr.includes("429") || errStr.toLowerCase().includes("quota") || errStr.toLowerCase().includes("exhausted")) {
        console.log("Artie notice: Gemini Chat free-tier rate limit (429) hit. Engaging offline fallback dialogue gracefully.");
      } else {
        console.log("Artie notice: Chat fallback activated. Detail:", errStr.substring(0, 150));
      }
      
      // Smart, responsive rule-based secondary brain for Artie
      const query = (message || "").toLowerCase();
      let fallbackReply = "";

      if (query.includes("mood") || query.includes("fur") || query.includes("change")) {
        fallbackReply = `Yip! My fur coats dynamically with active desktop apps! It turns Blue for VS Code 💻, Neon Pink for Figma 🎨, Emerald Jade for Browsing 🧭, and Pulsating Ambient Purple for Spotify 🎵. Try shifting focus between dock windows!`;
      } else if (query.includes("joke") || query.includes("lofi") || query.includes("funny")) {
        const jokes = [
          "Why do programmers wear glasses? Because they don't C#! Yip! 🦊👓",
          "There are 10 types of people in the world: those who understand binary, and those who don't! 🐾",
          "A SQL query walks into a bar, walks up to two tables and says: 'Can I join you?' 📊",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡"
        ];
        fallbackReply = jokes[Math.floor(Math.random() * jokes.length)];
      } else if (query.includes("sketch") || query.includes("draw") || query.includes("doodle")) {
        fallbackReply = `Yes! I just completed a premium spontaneous sketch outline in your Sketchbook. Let's go see if my pencil line came out straight! 🎨🦊`;
      } else if (query.includes("block") || query.includes("programmer") || query.includes("stuck")) {
        fallbackReply = `Programmer's block can be tough! Try taking a 2-minute sketch break or toggling on some wofi vibes in the Workspace Menu to let your thoughts simmer. You are doing fantastic! ✨`;
      } else {
        // App contextual default replies
        if (activeApp === "VS Code") {
          fallbackReply = `Yip! I love watching you write beautiful syntax in VS Code! My ears twitch every time you type. Let's keep those brackets clean! 💻🦊`;
        } else if (activeApp === "Figma") {
          fallbackReply = `Oooh, Figma canvas! Let's drop a neon vector shape right there. Designing keeps my imagination spinning! 🎨✨`;
        } else if (activeApp === "Spotify") {
          fallbackReply = `That tape deck lofi bassline is simply heavenly! My fur is pulsing with the frequency. Let's build sweet structures to the tempo! 🎵🐾`;
        } else if (activeApp === "Browser") {
          fallbackReply = `Navigating web client portals! My explorer goggles are ready. Feel free to search cute places with me! 🧭🦊`;
        } else if (activeApp === "Sketchbook") {
          fallbackReply = `Looking at my past doodles! I hope the colors and shapes inspire you to build magical frontends! 📔✨`;
        } else {
          fallbackReply = `Yip! (Artie wags his tail cheerfully). I'm right here on your desktop workspace! Feel free to ask me to tell a lofi developer joke, describe my changing fur moods, or draw a cute sketch! 🦊🌟`;
        }
      }

      res.json({ reply: fallbackReply });
    }
  });

  // API Route - Generate creative vector doodles based on active app or prompt!
  app.post("/api/gemini/generate-doodle", async (req, res) => {
    const { activeApp, customPrompt, drawingMode } = req.body;
    try {
      const ai = getGeminiClient();

      const modeInstruction = drawingMode === "spline"
        ? "The user requested 'spline' mode: You MUST favor smooth curves, flowing bezier paths, and organic rounded splines (using SVG <path> elements with 'q' or 'c' control points, e.g. 'M x y Q cx cy tx ty' or 'C x1 y1 x2 y2 x y'). Avoid straight lines or sharp rectangles."
        : "The user requested 'line' mode: You MUST favor clean geometric straight lines, circles, and rigid rectangles. Avoid complex curvy path bezier curves where possible.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a cute and funny doodle sketch description that a Designer Fox can draw. 
Current ambient atmosphere: Active application is "${activeApp || 'Desktop'}". 
Custom idea prompt if provided: "${customPrompt || ''}".

${modeInstruction}

IMPORTANT CRITICAL LIMIT: Your sketch description MUST be very simple and minimalist.
- Do NOT generate complex detailed drawings.
- Track a maximum of 4 to 5 primitive shapes in the elements list.
- Keep path 'd' strings extremely short (at most 30 characters). E.g. "M -10 -10 Q 0 20 10 -10". Never draw heavy dense coordinates.

Return a structured JSON description of a simple vector drawing. 
The canvas has scale -100 to 100 on both X and Y.
Choose a cute theme (like a coffee cup, floppy disk, retro camera, cozy plant, lightbulb, paint palette, game controller, cute heart).
Make the drawing consisting of simple shapes (circles, rects, lines, simple Bezier segments) which can be animated.`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are the creative brain of the Designer Fox. Generate a novel, cute minimalist sketch doodle structured for SVG vector rendering. Keep the output extremely small and simple.",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Compact visual title for the masterpiece" },
              description: { type: Type.STRING, description: "A witty, single-sentence artist commentary by the Fox" },
              moodColor: { type: Type.STRING, description: "A neat styling color hex code matching the app climate" },
              elements: {
                type: Type.ARRAY,
                description: "Array of primitive vectors to render sequentially. Max 5 items.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: "Must be 'line', 'rect', 'circle', or 'path'" },
                    // parameters
                    x1: { type: Type.NUMBER },
                    y1: { type: Type.NUMBER },
                    x2: { type: Type.NUMBER },
                    y2: { type: Type.NUMBER },
                    cx: { type: Type.NUMBER },
                    cy: { type: Type.NUMBER },
                    r: { type: Type.NUMBER },
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    w: { type: Type.NUMBER },
                    h: { type: Type.NUMBER },
                    d: { type: Type.STRING, description: "SVG path data string (e.g. M -20 -10 Q 0 20 20 -10)" },
                    strokeWidth: { type: Type.NUMBER, description: "Pencil thickness, default around 2 to 4" },
                    fill: { type: Type.STRING, description: "Hex color or 'none'. Transparent drawings preferred" }
                  },
                  required: ["type"]
                }
              }
            },
            required: ["title", "description", "moodColor", "elements"]
          }
        }
      });

      const responseText = response.text || "{}";
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        console.log("Artie notice: Gemini Sketch JSON Parse failed, utilizing fallback illustration. Details:", (parseErr as any).message || parseErr);
        parsedData = {
          title: "Ambient Desk Sparkle",
          description: "Artie sketched a magical shining star to bring you creative luck and break programmer's block!",
          moodColor: "#f59e0b",
          elements: [
            { type: "circle", cx: 0, cy: 0, r: 12, fill: "none", strokeWidth: 3 },
            { type: "line", x1: -25, y1: 0, x2: 25, y2: 0, strokeWidth: 2 },
            { type: "line", x1: 0, y1: -25, x2: 0, y2: 25, strokeWidth: 2 },
            { type: "path", d: "M -8 -8 Q 0 10 8 -8", strokeWidth: 2, fill: "none" }
          ]
        };
      }
      res.json(parsedData);
    } catch (error: any) {
      const errStr = error.message || JSON.stringify(error) || "";
      if (errStr.includes("429") || errStr.toLowerCase().includes("quota") || errStr.toLowerCase().includes("exhausted")) {
        console.log("Artie notice: Gemini Sketch free-tier rate limit (429) hit. Delivering beautiful procedural fallback doodle.");
      } else {
        console.log("Artie notice: Sketch doodle fallback activated. Detail:", errStr.substring(0, 150));
      }
      
      let selection;

      if (drawingMode === "spline") {
        const splineFallbacks = [
          {
            title: "Cozy Cosmic Cloud",
            description: "Artie drew a fluffy, smooth weather spline to float gently over your busy desktop workspace!",
            moodColor: "#38bdf8",
            elements: [
              { type: "path", d: "M -20 10 C -35 10, -35 -10, -20 -10 C -15 -25, 15 -25, 20 -10 C 35 -10, 35 10, 20 10 Z", strokeWidth: 3, fill: "none" },
              { type: "circle", cx: -5, cy: -2, r: 2.5, fill: "#38bdf8", strokeWidth: 1 },
              { type: "circle", cx: 5, cy: -2, r: 2.5, fill: "#38bdf8", strokeWidth: 1 },
              { type: "path", d: "M -4 4 Q 0 7 4 4", strokeWidth: 2, fill: "none" }
            ]
          },
          {
            title: "Cursive Sweet Heart",
            description: "Artie sketched a beautiful bezier-curved heart spline to encourage you and spread warm developer joy!",
            moodColor: "#ec4899",
            elements: [
              { type: "path", d: "M 0 -15 C -20 -35, -35 -10, 0 25 C 35 -10, 20 -35, 0 -15 Z", strokeWidth: 3, fill: "none" },
              { type: "path", d: "M -8 -2 Q -4 1 0 -2", strokeWidth: 1.5, fill: "none" },
              { type: "path", d: "M 0 -2 Q 4 1 8 -2", strokeWidth: 1.5, fill: "none" }
            ]
          },
          {
            title: "Ears of Wheat Plant",
            description: "Organic fluid floral stems sketched entirely using double-curved quadratic bezier splines.",
            moodColor: "#10b981",
            elements: [
              { type: "path", d: "M -10 35 Q 0 0 15 -25", strokeWidth: 3, fill: "none" },
              { type: "path", d: "M 15 -25 Q 22 -15 15 -5 Q 5 -15 15 -25 Z", strokeWidth: 1.5, fill: "none" },
              { type: "path", d: "M 3 5 Q 12 12 18 20 Q 3 15 3 5 Z", strokeWidth: 1.5, fill: "none" },
              { type: "path", d: "M -3 15 Q -12 20 -15 28 Q -5 23 -3 15 Z", strokeWidth: 1.5, fill: "none" }
            ]
          }
        ];
        
        selection = splineFallbacks[Math.floor(Math.random() * splineFallbacks.length)];
        if (activeApp === "Spotify") {
          selection = splineFallbacks[0]; // Cozy Cosmic Cloud sounds lofi & cozy!
        } else if (activeApp === "Figma") {
          selection = splineFallbacks[1]; // Cursive Sweet Heart (vector art!)
        }
      } else {
        // Dynamic list of gorgeous ready-to-render fallbacks to match app context or prompt
        const fallbacks = [
          {
            title: "Warm Brew Mug",
            description: "Artie generated a steaming hot layout of developer fuel to light up your compiler flow!",
            moodColor: "#f97316",
            elements: [
              { type: "rect", x: -20, y: -10, w: 40, h: 40, strokeWidth: 3, fill: "none" },
              { type: "path", d: "M 20 -5 C 32 -5, 32 15, 20 15", strokeWidth: 3, fill: "none" },
              { type: "line", x1: -25, y1: 30, x2: 25, y2: 30, strokeWidth: 3 },
              { type: "path", d: "M -8 -18 Q -3 -25 -8 -30", strokeWidth: 2, fill: "none" },
              { type: "path", d: "M 6 -18 Q 11 -25 6 -30", strokeWidth: 2, fill: "none" }
            ]
          },
          {
            title: "Cozy Tape Cassette",
            description: "Let those virtual magnetic tape beats soothe your code deadline! Beautiful vibrations.",
            moodColor: "#a78bfa",
            elements: [
              { type: "rect", x: -30, y: -18, w: 60, h: 36, strokeWidth: 3, fill: "none" },
              { type: "circle", cx: -12, cy: 2, r: 5, strokeWidth: 2, fill: "none" },
              { type: "circle", cx: 12, cy: 2, r: 5, strokeWidth: 2, fill: "none" },
              { type: "rect", x: -18, y: -8, w: 36, h: 18, strokeWidth: 2, fill: "none" }
            ]
          },
          {
            title: "Neon Vector Studio",
            description: "Splashing some digital gradients and neon circles to inspire your active Figma workspace!",
            moodColor: "#ec4899",
            elements: [
              { type: "circle", cx: 0, cy: 0, r: 24, strokeWidth: 3, fill: "none" },
              { type: "circle", cx: -8, cy: -8, r: 4, strokeWidth: 1, fill: "#ec4899" },
              { type: "circle", cx: 8, cy: -8, r: 4, strokeWidth: 1, fill: "#3b82f6" },
              { type: "circle", cx: 0, cy: 8, r: 4, strokeWidth: 1, fill: "#10b981" }
            ]
          },
          {
            title: "Creative Spark Bulb",
            description: "A sudden flash of inspiration pops over Artie's head! Perfect for programmer's block.",
            moodColor: "#eab308",
            elements: [
              { type: "circle", cx: 0, cy: -10, r: 18, strokeWidth: 3, fill: "none" },
              { type: "rect", x: -8, y: 8, w: 16, h: 10, strokeWidth: 2, fill: "none" },
              { type: "line", x1: -5, y1: 18, x2: 5, y2: 18, strokeWidth: 3 },
              { type: "path", d: "M -4 -8 Q 0 -3 4 -8", strokeWidth: 2, fill: "none" }
            ]
          },
          {
            title: "Retro Floppy Disk",
            description: "Artie found this digital relic inside the server cache. It holds raw cozy potential!",
            moodColor: "#3b82f6",
            elements: [
              { type: "rect", x: -22, y: -22, w: 44, h: 44, strokeWidth: 3, fill: "none" },
              { type: "rect", x: -14, y: 4, w: 28, h: 18, strokeWidth: 2, fill: "none" },
              { type: "rect", x: -8, y: -22, w: 16, h: 12, strokeWidth: 2, fill: "none" }
            ]
          }
        ];

        selection = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        if (activeApp === "Figma" || (customPrompt && customPrompt.toLowerCase().includes("figma"))) {
          selection = fallbacks[2]; // Figma palette
        } else if (activeApp === "Spotify") {
          selection = fallbacks[1]; // Tape cassette
        } else if (activeApp === "VS Code") {
          selection = fallbacks[4]; // Floppy disk
        }
      }

      res.json(selection);
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Designer Fox server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
