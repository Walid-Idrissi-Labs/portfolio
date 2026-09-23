import React from 'react';
import { FileIcon, GithubIcon, LinkedinIcon } from 'lucide-react';

import {RevealLinks} from "../ui/reveallinks-bit"
import { AnimatedContainer } from '../utilities/animated-container';

interface FooterLink {
	title: string;
	href: string;
	target?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [

	{
		label: 'Navigation Links',
		links: [
			{ title: 'Home', href: '#' },
			{ title: 'About', href: '#about' },
			{ title: 'Projects', href: '#projects' },
			{ title: 'Contact', href: '#contact' },
			{ title: 'Skills', href: '#skills' },
			{ title: 'More About me', href: '#info' },
		],
	},
	{
		label: 'Social Links',
		links: [


			{ title: 'GitHub', href: 'https://github.com/walid-idrissi-labs', target: '_blank', icon: GithubIcon },
			{ title: 'LinkedIn', href: 'https://linkedin.com/in/walid-idrissi-labkhati', target: '_blank', icon: LinkedinIcon },
			{ title: 'Resume', href: 'https://walid-idrissi-resume.s3.us-west-2.amazonaws.com/walid-idrissi-labkhati-resume.pdf', target: '_blank', icon: FileIcon },
		],
	},
];

// Two mirrored mask layers grow from the left and right edges until they
// overlap in the middle; one masked element, so no seam where the sides meet.
// Kept cheap: not rendered on touch screens (tap leaves :hover stuck), only a
// 73px strip (40px glow room + 1px border + 32px corner) is ever repainted,
// and it's visibility:hidden at rest so it isn't painted at all.
const FOOTER_LINE_REVEAL =
	"pointer-events-none absolute inset-x-0 -top-[41px] h-[73px] hidden pointer-fine:block invisible " +
	"[mask-image:linear-gradient(to_right,#000_calc(100%-48px),transparent),linear-gradient(to_left,#000_calc(100%-48px),transparent)] " +
	"[mask-position:left,right] [mask-repeat:no-repeat] [mask-size:0%_100%] " +
	"[transition-property:mask-size,visibility] duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none " +
	"group-has-[[data-flip-link]:hover]/footer:visible group-has-[[data-flip-link]:hover]/footer:[mask-size:calc(50%+48px)_100%] " +
	"group-has-[[data-flip-link]:hover]/footer:duration-700 group-has-[[data-flip-link]:hover]/footer:ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Footer() {
	return (

		<footer className="group/footer md:rounded-t-6xl relative w-full l mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] bg-[#74818C]/5 px-10 py-12 lg:py-16">
			{/* Slate line drawn in from both sides while GitHub / Linkedin is hovered.
			    The wrapper reaches 40px above the footer so the mask doesn't cut the glow. */}
			<div aria-hidden className={FOOTER_LINE_REVEAL}>
				<div className="absolute inset-x-0 top-10 bottom-0 rounded-t-4xl border-t border-[#74818C] shadow-[0_-4px_24px_-2px_rgba(116,129,140,0.65)]" />
			</div>
			<div className="bg-foreground/20 transition-colors duration-300 pointer-fine:group-has-[[data-flip-link]:hover]/footer:bg-[#74818C] pointer-fine:group-has-[[data-flip-link]:hover]/footer:delay-300 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="flex w-full flex-col gap-8 pl-5 lg:flex-row lg:items-start lg:gap-0 ">
				{/* Left: copyright + links */}
				<div className="flex flex-col gap-1 lg:flex-row lg:gap-10 lg:shrink-0 ">
					<AnimatedContainer className="space-y-4" initialY={-8}>
						{/* <FrameIcon className="size-8" /> */}
						<p className="text-muted-foreground mt-8 mb-4 text-sm md:mt-0">
							© {new Date().getFullYear()} Walid IDRISSI
						</p>
					</AnimatedContainer>

					<div className="grid grid-cols-1 gap-1 md:gap-10 md:grid-cols-3 ">
						{footerLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.1 + index * 0.1} initialY={-8}>
								<div className="mb-10 md:mb-0">
									<h2 className="text-md font-unbounded font-medium">{section.label}</h2>
									<ul className="text-muted-foreground mt-4 space-y-2 text-sm font-ibm font-light">
										{section.links.map((link) => (
											<li key={link.title}>
												<a
													href={link.href}
													target={link.target}
													rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
													className="hover:text-foreground inline-flex items-center transition-all duration-300"
												>
													{link.icon && <link.icon className="me-1 size-4" />}
													{link.title}
												</a>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}
					</div>
				</div>

				{/* Right: RevealLinks — beside links on xl, below on mobile */}
				<AnimatedContainer className="w-full basis-full min-w-0 overflow-visible lg:basis-auto lg:flex-1" initialY={-8}>
					<RevealLinks />
				</AnimatedContainer>
			</div>
		</footer>
	);
};