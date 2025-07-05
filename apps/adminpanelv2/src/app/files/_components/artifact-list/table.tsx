import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { DataTable } from '@/components/molecules';

import { columns } from './columns';

export function ArtifactsTable(props: { files: ArtifactoryEntity[] }) {
  const { files = [] } = props;

  return <DataTable columns={columns} data={files} />;
}
