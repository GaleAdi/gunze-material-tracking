"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

/* ─── Scroll Reveal (Intersection Observer) ──────────────── */
interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-in" | "slide-right" | "scale-in" | "bounce-in" | "zoom-in";
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const hasShown = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasShown.current) {
          hasShown.current = true;
          setVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animationClasses: Record<string, string> = {
    "fade-up": "animate-fade-in-up",
    "fade-in": "animate-fade-in",
    "slide-right": "animate-slide-in-right",
    "scale-in": "animate-scale-in",
    "bounce-in": "animate-bounce-in",
    "zoom-in": "animate-zoom-in",
  };

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? animationClasses[animation] : "opacity-0"}`}
      style={visible ? { animationDelay: `${delay}s` } : {}}
    >
      {children}
    </div>
  );
}

/* ─── Scroll Reveal Group ─────────────────────────────────── */
interface ScrollRevealGroupProps {
  children: ReactNode[];
  animation?: "fade-up" | "fade-in" | "slide-right" | "scale-in" | "zoom-in";
  stagger?: number;
  className?: string;
  threshold?: number;
}

export function ScrollRevealGroup({
  children,
  animation = "fade-up",
  stagger = 0.08,
  className = "",
  threshold = 0.1,
}: ScrollRevealGroupProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal key={i} animation={animation} delay={i * stagger} threshold={threshold}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
export function Skeleton({
  className = "",
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
          style={{ width: i === lines - 1 && lines > 1 ? "75%" : "100%" }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Divider ───────────────────────────────────── */
export function AnimatedDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a3a5c]/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
    </div>
  );
}

/* ─── Pulse Dot ─────────────────────────────────────────── */
export function PulseDot({
  color = "bg-emerald-500",
  size = "md",
}: {
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };
  return (
    <span className="relative inline-flex">
      <span className={`absolute inline-flex h-full w-full rounded-full ${color} animate-pulse-ring`} />
      <span className={`relative inline-flex rounded-full h-full w-full ${sizes[size]} ${color}`} />
    </span>
  );
}

/* ─── Scanning Line ──────────────────────────────────────── */
export function ScanningLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a3a5c]/5 to-transparent" />
      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8a020] to-transparent animate-scan-line" />
    </div>
  );
}

/* ─── Floating Card ─────────────────────────────────────── */
export function FloatingCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ─── Step Indicator ────────────────────────────────────── */
export function StepIndicator({
  current,
  total = 5,
}: {
  current: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < current
              ? "w-6 bg-emerald-500"
              : i === current
              ? "w-3 bg-[#e8a020] animate-pulse"
              : "w-3 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Card Hover Effect ─────────────────────────────────── */
export function CardHover({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1a3a5c]/10 ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Number Counter ─────────────────────────────────────── */
export function useCountUp(end: number) {
  return end;
}
