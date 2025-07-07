import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;

  const hasValidToken = access_token;

  if (hasValidToken) {
    redirect('/files');
  }

  redirect('/login');
}
