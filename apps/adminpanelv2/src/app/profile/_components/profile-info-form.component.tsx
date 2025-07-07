'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { isError } from 'util';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAccount } from '@/context/account/account.context';
import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email()
});

export function ProfileInfoFormComponent() {
  const { user, sync } = useAccount();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? ''
    }
  });

  const {
    mutate: updateProfile,
    isPending,
    isSuccess,
    isError,
    error
  } = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) => {
      if (!user?.id) {
        throw new Error('User not found');
      }
      return restClient.patch(`/account/profile/${user.id}`, data, {
        withCredentials: true
      });
    }
  });

  const onSubmit = (data: z.infer<typeof profileSchema>) => updateProfile(data);

  useEffect(() => {
    // after the mutation is successful, we need to sync the user data but only needed
    // when left the profile page, to avoid unnecessary re-renders
    return () => {
      if (isSuccess) sync();
    };
  }, [isSuccess, sync]);

  const errorMessage = useMemo(
    () => error && parseErrorResponse(error),
    [isError, error]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and account settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isSuccess && (
              <Alert variant="success">
                <AlertTitle>Profile updated successfully</AlertTitle>
                <AlertDescription>
                  Your profile has been updated successfully
                </AlertDescription>
              </Alert>
            )}
            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Unable to update profile</AlertTitle>
                <AlertDescription>{errorMessage?.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
