"use client";

import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
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

export function OrbitingNode({
  centerX,
  centerY,
  radiusX,
  radiusY,
  rotation,
  duration,
  phase = 0,
  className,
}: {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  duration: number;
  phase?: number;
  className: string;
}) {
  const progress = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const radians = (rotation * Math.PI) / 180;
  const angleAt = (value: number) => phase + value * Math.PI * 2;
  const cx = useTransform(progress, (value) => {
    const angle = angleAt(value);
    return centerX + radiusX * Math.cos(angle) * Math.cos(radians) -
      radiusY * Math.sin(angle) * Math.sin(radians);
  });
  const cy = useTransform(progress, (value) => {
    const angle = angleAt(value);
    return centerY + radiusX * Math.cos(angle) * Math.sin(radians) +
      radiusY * Math.sin(angle) * Math.cos(radians);
  });

  useAnimationFrame((_time, delta) => {
    if (shouldReduceMotion) return;
    progress.set((progress.get() + delta / duration) % 1);
  });

  return (
    <motion.circle
      className={`orbit-node ${className}`}
      cx={cx}
      cy={cy}
      r={4}
    />
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

export function handlePosterPointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;

  const { currentTarget, clientX, clientY } = event;
  const bounds = currentTarget.getBoundingClientRect();
  const x = (clientX - bounds.left) / bounds.width;
  const y = (clientY - bounds.top) / bounds.height;
  const rotateX = (0.5 - y) * 7;
  const rotateY = (x - 0.5) * 7;

  currentTarget.style.setProperty("--poster-tilt-x", `${rotateX.toFixed(2)}deg`);
  currentTarget.style.setProperty("--poster-tilt-y", `${rotateY.toFixed(2)}deg`);
  currentTarget.style.setProperty("--poster-glow-x", `${(x * 100).toFixed(1)}%`);
  currentTarget.style.setProperty("--poster-glow-y", `${(y * 100).toFixed(1)}%`);
  currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
}

export function handlePosterPointerLeave(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--poster-tilt-x", "0deg");
  event.currentTarget.style.setProperty("--poster-tilt-y", "0deg");
  event.currentTarget.style.setProperty("--poster-glow-x", "50%");
  event.currentTarget.style.setProperty("--poster-glow-y", "50%");
  event.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
}
