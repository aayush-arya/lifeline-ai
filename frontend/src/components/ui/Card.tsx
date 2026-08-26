import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${hoverable ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
