import * as React from 'react';

import { cn } from '@/utils';

function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot='select'
      className={cn(
        'h-8 w-full mb-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none hover:border-[#5b9bd5] hover:bg-[#f5f9fd] focus-visible:border-2 focus-visible:border-brand focus-visible:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 disabled:hover:border-input disabled:hover:bg-transparent aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 placeholder:text-muted-foreground md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
}

export { Select };
