import { Suspense } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LoginFormComponent } from './_components/login-form.component';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (accessToken) {
    return redirect('/files');
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormComponent />
    </Suspense>
  );
}
