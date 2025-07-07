import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function NotFound(props: {
  params: {
    path: string;
  };
}) {
  const cs = await cookies();

  const sessionId = cs.get('access_token')?.value;

  if (!sessionId) {
    return redirect('/login');
  }

  return (
    <div>
      <h1>Not Found</h1>
    </div>
  );
}
