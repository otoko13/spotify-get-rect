import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyUser } from '@/types';
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
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data: SpotifyUser = await response.json();
  const avatarUrl = data.images[0].url;

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
