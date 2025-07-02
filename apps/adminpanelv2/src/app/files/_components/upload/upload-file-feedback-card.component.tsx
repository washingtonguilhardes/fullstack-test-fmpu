import { cn } from '@/lib/utils';
import { IconCheck, IconFile, IconX } from '@tabler/icons-react';

export interface UploadResult {
  fileName: string;
  success: boolean;
  message?: string;
  error?: string;
}

export function UploadFileFeedbackCardComponent(props: { result: UploadResult }) {
  const { result } = props;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border',
        result.success
          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
          : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
      )}
    >
      {result.success ? (
        <IconCheck className="h-4 w-4 text-green-500" />
      ) : (
        <IconX className="h-4 w-4 text-red-500" />
      )}
      <IconFile className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium truncate text-ellipsis overflow-hidden w-max-[min(100%, 326px)]"
          title={result.fileName}
        >
          {result.fileName}
        </div>
        {result.error && (
          <div className="text-xs text-red-600 dark:text-red-400">{result.error}</div>
        )}
        {result.message && (
          <div className="text-xs text-green-600 dark:text-green-400">
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}
