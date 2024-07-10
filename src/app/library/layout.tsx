'use client';

import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
import { getAuthToken, serverSpotifyFetch } from '@/_utils/serverUtils';
import { SpotifyUser } from '@/types';
import { useEffect, useState } from 'react';

export default function LibraryLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const authToken = getAuthToken();
  const [sdkPlayer, setSdkPlayer] = useState<Spotify.Player>();
  const [user, setUser] = useState<SpotifyUser>();

  useEffect(() => {
    async function getUser() {
      const userResponse = await serverSpotifyFetch('me', {
        headers: {
          Authorization: authToken,
        },
      });

      const userData = await userResponse.json();
      setUser(userData);
    }

    getUser();
  }, [authToken]);

  return (
    <>
      <div>
        <MenuTabs
          avatarUrl={user?.images?.[0].url}
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

        {children}
        {/* This is the ideal place for CurrentlyPlaying, but we can't do this
         because it causes a rerender of the whole page when the track changes - 
         moving to individual pages instead, which is OK since it's absolutely positioned, 
         however there might be a slight flicker as we move between the routes under albums*/}
        <CurrentlyPlaying onSdkPlayerInitialised={setSdkPlayer} />
      </div>
      {modal}
    </>
  );
}
