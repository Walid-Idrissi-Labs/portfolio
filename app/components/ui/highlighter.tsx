"use client";

import React, { useEffect, useRef } from "react";

interface HighlightGroupProps {
  children: React.ReactNode;
  className?: string;
}

// Tracks the pointer and exposes it to children as --mouse-x/--mouse-y CSS
// variables. Works directly on the DOM (no state), so pointer movement never
// triggers React re-renders.
export const HighlightGroup: React.FC<HighlightGroupProps> = ({
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const boxes = Array.from(container.children) as HTMLElement[];
    let containerSize = { w: container.offsetWidth, h: container.offsetHeight };

    const initContainer = () => {
      containerSize = { w: container.offsetWidth, h: container.offsetHeight };
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const { w, h } = containerSize;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;
      if (!inside) return;
      boxes.forEach((box) => {
        const boxRect = box.getBoundingClientRect();
        box.style.setProperty("--mouse-x", `${-(boxRect.left - rect.left) + x}px`);
        box.style.setProperty("--mouse-y", `${-(boxRect.top - rect.top) + y}px`);
      });
    };

    window.addEventListener("resize", initContainer);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("resize", initContainer);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
};

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  const hexInt = parseInt(hex.replace("#", ""), 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const rgb = hexToRgb(color);
    const circles: Circle[] = [];
    const mouse = { x: 0, y: 0 };
    const canvasSize = { w: 0, h: 0 };
    let rafId: number | null = null;

    const circleParams = (): Circle => ({
      x: Math.floor(Math.random() * canvasSize.w),
      y: Math.floor(Math.random() * canvasSize.h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + 1,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.3 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      magnetism: 0.1 + Math.random() * 4,
    });

    const drawCircle = (circle: Circle, update = false) => {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.translate(translateX, translateY);
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.fill();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!update) circles.push(circle);
    };

    const clearContext = () => {
      context.clearRect(0, 0, canvasSize.w, canvasSize.h);
    };

    const resizeCanvas = () => {
      circles.length = 0;
      canvasSize.w = container.offsetWidth;
      canvasSize.h = container.offsetHeight;
      canvas.width = canvasSize.w * dpr;
      canvas.height = canvasSize.h * dpr;
      canvas.style.width = `${canvasSize.w}px`;
      canvas.style.height = `${canvasSize.h}px`;
      context.scale(dpr, dpr);
    };

    const drawParticles = () => {
      clearContext();
      for (let i = 0; i < quantity; i++) {
        drawCircle(circleParams());
      }
    };

    const remapValue = (
      value: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number,
    ): number => {
      const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return remapped > 0 ? remapped : 0;
    };

    const animate = () => {
      clearContext();
      circles.forEach((circle, i) => {
        // Fade the particle out near the canvas edges
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSize.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSize.h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX += (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY += (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

        if (
          circle.x < -circle.size ||
          circle.x > canvasSize.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.h + circle.size
        ) {
          // Replace circles that drift out of the canvas
          circles.splice(i, 1);
          drawCircle(circleParams());
        } else {
          drawCircle(circle, true);
        }
      });
      rafId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (rafId === null) rafId = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = canvasSize;
      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.x = x;
        mouse.y = y;
      }
    };

    const initCanvas = () => {
      resizeCanvas();
      drawParticles();
    };

    // Only animate while the canvas is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
    );
    observer.observe(container);

    initCanvas();
    window.addEventListener("resize", initCanvas);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      observer.disconnect();
      stop();
      window.removeEventListener("resize", initCanvas);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [quantity, staticity, ease, color, vx, vy]);

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};
