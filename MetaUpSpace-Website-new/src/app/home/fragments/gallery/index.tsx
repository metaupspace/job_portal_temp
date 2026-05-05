'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';

interface Dimension {
  width: number;
  height: number;
}

interface ColumnProps {
  images: string[];
  y: MotionValue<number>;
  initialTop: string;
  className?: string;
}

const images: string[] = [
  // Column 1
  '/mockup/aisuite.png', 
  '/mockup/ams.png', 
  '/mockup/autoaims.png',
  
  // Column 2
  '/mockup/bid.png', 
  '/mockup/byte.png', 
  '/mockup/car.png',
  
  // Column 3
  '/mockup/hrms.png', 
  '/mockup/pharmansh.png', 
  '/mockup/tnent.png',
  
  // Column 4
  '/Industry/auto1.png', 
  '/Industry/WebUI.png', 
  '/Industry/saas.png',
];

export default function Gallery(): JSX.Element {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });

  const { height } = dimension;

  // Desktop transforms (Parallax effect: some move down faster than others)
  // These start with negative 'top' and move POSITIVE (down) to reveal top content
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);
  
  // Mobile transform (Standard scroll effect)
  // We start at top=0 and move NEGATIVE (up) to reveal bottom content
  // Increased multiplier to 3 to scroll through the longer list
  const yMobile = useTransform(scrollYProgress, [0, 1], [0, height * -3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number): void => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = (): void => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // --- DATA PREPARATION (Repeating images for length) ---
  
  // Mobile: Repeat ALL images 3 times
  const mobileImages = [...images, ...images, ...images];

  // Desktop Column 1
  const col1Base = [images[0], images[1], images[2]];
  const col1Images = [...col1Base, ...col1Base, ...col1Base, ...col1Base];

  // Desktop Column 2
  const col2Base = [images[3], images[4], images[5]];
  const col2Images = [...col2Base, ...col2Base, ...col2Base, ...col2Base]; 

  // Desktop Column 3
  const col3Base = [images[6], images[7], images[8]];
  const col3Images = [...col3Base, ...col3Base, ...col3Base, ...col3Base];

  // Desktop Column 4
  const col4Base = [images[9], images[10], images[11]];
  const col4Images = [...col4Base, ...col4Base, ...col4Base, ...col4Base]; 

  return (
    <main className="flex flex-col gap-10 min-h-screen overflow-hidden w-full items-center justify-center bg-black">
      <div ref={galleryRef} className="h-full md:h-[175vh] overflow-hidden w-full relative">
        
        {/* ================= MOBILE LAYOUT ================= */}
        {/* Adjusted top offset to ensure it starts visible */}
        <div className="flex md:hidden relative top-[-5vh] h-[200vh] gap-[2vw] p-[2vw] justify-center">
             <Column 
               images={mobileImages} 
               y={yMobile} 
               initialTop="0%" // Start at the top
               className="w-full px-4" 
             />
        </div>

        {/* ================= DESKTOP LAYOUT ================= */}
        <div className="hidden md:flex relative -top-[10vh] h-[200vh] gap-[2vw] p-[2vw] justify-center">
          <Column images={col1Images} y={y} initialTop="-60%" className="w-1/4 min-w-[22%]" />
          <Column images={col2Images} y={y2} initialTop="-80%" className="w-1/4 min-w-[22%]" />
          <Column images={col3Images} y={y3} initialTop="-60%" className="w-1/4 min-w-[22%]" />
          <Column images={col4Images} y={y4} initialTop="-80%" className="w-1/4 min-w-[22%]" />
        </div>

      </div>
    </main>
  );
}

const Column: React.FC<ColumnProps> = ({ images, y, initialTop, className }) => {
  return (
    <motion.div
      className={`relative h-full flex flex-col gap-[4vw] md:gap-[2vw] ${className}`}
      style={{ y, top: initialTop }}
    >
      {images.map((src: string, i: number) => (
        <div
          key={i}
          className="relative w-full aspect-square md:aspect-[16/10] rounded-[2vw] md:rounded-[1vw] overflow-hidden border border-white/10 shrink-0"
        >
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 25vw"
          />
        </div>
      ))}
    </motion.div>
  );
};
