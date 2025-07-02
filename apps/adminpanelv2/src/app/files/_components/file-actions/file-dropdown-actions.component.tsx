import { ArtifactoryEntity } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { Row } from '@tanstack/react-table';

import { FileActionsDropdownComponent } from '../shared/file-actions-dropdown.component';

export function FileDropdownActionsComponent(props: { row: Row<ArtifactoryEntity> }) {
  const { row } = props;

  return <FileActionsDropdownComponent file={row.original} />;
}
