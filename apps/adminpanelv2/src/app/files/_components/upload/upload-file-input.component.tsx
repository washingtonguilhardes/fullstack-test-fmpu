'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { IconUpload } from '@tabler/icons-react';

export function UploadFileInputComponent(props: {
  onChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const { onChange, disabled } = props;

  const [dragging, setDragging] = useState(false);
  const dropContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = useCallback(
    (filesList?: FileList | null) => {
      if (disabled || !filesList) return;
      onChange(Array.from(filesList));
    },
    [disabled, onChange]
  );

  useEffect(() => {
    if (dropContainerRef.current) {
      function handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
      }

      function handleDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        handleFileChange(event.dataTransfer?.files);
      }

      function handleDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
      }

      dropContainerRef.current.addEventListener('dragover', handleDragOver);
      dropContainerRef.current.addEventListener('drop', handleDrop);
      dropContainerRef.current.addEventListener('dragleave', handleDragLeave);
      return () => {
        dropContainerRef.current?.removeEventListener('dragover', handleDragOver);
        dropContainerRef.current?.removeEventListener('drop', handleDrop);
        dropContainerRef.current?.removeEventListener('dragleave', handleDragLeave);
      };
    }
  }, [handleFileChange]);

  return (
    <label
      className={cn(
        'w-full flex items-center justify-center group cursor-pointer',
        '[&[data-dragging="true"]]:bg-input/50'
      )}
      data-dragging={dragging}
    >
      <input
        type="file"
        className="hidden"
        multiple
        onChange={e => handleFileChange(e.target.files)}
      />
      <div
        className={cn(
          'w-full h-full flex items-center justify-center ',
          'border-2 border-dashed border-input/50 rounded-lg p-4',
          ' [&[data-dragging="true"]]:border-solid group-hover:border-solid',
          'transition-all duration-300 cursor-pointer'
        )}
        data-dragging={dragging}
        ref={dropContainerRef}
      >
        <div className="flex items-center justify-center gap-2 flex-col">
          <IconUpload className="size-6 opacity-50 group-hover:opacity-100 transition-all duration-300" />
          <div className="text-md text-muted-foreground group-hover:text-foreground transition-all duration-300">
            Drag and drop files here or click to upload
          </div>
        </div>
      </div>
    </label>
  );
}
