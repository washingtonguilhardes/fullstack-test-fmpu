import {
  ArtifactoryEntity,
  ArtifactoryType
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { ArtifactListComponent } from './_components/artifact-list/artifact-list.component';

const files: ArtifactoryEntity[] = [
  {
    _id: '1',
    name: 'Documents',
    type: ArtifactoryType.FOLDER,
    path: 'documents',
    size: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '2',
    name: 'presentation.pdf',
    type: ArtifactoryType.FILE,
    path: 'documents/presentation.pdf',
    size: 2048576,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '3',
    name: 'vacation-photo.jpg',
    type: ArtifactoryType.FILE,
    path: 'photos/vacation-photo.jpg',
    size: 3145728,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '4',
    name: 'meeting-recording.mp4',
    type: ArtifactoryType.FILE,
    path: 'videos/meeting-recording.mp4',
    size: 52428800,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '5',
    name: 'project-backup.zip',
    type: ArtifactoryType.FILE,
    path: 'backups/project-backup.zip',
    size: 104857600,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '6',
    name: 'podcast-episode.mp3',
    type: ArtifactoryType.FILE,
    path: 'audio/podcast-episode.mp3',
    size: 15728640,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '7',
    name: 'Photos',
    type: ArtifactoryType.FOLDER,
    path: 'photos',
    size: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  },
  {
    _id: '8',
    name: 'report.docx',
    type: ArtifactoryType.FILE,
    path: 'documents/report.docx',
    size: 1048576,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1'
  }
];

export default async function DashboardPage(props: {
  searchParams: Promise<{ segment: string; preview: string }>;
}) {
  const { searchParams } = props;
  const { segment, preview } = await searchParams;

  return (
    <ArtifactListComponent
      files={files}
      segment={segment ?? preview ?? ''}
      preview={Boolean(preview)}
    />
  );
}
