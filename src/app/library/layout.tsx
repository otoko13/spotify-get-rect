import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
import { getAuthToken, serverSpotifyFetch } from '@/_utils/serverUtils';
import { SpotifyUser } from '@/types';

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
  const avatarUrl = userData.images?.[0]?.url;

  return (
    <>
      <div>
        <MenuTabs
          avatarUrl={avatarUrl}
          tabs={[
            {
              label: 'Saved albums',
              path: '/library/saved-albums',
            },
            {
              label: 'Most played',
              path: '/library/latest-played',
            },
            {
              label: 'Recommendations',
              path: '/library/recommendations',
            },
            {
              label: 'New releases',
              path: '/library/new-releases',
            },
            {
              label: 'Playlists',
              path: '/library/playlists',
            },
            {
              label: 'Audiobooks',
              path: '/library/audiobooks',
            },
          ]}
        />

        <div className="mt-20">{children}</div>
        {/* This is the ideal place for CurrentlyPlaying, but we can't do this
         because it causes a rerender of the whole page when the track changes - 
         moving to individual pages instead, which is OK since it's absolutely positioned, 
         however there might be a slight flicker as we move between the routes under albums*/}
        <CurrentlyPlaying />
      </div>
      {modal}
    </>
  );
}
