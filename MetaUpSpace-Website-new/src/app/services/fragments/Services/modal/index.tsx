'use client';

import React, { useRef, useEffect, JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';

// Type definitions
interface Project {
  src: string;
  color: string;
}

interface Modal {
  active: boolean;
  index: number;
}

interface IndexProps {
  modal: Modal;
  projects: Project[];
}

const scaleAnimation: Variants = {
  initial: { scale: 0, x: '-50%', y: '-50%' },
  enter: {
    scale: 1,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

export default function Index({ modal, projects }: IndexProps): JSX.Element {
  const { active, index } = modal;

  const modalContainer = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalContainer.current || !cursor.current || !cursorLabel.current) return;

    // Setup GSAP quickSet functions
    const xMoveContainer = gsap.quickTo(modalContainer.current, 'left', {
      duration: 0.8,
      ease: 'power3',
    });
    const yMoveContainer = gsap.quickTo(modalContainer.current, 'top', {
      duration: 0.8,
      ease: 'power3',
    });

    const xMoveCursor = gsap.quickTo(cursor.current, 'left', {
      duration: 0.5,
      ease: 'power3',
    });
    const yMoveCursor = gsap.quickTo(cursor.current, 'top', {
      duration: 0.5,
      ease: 'power3',
    });

    const xMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'left', {
      duration: 0.45,
      ease: 'power3',
    });
    const yMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'top', {
      duration: 0.45,
      ease: 'power3',
    });

    const moveHandler = (e: MouseEvent): void => {
      if (!active) return;
      const { pageX, pageY } = e;
      xMoveContainer(pageX);
      yMoveContainer(pageY);
      xMoveCursor(pageX);
      yMoveCursor(pageY);
      xMoveCursorLabel(pageX);
      yMoveCursorLabel(pageY);
    };

    window.addEventListener('mousemove', moveHandler);
    return () => window.removeEventListener('mousemove', moveHandler);
  }, [active]);

  return (
    <>
      {/* Modal Image Container */}
      <motion.div
        ref={modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
        className="h-[350px] w-[400px] absolute bg-white overflow-hidden pointer-events-none z-20 rounded-lg"
      >
        <div
          style={{ top: index * -100 + '%' }}
          className="absolute w-full h-full transition-[top] duration-[0.5s] ease-[cubic-bezier(0.76,0,0.24,1)]"
        >
          {projects.map((project: Project, i: number) => (
            <div
              key={`modal_${i}`}
              className="h-full w-full relative"
              style={{ backgroundColor: project.color }}
            >
              <Image
                src={`/Industry/${project.src}`}
                fill
                alt="project"
                className="object-cover"
                sizes="400px"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Custom Cursor */}
      <motion.div
        ref={cursor}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
        className="w-[80px] h-[80px] rounded-full bg-[#455ce9] text-white absolute z-30 flex items-center justify-center text-sm font-light pointer-events-none"
      />

      {/* Cursor Label */}
      <motion.div
        ref={cursorLabel}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
        className="w-[80px] h-[80px] rounded-full bg-transparent text-white absolute z-30 flex items-center justify-center text-sm font-light pointer-events-none"
      >
        View
      </motion.div>
    </>
  );
}
