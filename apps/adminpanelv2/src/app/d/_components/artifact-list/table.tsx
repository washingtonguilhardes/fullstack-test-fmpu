
import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

import { DataTable } from '@/components/molecules';

import { columns } from './columns';


export function ArtifactsTable(props: { files: FileEntity[] }) {
  const { files = [] } = props;

  return (
    <DataTable
      columns={columns}
      data={files}
    />
  );
}
