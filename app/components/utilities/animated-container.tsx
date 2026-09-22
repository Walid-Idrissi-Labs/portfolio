'use client';

import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type AnimatedContainerProps = {
	delay?: number;
	duration?: number;
	initialY?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

export function AnimatedContainer({
	className,
	delay = 0.1,
	duration = 0.8,
	initialY = 10,
	children,
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: initialY, opacity: 0 }}
			// `transitionEnd` clears the inline filter once the entrance is done.
			// Motion would otherwise leave `filter: blur(0px)` behind, which keeps a
			// filter layer alive on every wrapped subtree for the life of the page.
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1, transitionEnd: { filter: 'none' } }}
			viewport={{ once: true }}
			transition={{ delay, duration }}
			className={className}
		>
			{children}
		</motion.div>
	);
}