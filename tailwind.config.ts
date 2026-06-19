import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gunze: {
          navy: "#1a3a5c",
          "navy-dark": "#0f2840",
          "navy-light": "#234e7a",
          accent: "#e8a020",
          bg: "#f4f5f7",
          surface: "#ffffff",
          border: "#e2e5ea",
        },
      },
      animation: {
        // Scanning line animation
        "scan-line": "scanLine 2.5s ease-in-out infinite",
        // Pulse glow — slow ambient
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        // Float — slow gentle
        float: "float 8s ease-in-out infinite",
        // Fade in up — slow natural entrance
        "fade-in-up": "fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        // Fade in — slow
        "fade-in": "fadeIn 0.8s ease-out forwards",
        // Scale in — smooth zoom
        "scale-in": "scaleIn 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        // Progress fill
        "progress-fill": "progressFill 2s ease-out forwards",
        // Shimmer (skeleton)
        shimmer: "shimmer 2.5s linear infinite",
        // Spin slow
        "spin-slow": "spin 4s linear infinite",
        // Bounce in — spring feel, slower
        "bounce-in": "bounceIn 1s cubic-bezier(0.68, -0.1, 0.265, 1.1) forwards",
        // Pulse ring
        "pulse-ring": "pulseRing 2s ease-out infinite",
        // Slide in from right — smooth lateral
        "slide-in-right": "slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        // Zoom in — elegant
        "zoom-in": "zoomIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        // Loop step glow
        "step-glow": "stepGlow 3s ease-in-out infinite",
      },
      keyframes: {
        zoomIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scanLine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width, 100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        stepGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(34, 197, 94, 0)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
