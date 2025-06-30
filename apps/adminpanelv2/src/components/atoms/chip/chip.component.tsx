import MuiChip, { ChipProps } from '@mui/material/Chip';

export function Chip(props: ChipProps) {
  return <MuiChip label="Chip" size="medium" {...props} />;
}
