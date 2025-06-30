import { PropsWithChildren, ReactNode } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
interface ConfirmationDialogProps {
  title: string;
  description: string;
  confirm?: ReactNode;
  cancel?: ReactNode;
  message: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmationDialog(props: PropsWithChildren<ConfirmationDialogProps>) {
  const { title, description, children, confirm, cancel, message, open, onOpenChange } =
    props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">{message}</div>
        <DialogFooter className="sm:justify-end">
          {cancel && <DialogClose asChild>{cancel}</DialogClose>}
          {confirm}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
