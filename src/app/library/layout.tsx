'use client';

import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
import WarningAlert from '@/_components/warningAlert/WarningAlert';
import AppCookies from '@/_constants/cookies';
import PlayerContext from '@/_context/playerContext/PlayerContext';
import ThreeDOptionsContext from '@/_context/threeDOptionsContext/ThreeDOptionsContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useInitialiseSpotifySdkPlayer from '@/_hooks/useInitialiseSpotifySdkPlayer';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyUser } from '@/types';
import { useCookies } from 'next-client-cookies';
import { useCallback, useEffect, useState } from 'react';

export default function LibraryLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const authToken = useGetAuthToken();
  const cookies = useCookies();
  const [sdkPlayer, setSdkPlayer] = useState<Spotify.Player>();
  const [thisDeviceId, setThisDeviceId] = useState<string>();
  const [user, setUser] = useState<SpotifyUser>();
  const [use3d, setUse3d] = useState(Boolean(cookies.get(AppCookies.USE_3D)));
  const [playerInitFailed, setPlayerInitFailed] = useState(false);

  const handleInitialisation = useCallback(
    (player: Spotify.Player, deviceId: string) => {
      setSdkPlayer(player);
      setThisDeviceId(deviceId);
    },
    [],
  );

  const handleUse3dChanged = useCallback(
    (value: boolean) => {
      if (value) {
        cookies.set(AppCookies.USE_3D, 'true');
      } else {
        cookies.remove(AppCookies.USE_3D);
      }
      setUse3d(value);
    },
    [cookies],
  );

  useInitialiseSpotifySdkPlayer({
    onInitialised: handleInitialisation,
    onInitialisationFailed: () => setPlayerInitFailed(true),
  });

  useEffect(() => {
    async function getUser() {
      const userResponse = await clientSpotifyFetch('me', {
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
    <PlayerContext.Provider
      value={{
        player: sdkPlayer,
        deviceId: thisDeviceId,
        initialisationFailed: playerInitFailed,
      }}
    >
      <ThreeDOptionsContext.Provider value={{ use3d }}>
        <div>
          <MenuTabs
            avatarUrl={user?.images?.[0].url}
            use3d={use3d}
            onUse3dChanged={handleUse3dChanged}
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
          <CurrentlyPlaying />
        </div>
        {modal}
        {playerInitFailed && (
          <WarningAlert text="The Spotify player couldn't be started on this device. Please start playback on another device and come back here to control it. " />
        )}
      </ThreeDOptionsContext.Provider>
    </PlayerContext.Provider>
  );
}
