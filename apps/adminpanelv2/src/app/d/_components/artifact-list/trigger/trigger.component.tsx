import path from "path";

import Link from "next/link";

import { FileEntity, FileType } from "@driveapp/contracts/entities/files/file.entity";

import { Button } from "@/components/ui/button";
import { IconFolder } from "@tabler/icons-react";

export function TriggerComponent(props: { file: FileEntity }) {
  const { file } = props;
  const { path, name, type } = file;

  const isFolder = type === FileType.FOLDER;

  if(isFolder) {
    return <div>
      <Button>
        <IconFolder /> Trigger
      </Button>
    </div>;
  }

  return (
    <Button variant="link">
      <Link href={`/d?s=${path}`}>
        {path}
      </Link>
    </Button>
  )
}
