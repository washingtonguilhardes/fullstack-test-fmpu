'use client';

import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20)
});

export function LoginFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const {
    mutate: login,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: (data: z.infer<typeof loginSchema>) => {
      return restClient.post('/account/login', data);
    }
  });

  const errorMessage = useMemo(() => error && parseErrorResponse(error), [error]);

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data, {
      onSuccess: () => {
        // Redirect to the original requested page or default to /files
        const redirectTo = searchParams.get('redirect') || '/files';
        router.push(redirectTo);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <form
        className="flex flex-col gap-4 w-full max-w-md mobile:w-full p-4 bg-[#111827] rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">DriveApp</h1>
        </div>
        <Input type="email" placeholder="Email" {...register('email')} />
        <Input type="password" placeholder="Password" {...register('password')} />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle className="size-8" />
            <AlertDescription>{errorMessage?.message}</AlertDescription>
          </Alert>
        )}
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-full bg-gray-200" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px w-full bg-gray-200" />
        </div>
        <Button variant="link" asChild type="button">
          <Link href="/register" className="text-sm text-gray-500">
            Register
          </Link>
        </Button>
      </form>
    </div>
  );
}
