import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
}

// Renders animated gradient text with a pure CSS animation (keyframes in
// globals.css) instead of a per-frame JS loop, so it ships no client JS and
// costs nothing when offscreen. The gradient pans one full period (150% of
// background-position) per 1.5 * animationSpeed seconds, matching the original
// JS timing of 100% per animationSpeed seconds.
export default function GradientText({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
}: GradientTextProps) {
  const gradientAngle =
    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';
  // Duplicate first color at the end for seamless looping
  const gradientColors = [...colors, colors[0]].join(', ');

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',
    backgroundRepeat: 'repeat',
    animation: `${direction === 'vertical' ? 'gradient-pan-y' : 'gradient-pan-x'} ${animationSpeed * 3}s linear infinite`,
  };

  return (
    <div
      className={`relative flex flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${showBorder ? 'py-1 px-2' : ''} ${className}`}
    >
      {showBorder && (
        <div className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]" style={gradientStyle}>
          <div
            className="absolute bg-black rounded-[1.25rem] z-[-1]"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      )}
      <div
        className="inline-block relative z-2 text-transparent bg-clip-text"
        style={{ ...gradientStyle, WebkitBackgroundClip: 'text' }}
      >
        {children}
      </div>
    </div>
  );
}
