"use client";

import {
  FaReact, FaAws, FaDocker, FaNodeJs, FaGithub
} from "react-icons/fa";
import {
  SiNextdotjs, SiVercel, SiTypescript
} from "react-icons/si";

// --- Configuration ---
export const iconConfigs = [
  { Icon: FaReact, color: "#61DAFB" },
  { Icon: SiTypescript, color: "#3178C6" },
  { Icon: SiNextdotjs, color: "#FFFFFF" },
  { Icon: SiVercel, color: "#FFFFFF" },
  { Icon: FaAws, color: "#FF9900" },
  { Icon: FaDocker, color: "#2496ED" },
  { Icon: FaNodeJs, color: "#339933" },
  { Icon: FaGithub, color: "#181717" },
];

export const ideaIcons = iconConfigs.slice(0, 4);
export const realityIcons = iconConfigs.slice(4, 8);

// Reusable Orbit Component
export const OrbitSystem = ({ 
  label, 
  colorClass, 
  icons, 
  reverse = false 
}: { 
  label: string;
  colorClass: string; 
  icons: typeof iconConfigs;
  reverse?: boolean;
}) => {
  return (
    <div className="relative flex items-center justify-center w-[24rem] h-[24rem]">
      
      {/* --- Center Pill Label (#idea / #reality) --- */}
      <div className={`absolute z-20 px-6 py-2 rounded-full font-semibold text-white shadow-lg ${colorClass}`}>
        {label}
      </div>

      {/* --- Ring 1: Inner (With Icons) --- */}
      <div className={`absolute w-[12rem] h-[12rem] rounded-full border border-white dark:border-white animate-spin-slow ${reverse ? 'reverse-spin' : ''}`}>
        {icons.map((cfg, idx) => {
          const angleStep = (2 * Math.PI) / icons.length;
          const angle = idx * angleStep;
          const x = 50 + 50 * Math.cos(angle);
          const y = 50 + 50 * Math.sin(angle);

          return (
            <div
              key={idx}
              className="absolute flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-white dark:border-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${reverse ? '0deg' : '0deg'})`, 
              }}
            >
              <cfg.Icon className="w-5 h-5" style={{ color: cfg.color }} />
            </div>
          );
        })}
      </div>

      {/* --- Ring 2: Middle (Decorational) --- */}
      <div className="absolute w-[18rem] h-[18rem] rounded-full border border-white dark:border-white opacity-60" />

      {/* --- Ring 3: Outer (Decorational/Boundary) --- */}
      <div className="absolute w-[24rem] h-[24rem] rounded-full border border-white dark:border-white opacity-50" />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        .reverse-spin {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};
