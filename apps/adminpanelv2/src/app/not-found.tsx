import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { NotFoundComponent } from './_components';
import Layout from './d/layout';

export default async function NotFound(props: {
  params: {
    path: string;
  };
}) {
  const cs = await cookies();

  const sessionId = cs.get('DriveappSessionId')?.value;

  if (!sessionId) {
    return redirect('/login');
  }

  return (
    <Layout>
      <NotFoundComponent />
    </Layout>
  );
}
