'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { cn } from '@/lib/utils';
import {
  IconUpload,
  IconCheck,
  IconX,
  IconFile,
  IconAlertCircle
} from '@tabler/icons-react';

import { UploadFileFeedbackCardComponent } from './upload-file-feedback-card.component';
import { truncateName } from './upload.utils';

interface UploadResult {
  fileName: string;
  success: boolean;
  message?: string;
  error?: string;
}

export function UploadFileUploadComponent(props: {
  files: File[];
  setFiles: (files: File[]) => void;
  onNext: (results: UploadResult[]) => void;
}) {
  const { files, setFiles, onNext } = props;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setUploadResults([]);
    setCurrentFileIndex(0);

    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      setCurrentFileIndex(i);

      const truncatedName = truncateName(file.name);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('originalName', file.name);
        formData.append('mimeType', file.type);
        formData.append('size', file.size.toString());

        await restClient.post('/artifactory/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            if (progressEvent.total) {
              const fileProgress = (progressEvent.loaded / progressEvent.total) * 100;
              const overallProgress = ((i + fileProgress / 100) / files.length) * 100;
              setProgress(overallProgress);
            }
          }
        });

        results.push({
          fileName: truncatedName,
          success: true,
          message: 'File uploaded successfully'
        });
      } catch (error: any) {
        const errorMessage = parseErrorResponse(error);
        results.push({
          fileName: truncatedName,
          success: false,
          error: errorMessage.message
        });
      }
    }

    setUploadResults(results);
    setUploading(false);
    setProgress(100);
  }, [files]);

  const handleNext = () => {
    onNext(uploadResults);
  };

  const handleRetry = () => {
    const failedFiles = files.filter((_, index) => !uploadResults[index]?.success);
    setFiles(failedFiles);
    setUploadResults([]);
    setProgress(0);
    setCurrentFileIndex(0);
  };

  const successfulUploads = uploadResults.filter(result => result.success).length;
  const failedUploads = uploadResults.filter(result => !result.success).length;
  useEffect(() => {
    uploadFiles();
  }, [uploadFiles]);

  return (
    <div className="space-y-6">
      {uploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Uploading {currentFileIndex + 1} of {files.length} files...
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            Currently uploading: {files[currentFileIndex]?.name}
          </div>
        </div>
      )}

      {!uploading && uploadResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <IconCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">
              {successfulUploads} files uploaded successfully
            </span>
          </div>

          {failedUploads > 0 && (
            <div className="flex items-center gap-2">
              <IconX className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-600">
                {failedUploads} files failed to upload
              </span>
            </div>
          )}
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

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!uploading && uploadResults.length === 0 && (
          <Button onClick={uploadFiles} className="flex-1">
            <IconUpload className="h-4 w-4 mr-2" />
            Upload {files.length} Files
          </Button>
        )}

        {!uploading && uploadResults.length > 0 && (
          <>
            {failedUploads > 0 && (
              <Button variant="outline" onClick={handleRetry}>
                <IconAlertCircle className="h-4 w-4 mr-2" />
                Retry Failed ({failedUploads})
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
