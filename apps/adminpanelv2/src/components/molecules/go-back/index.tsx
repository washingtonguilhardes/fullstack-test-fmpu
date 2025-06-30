'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IconArrowLeft } from '@tabler/icons-react';

export function AppHeaderGoBack(props: {
  goBack: string;
  goBackText?: string;
}) {
  const { goBack, goBackText } = props;

  let button = (
    <Button variant="ghost" size="icon" className="cursor-pointer" asChild>
      <Link href={goBack}>
        <IconArrowLeft />
      </Link>
    </Button>
  );

  if (goBackText) {
    button = (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              asChild
            >
              <Link href={goBack}>
                <IconArrowLeft />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{goBackText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      {button}
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              asChild
            >
              <Link href={goBack}>
                <IconArrowLeft />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{goBackText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </>
  );
}
