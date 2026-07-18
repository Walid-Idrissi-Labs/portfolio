"use client";

import SplitText from './splittext-bit';

const HEADLINE_CLASSES =
    "text-center text-[2.1rem] text-beige_bright md:text-[4.7rem] lg:text-[5.5rem] xl:text-[6.7rem] font-unbounded opacity-90";

export default function SplitTextSection() {
    return (
        <SplitText
            className={HEADLINE_CLASSES}
            delay={140}
            duration={5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 15 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            tag="div"
            textAlign="center"
        >
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                <span className="whitespace-nowrap">Shaping What </span>
                <span className="whitespace-nowrap font-ibm italic text-slate">Comes Next.</span>
            </div>
        </SplitText>
    );
}
