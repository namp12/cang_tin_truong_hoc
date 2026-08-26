import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
  side = 'right',
  className,
}) => {
  if (!open) return null;

  const sideStyles = {
    right: 'inset-y-0 right-0 h-full max-w-md w-full animate-in slide-in-from-right duration-200 border-l',
    left: 'inset-y-0 left-0 h-full max-w-xs w-full animate-in slide-in-from-left duration-200 border-r',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Drawer */}
      <div
        className={cn(
          'relative z-50 flex flex-col bg-card text-card-foreground border-border shadow-2xl p-6 overflow-y-auto',
          sideStyles[side],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4 border-b border-border/50', className)} {...props} />
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h4 className={cn('text-base font-semibold leading-none tracking-tight text-foreground', className)} {...props} />
);

export const SheetClose: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Đóng</span>
  </button>
);
