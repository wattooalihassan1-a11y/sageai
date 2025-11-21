import * as React from 'react';

import {cn} from '@/lib/utils';
import { useLayoutEffect, useRef } from 'react';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, value, ...props}, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null);
    const textAreaRef = (ref || localRef) as React.RefObject<HTMLTextAreaElement>;

    useLayoutEffect(() => {
      const textarea = textAreaRef.current;
      if (textarea) {
        // Reset height to shrink on delete
        textarea.style.height = 'auto';
        // Set height to scrollHeight to grow on new line
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, textAreaRef]);

    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-y-hidden',
          className
        )}
        ref={textAreaRef}
        value={value}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};

    