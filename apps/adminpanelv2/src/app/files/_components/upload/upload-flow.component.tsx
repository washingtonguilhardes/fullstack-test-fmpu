'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { IconUpload } from '@tabler/icons-react';

import { UploadFileSelectorComponent } from './upload-file-selector.component';
import { UploadFileSuccessComponent } from './upload-file-success.component';
import { UploadFileUploadComponent } from './upload-file-upload.component';
import { UploadStepComponent } from './upload-step.component';

interface UploadResult {
  fileName: string;
  success: boolean;
  message?: string;
  error?: string;
}

export function UploadFlowComponent(props: {
  parent?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpload?: () => void;
}) {
  const { open = false, onOpenChange, onUpload, parent } = props;

  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<number>(1);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

  const handleClose = () => {
    setFiles([]);
    setStep(1);
    setUploadResults([]);
    onOpenChange?.(false);
  };

  const handleStep2 = () => {
    setStep(2);
  };

  const handleStep3 = (results: UploadResult[]) => {
    setUploadResults(results);
    setStep(3);
    if (results.some(result => result.success)) {
      onUpload?.();
    }
  };

  const handleStep4 = () => {
    setStep(4);
  };

  const handleReset = () => {
    setFiles([]);
    setStep(1);
    setUploadResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Select and upload your files to the system
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <UploadFileSelectorComponent
            uploadedFiles={files}
            setUploadedFiles={setFiles}
            onNext={handleStep2}
          />
        )}

        {step === 2 && (
          <UploadFileUploadComponent
            parent={parent ?? ''}
            files={files}
            setFiles={setFiles}
            onNext={handleStep3}
          />
        )}

        {step === 3 && (
          <UploadFileSuccessComponent
            files={files}
            setFiles={setFiles}
            onNext={handleReset}
            uploadResults={uploadResults}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
