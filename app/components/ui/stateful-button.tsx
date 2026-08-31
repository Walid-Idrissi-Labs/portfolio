"use client";
import { cn } from "../../lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimate } from "motion/react";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  onAction?: () => Promise<boolean>;
  onSubmit?: () => Promise<boolean>;
  duration?: number;
  clockwise?: boolean;
}

export const SendButton = ({
  className,
  containerClassName,
  children,
  onAction,
  onSubmit,
  duration = 1,
  clockwise = true,
  ...props
}: ButtonProps) => {
  const [scope, animate] = useAnimate();
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const [inView, setInView] = useState(true);

  const rotateDirection = (current: Direction): Direction => {
    const dirs: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const idx = dirs.indexOf(current);
    const next = clockwise
      ? (idx - 1 + dirs.length) % dirs.length
      : (idx + 1) % dirs.length;
    return dirs[next];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

  // Pause the rotation timer while the button is offscreen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hovered && inView) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, inView, duration, clockwise]);

  const animateLoading = async () => {
    await animate(".loader", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 });
  };

  const animateSuccess = async () => {
    await animate(".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.2 });
    await animate(".check", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 });
    await animate(".check", { width: "0px", scale: 0, display: "none" }, { delay: 2, duration: 0.2 });
  };

  const animateError = async () => {
    await animate(".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.2 });
    await animate(".error", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 });
    await animate(".error", { width: "0px", scale: 0, display: "none" }, { delay: 2, duration: 0.2 });
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await animateLoading();
    // onSubmit takes priority if both are provided, falling back to onAction
    const action = onSubmit ?? onAction;
    const success = await action?.();
    if (success === true) {
      await animateSuccess();
    } else {
      await animateError();
    }
  };

  const { onClick, onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, ...buttonProps } = props;

  return (
    <button
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center hover:bg-black/10 transition duration-500 bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-1 box-decoration-clone w-fit cursor-pointer",
        containerClassName
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />

      <div className="bg-black absolute z-1 flex-none inset-[3.5px] rounded-[100px]" />

      <motion.div
        layout
        layoutId="button"
        ref={scope}
        className={cn(
          "relative flex items-center justify-center gap-2 w-auto text-white z-10 px-4 py-2 rounded-full font-medium min-w-30",
          className
        )}
      >
        <motion.div layout className="flex items-center gap-2">
          <Loader />
          <CheckIcon />
          <ErrorIcon />
          <motion.span layout>{children}</motion.span>
        </motion.div>
      </motion.div>
    </button>
  );
};

const Loader = () => (
  <motion.svg
    animate={{ rotate: [0, 360] }}
    initial={{ scale: 0, width: 0, display: "none" }}
    style={{ scale: 0.5, display: "none" }}
    transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className="loader text-white"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3a9 9 0 1 0 9 9" />
  </motion.svg>
);

const CheckIcon = () => (
  <motion.svg
    initial={{ scale: 0, width: 0, display: "none" }}
    style={{ scale: 0.5, display: "none" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className="check text-white"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
  </motion.svg>
);

const ErrorIcon = () => (
  <motion.svg
    initial={{ scale: 0, width: 0, display: "none" }}
    style={{ scale: 0.5, display: "none" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className="error text-white"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 8v4" />
    <path d="M12 16v.01" />
  </motion.svg>
);