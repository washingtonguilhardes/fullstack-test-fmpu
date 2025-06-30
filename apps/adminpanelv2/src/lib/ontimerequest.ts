import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();

export async function onTimeServerRequest<T>(
  fn: (client: ApolloClient<any>) => Promise<T>,
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('DriveappSessionId');
  const refreshToken = cookieStore.get('DriveappRefreshToken');

  if (!session || !refreshToken) {
    return redirect('/login');
  }

  try {
    const result = await fn(
      new ApolloClient({
        uri: `${process.env.DRIVEAPP_API_URL_INTERNAL ?? ''}/graphql`,
        cache,
        ssrMode: true,
        defaultContext: {
          headers: {
            DriveappRefreshToken: refreshToken?.value,
            Authorization: `Bearer ${session.value}`,
          },
        },
      }),
    );
    return result;
  } catch (error) {
    console.error(error);
    return redirect('/login');
  }
}
