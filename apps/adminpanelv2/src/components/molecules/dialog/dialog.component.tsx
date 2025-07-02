import { PropsWithChildren, ReactNode } from 'react';

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadcnDialog
} from '@/components/ui/dialog';
interface DialogProps {
  title: string;
  description: string;
  trigger?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type { DialogClose, DialogFooter, DialogProps };

export function Dialog(props: PropsWithChildren<DialogProps>) {
  const { title, description, children, trigger, open, onOpenChange, footer } = props;
  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {footer && <DialogFooter className="sm:justify-end">{footer}</DialogFooter>}
      </DialogContent>
    </ShadcnDialog>
  );
}
