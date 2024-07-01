import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
import { getAuthToken, serverSpotifyFetch } from '@/_utils/serverUtils';
import { SpotifyDevice, SpotifyUser } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spotify Get Rect',
  description: 'Your albums',
};

export default async function AlbumsLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const authToken = getAuthToken();

  const userResponse = await serverSpotifyFetch('me', {
    headers: {
      Authorization: authToken,
    },
  });

  const userData: SpotifyUser = await userResponse.json();
  const avatarUrl = userData.images[0].url;

  return (
    <>
      <div className="p-4">
        <MenuTabs
          avatarUrl={avatarUrl}
          tabs={[
            {
              label: 'Saved albums',
              path: '/albums/saved-albums',
            },
            {
              label: 'Recommendations',
              path: '/albums/recommendations',
            },
            {
              label: 'New releases',
              path: '/albums/new-releases',
            },
          ]}
        />

        <div className="mt-16">{children}</div>
        <CurrentlyPlaying />
      </div>
      {modal}
    </>
  );
}
