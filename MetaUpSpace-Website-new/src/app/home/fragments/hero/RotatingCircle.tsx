'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Server, 
  Cpu, 
  Cloud, 
  Terminal, 
  GitBranch, 
  Package,
  Settings,
  Zap,
  Layers,
  Globe,
  Monitor,
  Smartphone,
  Palette,
  Lock
} from 'lucide-react';

const RotatingIconCircle = ({ size = 500 }) => {
  const icons = [
    { icon: <Code2 size={20} />, color: '#61dafb' },
    { icon: <Database size={20} />, color: '#336791' },
    { icon: <Server size={20} />, color: '#68d391' },
    { icon: <Cpu size={20} />, color: '#ffd700' },
    { icon: <Cloud size={20} />, color: '#4285f4' },
    { icon: <Terminal size={20} />, color: '#ffffff' },
    { icon: <GitBranch size={20} />, color: '#f1502f' },
    { icon: <Package size={20} />, color: '#cb3837' },
    { icon: <Settings size={20} />, color: '#9ca3af' },
    { icon: <Zap size={20} />, color: '#fbbf24' },
    { icon: <Layers size={20} />, color: '#8b5cf6' },
    { icon: <Globe size={20} />, color: '#10b981' },
    { icon: <Monitor size={20} />, color: '#3b82f6' },
    { icon: <Smartphone size={20} />, color: '#f59e0b' },
    { icon: <Palette size={20} />, color: '#ec4899' },
    { icon: <Lock size={20} />, color: '#ef4444' }
  ];

  const radius = size * 0.35;

  return (
    <div className="relative flex items-center justify-center">
      <div style={{ width: size, height: size }} className="relative">
        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
          }}
        />
        
        {/* Main rotating container */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Minimalist circle outline only */}
          <div 
            className="absolute rounded-full border border-white/10"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          
          {/* Ultra-minimal icons */}
          {icons.map((iconData, index) => {
            const angle = (360 / icons.length) * index;
            const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
            const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
            
            return (
              <motion.div
                key={index}
                className="absolute w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 cursor-pointer"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: iconData.color
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transition: { duration: 0.3 }
                }}
              >
                {iconData.icon}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default RotatingIconCircle;
