'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  IconCheck,
  IconX,
  IconFile,
  IconAlertTriangle,
  IconRefresh,
  IconHome
} from '@tabler/icons-react';

import {
  UploadFileFeedbackCardComponent,
  UploadResult
} from './upload-file-feedback-card.component';

export function UploadFileSuccessComponent(props: {
  files: File[];
  setFiles: (files: File[]) => void;
  onNext: () => void;
  uploadResults?: UploadResult[];
}) {
  const { setFiles, onNext, uploadResults = [] } = props;

  const successfulUploads = uploadResults.filter(result => result.success).length;
  const failedUploads = uploadResults.filter(result => !result.success).length;
  const totalUploads = uploadResults.length;

  const handleReset = () => {
    setFiles([]);
    onNext();
  };

  const handleUploadMore = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Success Summary */}
      <div className="text-center space-y-4">
        {successfulUploads === totalUploads && totalUploads > 0 ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <IconCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                Upload Complete!
              </h3>
              <p className="text-sm text-muted-foreground">
                All {successfulUploads} files were uploaded successfully
              </p>
            </div>
          </div>
        ) : failedUploads === totalUploads && totalUploads > 0 ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <IconX className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                Upload Failed
              </h3>
              <p className="text-sm text-muted-foreground">
                All {failedUploads} files failed to upload
              </p>
            </div>
          </div>
        ) : totalUploads > 0 ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <IconAlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                Partial Upload Complete
              </h3>
              <p className="text-sm text-muted-foreground">
                {successfulUploads} of {totalUploads} files uploaded successfully
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <IconFile className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload Summary</h3>
              <p className="text-sm text-muted-foreground">No files were processed</p>
            </div>
          </div>
        )}
      </div>
      {uploadResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Upload Details</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadResults.map(result => (
              <UploadFileFeedbackCardComponent
                key={`upload-result-${result.fileName}`}
                result={result}
              />
            ))}
          </div>
        </div>
      )}
      {totalUploads > 0 && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {successfulUploads}
            </div>
            <div className="text-xs text-muted-foreground">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {failedUploads}
            </div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {failedUploads > 0 && (
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <IconRefresh className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        <Button onClick={handleUploadMore} className="flex-1">
          <IconHome className="h-4 w-4 mr-2" />
          Upload More Files
        </Button>
      </div>
    </div>
  );
}
