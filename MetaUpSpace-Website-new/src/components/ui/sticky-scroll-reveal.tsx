"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  headerHeight = 80,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
  headerHeight?: number;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  // ✅ Fixed: Properly typed ref
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const containerHeight = `calc(100vh - ${headerHeight}px)`;

  return (
    <>
      {/* Mobile Layout - Text Only */}
      <div className="block lg:hidden md:mt-17 mt-0">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-16">
          {content.map((item, index) => (
            <div key={item.title + index} className="text-center space-y-6">
              {/* Image above text */}
              <div className="w-full max-w-lg mx-auto h-72 rounded-xl overflow-hidden bg-white shadow-xl">
                {item.content ?? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                    {item.title}
                  </div>
                )}
              </div>
              
              {/* Text content */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {item.title}
                </h2>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Original Sticky Scroll */}
      <div className="hidden lg:block" ref={ref}>
        <motion.div
          className="relative flex max-w-6xl mx-auto justify-center space-x-10 rounded-md p-15"
          style={{
            minHeight: containerHeight,
          }}
        >
          {/* Left side content */}
          <div className="relative flex items-start overflow-hidden px-4 w-1/2">
            <div className="max-w-2xl w-full">
              {content.map((item, index) => (
                <div 
                  key={item.title + index} 
                  className="flex flex-col justify-center"
                  style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
                >
                  <motion.h2
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: activeCard === index ? 1 : 0.3,
                    }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 mb-8"
                  >
                    {item.title}
                  </motion.h2>
                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: activeCard === index ? 1 : 0.3,
                    }}
                    className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg"
                  >
                    {item.description}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side sticky content */}
          <div className="w-1/2 relative">
            <div
              className={cn(
                "sticky top-25 h-[80vh] w-full max-w-lg mx-8 overflow-hidden rounded-md ",
                contentClassName,
              )}
            >
              {content[activeCard].content ?? null}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};
