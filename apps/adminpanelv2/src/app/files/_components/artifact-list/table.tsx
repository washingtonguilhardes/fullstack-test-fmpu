import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';

import { DataTable } from '@/components/molecules';

import { columns } from './columns';

export function ArtifactsTable(props: { files: ArtifactoryDto[] }) {
  const { files = [] } = props;

  return <DataTable columns={columns} data={files} />;
}
