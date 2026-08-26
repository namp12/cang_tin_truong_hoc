import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'danger'
    | 'outline'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'info';
  size?: 'default' | 'sm' | 'md';
  hasDot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  hasDot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    primary: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    danger: 'border-transparent bg-destructive text-destructive-foreground',
    outline: 'border-border text-foreground',
    neutral: 'border-border bg-muted/60 text-muted-foreground',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };

  const dots = {
    default: 'bg-white',
    primary: 'bg-white',
    secondary: 'bg-white',
    destructive: 'bg-white',
    danger: 'bg-white',
    outline: 'bg-muted-foreground',
    neutral: 'bg-muted-foreground',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  const sizes = {
    default: 'px-2.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    sm: 'px-2 py-0.2 text-[10px]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {hasDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />}
      {children}
    </div>
  );
}
