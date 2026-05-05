import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'secondary',
  className = '',
  onClick
}) => {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/20",
    secondary: "bg-transparent border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
  };

  return (
    <button 
      type="button" // Explicitly set type button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={(e) => {
        // Stop bubbling just in case a parent element is capturing clicks
        e.stopPropagation(); 
        if(onClick) onClick();
      }}
    >
      <span>{children}</span>
    </button>
  );
};

export default Tag;
