import  './button.css';
import { cva } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import Link from 'next/link';

const classes = cva(
  "font-sfpro inline-flex items-center cursor-pointer justify-center gap-3 px-8 py-3.5 font-medium text-[14px] text-white rounded-full  transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500",
        secondary: "border-2 border-purple-500 text-white bg-transparent",
        ghost: "text-white bg-transparent"
      },
    },
  }
);

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'ghost';
  link?: string;
  icon?: React.ReactNode;
  enhanced?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant,
  className,
  children,
  link,
  icon,
  enhanced = false,
  ...otherProps
}: ButtonProps) {
  const combinedClasses = `${classes({ variant })} ${className ?? ''}`.trim();
  
  // Apply animation class only to primary variant when enhanced is true
  const animationClass = (enhanced && variant === 'primary') ? 
    'buttonCircular enhanced' : 
    (variant === 'primary' ? 'buttonCircular' : '');

  const ButtonContent = () => (
    <>
      <span className="font-medium">{children}</span>
      {icon && (
        <span className="arrow w-5 h-5">
          {icon}
        </span>
      )}
    </>
  );

  if (link) {
    return (
      <Link 
        href={link} 
        className={`${combinedClasses} ${animationClass} relative`}
  
        rel="noopener noreferrer"
      >
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button className={`${combinedClasses} ${animationClass} relative`} {...otherProps}>
      <ButtonContent />
    </button>
  );
}
