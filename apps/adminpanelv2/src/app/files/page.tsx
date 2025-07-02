import { FileAccess, FileEntity, FileStatus, FileType, FileVisibility } from "@driveapp/contracts/entities/files/file.entity";

import { ArtifactListComponent } from "./_components/artifact-list/artifact-list.component";

const files: FileEntity[] = [
  {
    id: '1',
    name: 'Artifact 1',
    type: FileType.FILE,
    path: 'artifacts/1',
    size: 100,
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
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: '2',
    name: 'Artifact 1',
    type: FileType.FILE,
    path: 'artifacts/2',
    size: 100,
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
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: '3',
    name: 'Artifact 1',
    type: FileType.FILE,
    path: 'artifacts/3',
    size: 100,
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
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: '4',
    name: 'Artifact 1',
    type: FileType.FILE,
    path: 'artifacts/4',
    size: 100,
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
      updatedAt: new Date().toISOString(),
    },
  },
];

export default async function DashboardPage(props: { searchParams: Promise<{ s: string }> }) {
  const { searchParams } = props;
  const { s } = await searchParams;

  return (
      <ArtifactListComponent files={files} segment={s} />
  );
}
