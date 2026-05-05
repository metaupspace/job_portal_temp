'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface SimpleMarqueeProps {
  text: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  separator?: string;
}

const SimpleMarquee: React.FC<SimpleMarqueeProps> = ({
  text,
  speed = 30,
  direction = 'left',
  className = '',
  separator = ' • '
}) => {
  const scrollDirection = direction === 'left' ? -1 : 1;
  
  // Create the repeated text content
  const scrollContent = `${text}${separator}${text}${separator}${text}${separator}${text}${separator}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, scrollDirection * -50 + '%']
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear'
          }
        }}
      >
        <span className="text-2xl sf md:text-4xl lg:text-6xl ">
          {scrollContent}
        </span>
      </motion.div>
    </div>
  );
};

export default SimpleMarquee;
