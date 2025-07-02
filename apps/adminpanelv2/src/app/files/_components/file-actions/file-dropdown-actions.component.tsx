import { FileEntity } from '@driveapp/contracts/entities/files/file.entity';

import { Row } from '@tanstack/react-table';

import { FileActionsDropdownComponent } from '../shared/file-actions-dropdown.component';

export function FileDropdownActionsComponent(props: { row: Row<FileEntity> }) {
  const { row } = props;

  return <FileActionsDropdownComponent file={row.original} />;
}
