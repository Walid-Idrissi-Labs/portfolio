'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'
import { prefersReducedMotion } from '../../lib/device'

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'

const movingMap: Record<Direction, string> = {
  TOP: 'radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
  LEFT: 'radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
  BOTTOM:
    'radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
  RIGHT:
    'radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
}

const highlight =
  'radial-gradient(75% 181.15942028985506% at 50% 50%, #90877F 0%, rgba(255, 255, 255, 0) 100%)'

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Element = 'button',
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType
    containerClassName?: string
    className?: string
    duration?: number
    clockwise?: boolean
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false)
  const [direction, setDirection] = useState<Direction>('BOTTOM')
  const containerRef = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(true)

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT']
    const currentIndex = directions.indexOf(currentDirection)
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length
    return directions[nextIndex]
  }

  // Pause the rotation timer while the element is offscreen.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hovered && inView && !prefersReducedMotion()) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState))
      }, duration * 1000)
      return () => clearInterval(interval)
    }
  }, [hovered, inView])
  return (
    <Element
      ref={containerRef as React.Ref<HTMLElement>}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex h-min w-fit flex-col flex-nowrap content-center items-center justify-center gap-10 overflow-visible rounded-full border bg-black/40 box-decoration-clone p-1 backdrop-blur-sm transition duration-800 hover:bg-black/60 dark:bg-white/20',
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          'z-10 w-auto rounded-[inherit] bg-black px-4 py-2 text-white',
          className
        )}
      >
        {children}
      </div>
      {/* The glow is drawn at quarter size with a quarter of the blur radius
          and scaled up 4x on the compositor. The gradients are percentage
          based, so the result is the same blurred glow as a full-size
          blur(20px) layer, rasterised with 1/16 of the pixels each frame. */}
      <div className='pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]'>
        <motion.div
          className='absolute left-0 top-0 h-1/4 w-1/4'
          style={{
            filter: 'blur(5px)',
            scale: 4,
            originX: 0,
            originY: 0,
          }}
          initial={{ background: movingMap[direction] }}
          animate={{
            background: hovered
              ? [movingMap[direction], highlight]
              : movingMap[direction],
          }}
          transition={{ ease: 'linear', duration: duration ?? 1 }}
        />
      </div>
      <div className='absolute inset-1 z-1 flex-none rounded-[inherit] bg-black' />
    </Element>
  )
}

export default function HoverBorderDemo() {
  return (
    <HoverBorderGradient>
      <span>Emerald UI Components</span>
    </HoverBorderGradient>
  )
}
