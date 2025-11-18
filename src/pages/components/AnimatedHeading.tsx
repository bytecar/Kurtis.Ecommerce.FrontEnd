import React, { ReactNode } from 'react';

interface AnimatedHeadingProps {
  children: ReactNode;
  center?: boolean;
  className?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ 
  children, 
  center = false,
  className = '' 
}) => {
  return (
    <h2 
      className={`text-2xl md:text-3xl font-bold mb-6 relative inline-block ${center ? 'mx-auto' : ''} ${className}`}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-12 h-1 bg-primary rounded transition-all duration-300 ease-in-out group-hover:w-full"></span>
    </h2>
  );
}