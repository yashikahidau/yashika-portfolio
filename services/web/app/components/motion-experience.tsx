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
      { rx: 112, ry: 38, phase: 0, duration: 25, direction: 1, tiltX: 70, tiltY: 0, tiltZ: 0 },
      { rx: 104, ry: 34, phase: Math.PI * 0.62, duration: 35, direction: 1, tiltX: 60, tiltY: 40, tiltZ: -30 },
      { rx: 96, ry: 30, phase: Math.PI * 1.08, duration: 45, direction: -1, tiltX: 50, tiltY: -50, tiltZ: 45 },
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

    const project = (ring: (typeof rings)[number], angle: number, pointerTilt: { x: number; y: number }, phase: number) => {
      let x = ring.rx * Math.cos(angle);
      let y = ring.ry * Math.sin(angle);
      let z = 0;

      const rotateZ = (degrees: number) => {
        const radians = (degrees * Math.PI) / 180;
        const cosine = Math.cos(radians);
        const sine = Math.sin(radians);
        const nextX = x * cosine - y * sine;
        y = x * sine + y * cosine;
        x = nextX;
      };
      const rotateX = (degrees: number) => {
        const radians = (degrees * Math.PI) / 180;
        const cosine = Math.cos(radians);
        const sine = Math.sin(radians);
        const nextY = y * cosine - z * sine;
        z = y * sine + z * cosine;
        y = nextY;
      };
      const rotateY = (degrees: number) => {
        const radians = (degrees * Math.PI) / 180;
        const cosine = Math.cos(radians);
        const sine = Math.sin(radians);
        const nextX = x * cosine + z * sine;
        z = -x * sine + z * cosine;
        x = nextX;
      };

      rotateZ(ring.tiltZ + (phase * 180 / Math.PI) * 0.08);
      rotateY(ring.tiltY);
      rotateX(ring.tiltX);

      rotateY(pointerTilt.x * 3.5);
      rotateX(pointerTilt.y * -3.5);

      const perspective = 1 / (1 + z / 520);
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

      rings.forEach((ring, ringIndex) => {
        const ringPhase = ring.direction * elapsed * ((Math.PI * 2) / ring.duration);
        context.beginPath();
        for (let step = 0; step <= 120; step += 1) {
          const angle = (step / 120) * Math.PI * 2;
          const point = project(ring, angle, pointerCurrent.current, ringPhase);
          if (step === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.closePath();
        context.strokeStyle = ringIndex === 0 ? "rgba(240,217,140,0.30)" : ringIndex === 1 ? "rgba(240,217,140,0.28)" : "rgba(240,217,140,0.26)";
        context.stroke();

        if (ringIndex < 2) {
          const nodeAngle = ring.phase + ringPhase * 0.9;
          const node = project(ring, nodeAngle, pointerCurrent.current, ringPhase);
          context.save();
          context.shadowColor = "#F0D98C";
          context.shadowBlur = 12;
          context.beginPath();
          context.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
          context.fillStyle = "#F0D98C";
          context.fill();
          context.restore();
        }
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
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="absolute left-6 top-5 z-[4] text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">DESIGNING WITH INTENTION</div>
      <div className="absolute right-6 top-5 z-[4] flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        <span className="text-[8px] text-[#F0D98C] shadow-[0_0_8px_rgba(240,217,140,.7)]">●</span> LIVE
      </div>

      <div className="absolute inset-[52px_24px_46px] z-[2] [perspective:1000px] [transform-style:preserve-3d]">
        <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0D98C]/15 blur-2xl" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Three precisely centered intersecting orbital paths"
        />
        <div className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 select-none bg-gradient-to-br from-white via-[#F0D98C] to-[#D3AE37] bg-clip-text text-center font-semibold text-[38px] leading-none tracking-[-0.09em] text-transparent">
          YH.
        </div>
      </div>

      <div className="absolute bottom-5 left-6 z-[4] text-[10px] uppercase tracking-[0.16em] text-zinc-400">01 — 05</div>
      <div className="absolute bottom-5 right-6 z-[4] text-[10px] uppercase tracking-[0.16em] text-zinc-400">PORTFOLIO © 2026</div>
    </motion.div>
  );
}

