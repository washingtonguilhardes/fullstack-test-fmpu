'use client';

import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { ArtifactCardComponent } from './artifact-card.component';

interface ArtifactGridComponentProps {
  files: ArtifactoryEntity[];
}

export function ArtifactGridComponent({ files = [] }: ArtifactGridComponentProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
        <p className="text-gray-500">
          Get started by uploading your first file or creating a folder.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {files.map(file => (
        <ArtifactCardComponent key={file._id} file={file} />
      ))}
    </div>
  );
}
