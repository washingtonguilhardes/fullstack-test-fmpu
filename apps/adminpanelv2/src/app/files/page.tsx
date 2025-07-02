import {
  FileAccess,
  FileEntity,
  FileStatus,
  FileType,
  FileVisibility
} from '@driveapp/contracts/entities/files/file.entity';

import { ArtifactListComponent } from './_components/artifact-list/artifact-list.component';

const files: FileEntity[] = [
  {
    id: '1',
    name: 'Documents',
    type: FileType.FOLDER,
    path: 'documents',
    size: 0,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PUBLIC,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '2',
    name: 'presentation.pdf',
    type: FileType.FILE,
    path: 'documents/presentation.pdf',
    size: 2048576,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PUBLIC,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '3',
    name: 'vacation-photo.jpg',
    type: FileType.FILE,
    path: 'photos/vacation-photo.jpg',
    size: 3145728,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PRIVATE,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '4',
    name: 'meeting-recording.mp4',
    type: FileType.FILE,
    path: 'videos/meeting-recording.mp4',
    size: 52428800,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PUBLIC,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '5',
    name: 'project-backup.zip',
    type: FileType.FILE,
    path: 'backups/project-backup.zip',
    size: 104857600,
    status: FileStatus.ARCHIVED,
    visibility: FileVisibility.PRIVATE,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '6',
    name: 'podcast-episode.mp3',
    type: FileType.FILE,
    path: 'audio/podcast-episode.mp3',
    size: 15728640,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PUBLIC,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '7',
    name: 'Photos',
    type: FileType.FOLDER,
    path: 'photos',
    size: 0,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PUBLIC,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '8',
    name: 'report.docx',
    type: FileType.FILE,
    path: 'documents/report.docx',
    size: 1048576,
    status: FileStatus.ACTIVE,
    visibility: FileVisibility.PRIVATE,
    access: FileAccess.READ,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: '1',
      email: 'test@test.com',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

export default async function DashboardPage(props: {
  searchParams: Promise<{ s: string }>;
}) {
  const { searchParams } = props;
  const { s } = await searchParams;

  return <ArtifactListComponent files={files} segment={s} />;
}
