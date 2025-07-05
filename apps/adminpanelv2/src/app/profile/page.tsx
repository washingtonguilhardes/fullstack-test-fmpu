import { Suspense } from 'react';

import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { UserProfileEntity } from '@driveapp/contracts/entities/users/user.entity';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { restClientServer } from '@/lib/http/rest.client';

import { ProfileInfoFormComponent } from './_components/profile-info-form.component';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');
  if (!accessToken) {
    return redirect('/login');
  }

  const { data } = await restClientServer.get<UserProfileEntity>('/account/whoami', {
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    }
  });

  console.log(data);

  return (
    <div className="flex flex-col h-full">
      <SiteHeader />
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <Button asChild>
              <Link href="/files">My Files</Link>
            </Button>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileInfoFormComponent user={data} />
          </Suspense>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              <Button>Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
