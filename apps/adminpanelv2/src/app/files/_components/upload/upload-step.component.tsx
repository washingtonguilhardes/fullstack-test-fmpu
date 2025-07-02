import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { IconFilePlus, IconFileSmile, IconUpload } from '@tabler/icons-react';

export function UploadStepComponent(props: { step: number }) {
  const { step } = props;

  return (
    <ol className="flex items-center w-full">
      <li
        className={cn(
          "flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block",
          step >= 1
            ? 'text-blue-600 dark:text-blue-500 after:border-blue-100 dark:after:border-blue-800'
            : 'text-gray-400 after:border-gray-100 dark:after:border-gray-700'
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0',
            step >= 1 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <IconFilePlus
            className={cn(
              step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
            )}
          />
        </span>
      </li>
      <li
        className={cn(
          "flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block",
          step >= 2
            ? 'text-blue-600 dark:text-blue-500 after:border-blue-100 dark:after:border-blue-800'
            : 'text-gray-400 after:border-gray-100 dark:after:border-gray-700'
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0',
            step >= 2 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <IconUpload
            className={cn(
              step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
            )}
          />
        </span>
      </li>
      <li className="flex items-center w-full">
        <span
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0',
            step >= 3 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
          )}
        >
          <IconFileSmile
            className={cn(
              step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
            )}
          />
        </span>
      </li>
    </ol>
  );
}
