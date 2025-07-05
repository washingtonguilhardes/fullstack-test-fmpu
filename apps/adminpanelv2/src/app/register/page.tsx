'use client';

import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';

import {
  CreateAccountDto,
  SignupNewAccountResult
} from '@driveapp/contracts/entities/users/user.entity';
import { IHTTPClientResult } from '@driveapp/contracts/utils/http-clients';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20)
});

export default function RegisterPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(schema)
  });

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: (data: CreateAccountDto) => {
      return restClient.post<IHTTPClientResult<SignupNewAccountResult>>(
        '/account/register',
        data
      );
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate({ ...data, firstName: '', lastName: '' });
  };
  const errorMessage = useMemo(() => error && parseErrorResponse(error), [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">You have been registered successfully</p>
          <span className="text-sm text-gray-500 mb-4">
            If you wasn&apos;t redirected, please click the button below
          </span>
          <Link href="/files">
            <Button>Start using DriveApp</Button>
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-md mobile:w-full p-4 bg-[#111827] rounded-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold">DriveApp</h1>
          </div>
          <Input {...register('email')} type="email" placeholder="Email" />
          <Input {...register('password')} type="password" placeholder="Password" />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Registering...' : 'Register'}
          </Button>
          {errorMessage && (
            <div className="text-red-500 p-2 rounded-md bg-red-500/10">
              {errorMessage.message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
