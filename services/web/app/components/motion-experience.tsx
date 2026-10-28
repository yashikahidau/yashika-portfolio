"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const duration = shouldReduceMotion ? 250 : 1150;

    const updateProgress = (now: number) => {
      const nextProgress = Math.min(100, Math.round(((now - startedAt) / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress === 100) {
        setIsComplete(true);
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    frame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isComplete && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.85,
            ease: [0.87, 0, 0.13, 1],
          }}
          aria-hidden="true"
        >
          <motion.div
            className="preloader-mark"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
          >
            YH<span>.</span>
          </motion.div>
          <div className="preloader-progress">
            <span>CREATING SOMETHING INTENTIONAL</span>
            <span className="preloader-counter">
              {String(progress).padStart(2, "0")}
              <span className="preloader-percent">%</span>
            </span>
            <div className="preloader-track">
              <motion.span
                className="preloader-track-fill"
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AmbientBackground() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const renderPosition = () => {
      document.documentElement.style.setProperty("--cursor-x", `${pointerX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${pointerY}px`);
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(renderPosition);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-noise" />
    </div>
  );
}

export function KineticLine({
  children,
  delay = 0,
  active,
}: {
  children: ReactNode;
  delay?: number;
  active?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className="kinetic-line"
      initial={shouldReduceMotion ? false : "hidden"}
      animate={active === undefined ? undefined : active ? "visible" : "hidden"}
      whileInView={active === undefined ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: {} }}
    >
      <motion.span
        variants={{
          hidden: { y: shouldReduceMotion ? 0 : "110%" },
          visible: { y: 0 },
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.75,
          delay: shouldReduceMotion ? 0 : delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export function handleCardPointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;

  const { currentTarget, clientX, clientY } = event;
  const bounds = currentTarget.getBoundingClientRect();
  const x = (clientX - bounds.left) / bounds.width;
  const y = (clientY - bounds.top) / bounds.height;
  const rotateX = (0.5 - y) * 8;
  const rotateY = (x - 0.5) * 8;
  const surface = currentTarget.querySelector<HTMLElement>(".card-tilt-surface");
  if (!surface) return;

  surface.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
  surface.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
  currentTarget.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
  currentTarget.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
}

export function handleCardPointerLeave(event: ReactPointerEvent<HTMLElement>) {
  const surface = event.currentTarget.querySelector<HTMLElement>(".card-tilt-surface");
  surface?.style.setProperty("--tilt-x", "0deg");
  surface?.style.setProperty("--tilt-y", "0deg");
}

export function handleMagneticPointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;

  const { currentTarget, clientX, clientY } = event;
  const bounds = currentTarget.getBoundingClientRect();
  const x = Math.max(-5, Math.min(5, (clientX - (bounds.left + bounds.width / 2)) * 0.12));
  const y = Math.max(-5, Math.min(5, (clientY - (bounds.top + bounds.height / 2)) * 0.12));
  currentTarget.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`);
  currentTarget.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`);
}

export function handleMagneticPointerLeave(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--magnetic-x", "0px");
  event.currentTarget.style.setProperty("--magnetic-y", "0px");
}

export function PrecisionOrbitalPoster() {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 150, damping: 20, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 150, damping: 20, mass: 0.7 });
  const rotateX = useTransform(smoothY, [-1, 1], [-2.5, 2.5]);
  const rotateY = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rings = [
      { rx: 108, ry: 36, rotation: 0, phase: 0, direction: 1, node: "circle", color: "#F0D98C" },
      { rx: 108, ry: 36, rotation: Math.PI / 3, phase: Math.PI * 0.62, direction: 1, node: "square", color: "#66E2A3" },
      { rx: 108, ry: 36, rotation: -Math.PI / 3, phase: Math.PI * 1.08, direction: 1, node: "circle", color: "#B59CFF" },
    ] as const;

    let frame = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let cssWidth = 300;
    let cssHeight = 300;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, bounds.width);
      cssHeight = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssWidth * pixelRatio);
      canvas.height = Math.round(cssHeight * pixelRatio);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const project = (ring: (typeof rings)[number], angle: number, pointerTilt: { x: number; y: number }, orbitPhase: number) => {
      let x = ring.rx * Math.cos(angle);
      let y = ring.ry * Math.sin(angle);
      let z = 0;

      const fixedRotation = ring.rotation + orbitPhase * 0.12 * ring.direction;
      const fixedCosine = Math.cos(fixedRotation);
      const fixedSine = Math.sin(fixedRotation);
      const rotatedX = x * fixedCosine - y * fixedSine;
      y = x * fixedSine + y * fixedCosine;
      x = rotatedX;

      const tiltRadiansX = pointerTilt.y * 0.055;
      const tiltRadiansY = pointerTilt.x * 0.065;
      const cosX = Math.cos(tiltRadiansX);
      const sinX = Math.sin(tiltRadiansX);
      const nextY = y * cosX - z * sinX;
      z = y * sinX + z * cosX;
      y = nextY;

      const cosY = Math.cos(tiltRadiansY);
      const sinY = Math.sin(tiltRadiansY);
      const nextX = x * cosY + z * sinY;
      z = -x * sinY + z * cosY;
      x = nextX;

      const perspective = 720 / (720 + z);
      return { x: 150 + x * perspective, y: 150 + y * perspective, z };
    };

    const draw = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!shouldReduceMotion) elapsed += delta;

      pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.08;
      pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.08;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const scaleX = cssWidth / 300;
      const scaleY = cssHeight / 300;
      context.setTransform(pixelRatio * scaleX, 0, 0, pixelRatio * scaleY, 0, 0);
      context.clearRect(0, 0, 300, 300);
      context.lineWidth = 1;
      context.lineCap = "round";

      const ringPhase = elapsed * ((Math.PI * 2) / 40);
      rings.forEach((ring, ringIndex) => {
        context.beginPath();
        for (let step = 0; step <= 120; step += 1) {
          const angle = (step / 120) * Math.PI * 2;
          const point = project(ring, angle, pointerCurrent.current, ringPhase);
          if (step === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.closePath();
        const ringGradient = context.createLinearGradient(38, 150, 262, 150);
        ringGradient.addColorStop(0, ringIndex === 1 ? "rgba(240,217,140,0.18)" : "rgba(240,217,140,0.24)");
        ringGradient.addColorStop(0.38, "rgba(240,217,140,0.42)");
        ringGradient.addColorStop(0.72, "rgba(255,247,218,0.16)");
        ringGradient.addColorStop(1, "rgba(240,217,140,0.08)");
        context.save();
        context.filter = "drop-shadow(0 0 8px rgba(240,217,140,0.25))";
        context.strokeStyle = ringGradient;
        context.lineWidth = 1;
        context.stroke();
        context.restore();

        const nodeAngle = ring.phase + elapsed * ((Math.PI * 2) / (24 + ringIndex * 4));
        const node = project(ring, nodeAngle, pointerCurrent.current, ringPhase);
        context.save();
        context.shadowColor = ring.color;
        context.shadowBlur = ring.node === "square" ? 10 : 14;
        context.fillStyle = ring.color;
        context.globalAlpha = 0.96;
        context.beginPath();
        if (ring.node === "square") {
          context.rect(node.x - 3.5, node.y - 3.5, 7, 7);
        } else {
          context.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
        }
        context.fill();
        context.restore();
      });

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [shouldReduceMotion]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    pointerTarget.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    pointerX.set(pointerTarget.current.x);
    pointerY.set(pointerTarget.current.y);
  };

  const resetPointer = () => {
    pointerTarget.current = { x: 0, y: 0 };
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      className="hero-art relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/90 p-6 backdrop-blur-md"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(211,174,55,0.12) 0%, rgba(211,174,55,0.055) 10%, rgba(30,21,42,0.62) 38%, rgba(10,10,12,0.96) 76%, #0A0A0C 100%)",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 78%)",
        }}
      />
      <div className="pointer-events-none absolute left-[18%] top-[24%] z-[1] text-[9px] leading-none text-[#F0D98C]/30">+</div>
      <div className="pointer-events-none absolute right-[18%] top-[31%] z-[1] text-[7px] leading-none text-white/25">*</div>
      <div className="pointer-events-none absolute bottom-[26%] left-[12%] z-[1] text-[8px] leading-none text-[#B59CFF]/20">+</div>
      <div className="pointer-events-none absolute bottom-[22%] right-[24%] z-[1] text-[6px] leading-none text-[#66E2A3]/25">·</div>
      <div className="absolute left-2 top-2 size-3 border-l border-t border-white/15" />
      <div className="absolute right-2 top-2 size-3 border-r border-t border-white/15" />
      <div className="absolute bottom-2 left-2 size-3 border-b border-l border-white/15" />
      <div className="absolute bottom-2 right-2 size-3 border-b border-r border-white/15" />
      <div className="absolute left-6 top-5 z-[4] text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">DESIGNING WITH INTENTION</div>
      <div className="absolute right-6 top-5 z-[4] flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        <motion.span
          className="size-2 rounded-full bg-[#66E2A3] shadow-[0_0_10px_rgba(102,226,163,.85)]"
          animate={shouldReduceMotion ? undefined : { opacity: [1, 0.35, 1], scale: [1, 0.78, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        /> LIVE
      </div>

      <div className="absolute inset-[52px_24px_46px] z-[2] [perspective:1000px] [transform-style:preserve-3d]">
        <div className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D3AE37]/10 blur-[28px]" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ filter: "drop-shadow(0 0 8px rgba(240,217,140,0.22))" }}
          role="img"
          aria-label="Three precisely centered intersecting orbital paths"
        />
        <div
          className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 select-none bg-gradient-to-br from-white via-[#F0D98C] to-[#D3AE37] bg-clip-text text-center font-semibold text-[38px] leading-none tracking-[-0.09em] text-transparent"
          style={{ filter: "drop-shadow(0 0 14px rgba(240,217,140,0.34))", textShadow: "0 0 18px rgba(240,217,140,0.32)" }}
        >
          YH.
        </div>
      </div>

      <div className="absolute bottom-5 left-6 z-[4] text-[10px] uppercase tracking-[0.16em] text-zinc-400">01 — 05</div>
      <div className="absolute bottom-5 right-6 z-[4] text-[10px] uppercase tracking-[0.16em] text-zinc-400">PORTFOLIO © 2026</div>
    </motion.div>
  );
}

