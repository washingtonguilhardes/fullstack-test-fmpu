import { useForm } from 'react-hook-form';
import z from 'zod';

import {
  ArtifactoryEntity,
  CreateNewFolderDto
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconAlertCircle,
  IconCheck,
  IconFolderPlus,
  IconLoader2
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

const schema = z.object({
  name: z.string().min(1, { message: 'Folder name is required' }),
  parent: z.string().optional(),
  path: z.string().optional()
});

export function CreateNewFolderComponent(props: {
  parent: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (path?: string) => void;
}) {
  const { parent, open, onOpenChange, onSuccess } = props;

  const form = useForm({
    defaultValues: {
      name: '',
      parent,
      path: ''
    },
    resolver: zodResolver(schema)
  });

  const {
    data,
    mutate: createFolder,
    error,
    isPending,
    isSuccess
  } = useMutation({
    mutationFn: (data: CreateNewFolderDto) => {
      return restClient
        .post<ArtifactoryEntity>('/artifactory/new-folder', data)
        .then(res => res.data);
    }
  });

  const errorMessage = error && parseErrorResponse(error);

  const onSubmit = (data: z.infer<typeof schema>) => {
    createFolder({
      name: data.name,
      parentId: parent
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="mb-8">
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div>
          {isSuccess ? (
            <div>
              <Alert variant="success" className="mb-4">
                <AlertDescription className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2 flex-1 w-full">
                    <IconCheck />
                    Folder <b>{form.getValues('name')}</b> created successfully
                  </span>
                  <Button variant="outline" onClick={() => onSuccess(data?.path)}>
                    Go to folder
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-8">
                      <FormLabel>Folder Name</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2 flex-1 w-full">
                        <IconAlertCircle />
                        {errorMessage.message}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <IconLoader2 className="animate-spin" />
                    ) : (
                      <IconFolderPlus />
                    )}
                    New Folder
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
