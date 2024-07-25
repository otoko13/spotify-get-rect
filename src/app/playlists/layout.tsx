import SimpleHeader from '@/_components/simpleHeader/SimpleHeader';
import { getAuthToken, serverSpotifyFetch } from '@/_utils/serverUtils';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const userResponse = await serverSpotifyFetch('me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const userData = await userResponse.json();

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black to-slate-800 -z-20" />
      <SimpleHeader
        avatarUrl={userData?.images?.[0].url}
        tabs={[
          {
            label: 'Clear playlists',
            path: '/playlists',
          },
        ]}
      />

      {children}
    </>
  );
}
