import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none ${hoverable ? 'transition-shadow hover:shadow-md dark:hover:border-slate-700' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
