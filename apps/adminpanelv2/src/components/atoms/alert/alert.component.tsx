import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconX } from '@tabler/icons-react';

export function Alert(props: {
  messages: { message: string; title?: string }[];
  severity: 'error' | 'success';
  closeable?: boolean;
  className?: string;
}) {
  const { messages, severity, closeable, className } = props;

  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  const color = severity === 'error' ? 'text-red-400' : 'text-green-400';
  const bgColor = severity === 'error' ? 'bg-red-500/10' : 'bg-green-500/10';

  return (
    <div className={cn('p-4 flex flex-col gap-2 w-full', className)}>
      {messages
        .filter(messageItem => !isOpen[messageItem.message])
        .map(messageItem => (
          <div
            key={messageItem.message}
            className={cn(
              'mx-auto overflow-hidden  flex items-center gap-2 w-full p-1 pl-2 rounded-md',
              !closeable && 'px-2',
              color,
              bgColor,
              `border border-${color}`,
            )}
          >
            <div className="flex-1 text-left flex items-center">
              <span className="text-sm">{messageItem.message}</span>

              {closeable && (
                <div className="flex-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(color, bgColor, 'text-sm', 'p-0')}
                    onClick={() => {
                      setIsOpen(prev => ({
                        ...prev,
                        [messageItem.message]: !prev[messageItem.message],
                      }));
                    }}
                  >
                    <IconX size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
