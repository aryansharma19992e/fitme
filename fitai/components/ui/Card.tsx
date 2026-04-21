'use client';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ padding = 'md', className, children, ...props }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' };
  return (
    <div
      className={cn('bg-white rounded-2xl shadow-sm border border-gray-100', paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}
