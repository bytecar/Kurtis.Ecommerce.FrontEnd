import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}

export function AnimatedHeading({ children, className, center = false }: AnimatedHeadingProps) {
  return (
    <h2 
      className={cn(
        'text-3xl font-serif font-bold relative',
        "before:content-[''] before:absolute before:h-1 before:w-0 before:bg-primary before:-bottom-2 before:left-0 before:transition-all before:duration-500",
        'hover:before:w-24 hover:text-primary transition-colors duration-300',
        center && 'text-center before:left-1/2 before:-translate-x-1/2 mx-auto',
        className
      )}
    >
      {children}
      <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">✨</span>
    </h2>
  );
}
