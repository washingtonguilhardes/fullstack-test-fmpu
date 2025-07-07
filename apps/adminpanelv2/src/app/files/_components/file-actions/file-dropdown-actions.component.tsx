import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';
import { ArtifactoryDto } from '@driveapp/contracts/entities/artifactory/dtos/artifactory.dto';
import { FileDto } from '@driveapp/contracts/entities/artifactory/dtos/file.dto';

import { Row } from '@tanstack/react-table';

import { FileActionsDropdownComponent } from '../shared/file-actions-dropdown.component';

export function FileDropdownActionsComponent(props: { row: Row<ArtifactoryDto> }) {
  const { row } = props;

  if (row.original.type === ArtifactoryType.FOLDER) {
    return null;
  }

  return <FileActionsDropdownComponent file={row.original as FileDto} />;
}
