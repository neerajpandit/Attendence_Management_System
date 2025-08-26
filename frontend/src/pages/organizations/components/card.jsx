import * as React from 'react';
// import { cn } from '@/lib/utils'; // optional utility for merging classNames

// Card container
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

// Card content wrapper
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardContent };
