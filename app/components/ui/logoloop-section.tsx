"use client";

// ------ note toself : 
// this section represents the logo loop, but its responsive given the client size window

//why not put it directly in app? 
    /*the App (page.tsx) was starting to get cluttered, but thats not even the main reason
     - to be able to use the window.innerWidth thing, useEffect is needed, but useEffect has to be rendered clientside (or so i believe, point is it cannot be used unless the directive "use client" is specified 
     - which gives the need for a new component which imports the other component and can render it dynamically given the screen size of the client, this way i dont have to make the whole app on the client side, as i believe that wouldnt be good performance-wise and would defeat the point of nextjs optimization
     - evntually i should do the same with the rays, since they look weird on moblie*/

import { useState, useEffect } from "react";
import LogoLoop from "./logoloop-bit";


// Alternative with image sources
// each logo carries a `colorSrc`: an exact-geometry duplicate of the gray svg,
// recolored to the real brand colors (see /public/color/*). it stays hidden
// until the logo is clicked, then flashes in over the gray one. `color` is the
// glow tint used during that flash.
const imageLogos = [
  { src: "/logo-html5.svg",      alt: "HTML5",       colorSrc: "/color/logo-html5.svg",      color: "#E34F26" },
  { src: "/logo-react.svg",      alt: "React",       colorSrc: "/color/logo-react.svg",      color: "#61DAFB" },
  { src: "/logo-vue.svg",        alt: "VueJS",       colorSrc: "/color/logo-vue.svg",        color: "#42B883" },
  { src: "/logo-javascript.svg", alt: "JavaScript",  colorSrc: "/color/logo-javascript.svg", color: "#F7DF1E" },
  { src: "/logo-typescript.svg", alt: "TypeScript",  colorSrc: "/color/logo-typescript.svg", color: "#3178C6" },
  { src: "/logo-nextjs.svg",     alt: "Next.js",     colorSrc: "/color/logo-nextjs.svg",     color: "#FFFFFF" },
  { src: "/logo-tailwind.svg",   alt: "Tailwind CSS", colorSrc: "/color/logo-tailwind.svg",  color: "#38BDF8" },
  { src: "/logo-terraform.svg",  alt: "Terraform",   colorSrc: "/color/logo-terraform.svg",  color: "#7B42BC" },
  { src: "/logo-aws.svg",        alt: "AWS",         colorSrc: "/color/logo-aws.svg",        color: "#FF9900" },
  { src: "/logo-python.svg",     alt: "Python",      colorSrc: "/color/logo-python.svg",     color: "#FFD43B" },
  { src: "/logo-postgres.svg",   alt: "PostgreSQL",  colorSrc: "/color/logo-postgres.svg",   color: "#336791" },
  { src: "/logo-bash.svg",       alt: "Bash",        colorSrc: "/color/logo-bash.svg",       color: "#4EAA25" },
  { src: "/logo-three.svg",      alt: "Three.js",    colorSrc: "/color/logo-three.svg",      color: "#FFFFFF" },
  { src: "/logo-docker.svg",     alt: "Docker",      colorSrc: "/color/logo-docker.svg",     color: "#2496ED" },
  { src: "/logo-laravel.svg",    alt: "Laravel",     colorSrc: "/color/logo-laravel.svg",    color: "#FF2D20" },
  { src: "/logo-mysql.svg",      alt: "MySQL",       colorSrc: "/color/logo-mysql.svg",      color: "#00758F" },
  { src: "/logo-php.svg",        alt: "PHP",         colorSrc: "/color/logo-php.svg",        color: "#777BB4" },
  { src: "/logo-css3.svg",       alt: "CSS3",        colorSrc: "/color/logo-css3.svg",       color: "#1572B6" },
  // { src : "" , alt:"null" } // placeholder to make the loop smoother, it will be hidden with css

];




export default function LogoLoopSection() {
  const [logoHeight, setLogoHeight] = useState(60);
  const [gap, setGap] = useState(67);
  const [speed , setSpeed] = useState(60)




  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;

      if (width < 640) {       // sm 
        setLogoHeight(50);  setGap(35);  setSpeed(35); 

      } else if (width >= 1024) { // lg
        setLogoHeight(50);  setGap(70);  setSpeed(50);

      } else {                 // md
        setLogoHeight(40);  setGap(67);  setSpeed(60);
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);

  }, []);

  return (
        <LogoLoop
        logos={imageLogos}
        speed={speed}
        hoverSpeed={9}
        direction="left"
        logoHeight={logoHeight}
        gap={gap}
        scaleOnHover
        fadeOut
        fadeOutColor="#000000"
        ariaLabel="Technologies"
        />
  );
}