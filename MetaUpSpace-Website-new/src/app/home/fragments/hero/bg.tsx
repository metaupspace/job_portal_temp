'use client';
import React, { useEffect, useRef } from 'react';

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Array<{
    x: number;
    y: number;
    angle: number;
    radius: number;
    speed: number;
    detour: number;
    detourSpeed: number;
    opacity: number;
  }>>([]);
  const animationFrameId = useRef<number | null>(null);

  const numParticles = 120;
  const baseSpeed = 0.11; // Much slower speed

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize particles with detour properties
    particles.current = Array.from({ length: numParticles }, () => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * (Math.min(width, height) * 0.8) + 300;
      const speed = baseSpeed + Math.random() * 0.08;
      
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle,
        radius,
        speed,
        detour: 0,
        detourSpeed: (Math.random() - 0.5) * 0.02, // Random detour direction
        opacity: Math.random() * 0.5 + 0.3
      };
    });

    const animate = () => {
      particles.current.forEach((particle) => {
        // Apply gentle detour - creates winding path toward center
        particle.detour += particle.detourSpeed;
        particle.angle += Math.sin(particle.detour) * 0.008; // Subtle sine wave detour
        
        // Move particle towards center (slower)
        particle.radius -= particle.speed;
        
        // Add slight random drift
        particle.angle += (Math.random() - 0.5) * 0.003;
        
        // Reset particle when it reaches center
        if (particle.radius <= 15) {
          particle.radius = Math.min(width, height) * 0.8 + 300;
          particle.angle = Math.random() * 2 * Math.PI;
          particle.speed = baseSpeed + Math.random() * 0.08;
          particle.detour = 0;
          particle.detourSpeed = (Math.random() - 0.5) * 0.02;
          particle.opacity = Math.random() * 0.5 + 0.3;
        }
        
        // Update position
        particle.x = centerX + particle.radius * Math.cos(particle.angle);
        particle.y = centerY + particle.radius * Math.sin(particle.angle);
      });

      // Update DOM elements
      if (containerRef.current) {
        const children = containerRef.current.children;
        particles.current.forEach((particle, idx) => {
          const dot = children[idx] as HTMLElement;
          if (dot) {
            dot.style.transform = `translate(${particle.x - 2}px, ${particle.y - 2}px)`;
            dot.style.opacity = `${particle.opacity}`;
          }
        });
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      particles.current.forEach(particle => {
        if (particle.radius > Math.min(newWidth, newHeight) * 0.8) {
          particle.radius = Math.min(newWidth, newHeight) * 0.8 + 300;
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0 max-h-screen overflow-hidden"
    >
      {Array.from({ length: numParticles }, (_, idx) => (
        <div
          key={idx}
          className="absolute bg-white rounded-full"
          style={{
            width: '2px',
            height: '2px',
            transform: 'translate(0px, 0px)',
            opacity: 0,
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
}
