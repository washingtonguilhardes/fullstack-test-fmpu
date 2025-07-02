import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { IconFile, IconUpload, IconX } from '@tabler/icons-react';

import { UploadFileInputComponent } from './upload-file-input.component';
import { truncateName } from './upload.utils';

export function UploadFileSelectorComponent(props: {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  onNext: () => void;
}) {
  const { uploadedFiles, setUploadedFiles, onNext } = props;

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-4 mb-4',
          uploadedFiles.length > 0 && 'bg-muted p-4 rounded-lg'
        )}
      >
        <UploadFileInputComponent
          onChange={files => {
            setUploadedFiles([...uploadedFiles, ...files]);
          }}
        />
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {uploadedFiles.map(file => (
              <div
                key={file.name}
                className="inline-flex items-center gap-2 bg-input/50 p-2 pl-4 rounded-lg"
              >
                <div className="flex items-center gap-2" title={file.name}>
                  <IconFile size={16} />
                  {truncateName(file.name)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setUploadedFiles(uploadedFiles.filter(f => f.name !== file.name));
                  }}
                >
                  <IconX size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onNext}
          disabled={uploadedFiles.length === 0}
          className="flex items-center gap-2"
        >
          <IconUpload />
          Upload
        </Button>
      </DialogFooter>
    </>
  );
}
