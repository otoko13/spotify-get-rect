'use client';

import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
import WarningAlert from '@/_components/warningAlert/WarningAlert';
import AppCookies from '@/_constants/cookies';
import BodyScrollerContext from '@/_context/bodyScrollerContext/BodyScrollerContext';
import CurrentTrackContext from '@/_context/currentTrackContext/CurrentTrackContext';
import DisplayedItemCacheContext from '@/_context/displayedItemCacheContext/DisplayedItemCacheContext';
import PlayerContext from '@/_context/playerContext/PlayerContext';
import ThreeDOptionsContext from '@/_context/threeDOptionsContext/ThreeDOptionsContext';
import useDisplayItemsCache from '@/_hooks/useDisplayItemsCache';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useInitialiseSpotifySdkPlayer from '@/_hooks/useInitialiseSpotifySdkPlayer';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack, SpotifyUser } from '@/types';
import { useCookies } from 'next-client-cookies';
import { OverlayScrollbars } from 'overlayscrollbars';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export default function LibraryLayout({
  children,
  modal,
  aiModal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
  aiModal: ReactNode;
}>) {
  const authToken = useGetAuthToken();
  const cookies = useCookies();
  const [sdkPlayer, setSdkPlayer] = useState<Spotify.Player>();
  const [thisDeviceId, setThisDeviceId] = useState<string>();
  const [user, setUser] = useState<SpotifyUser>();
  const [use3d, setUse3d] = useState(Boolean(cookies.get(AppCookies.USE_3D)));
  const [playerInitFailed, setPlayerInitFailed] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyPlayerTrack>();
  const [scroller, setScroller] = useState<OverlayScrollbars>();

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
    onInitialisationFailed: () => setPlayerInitFailed(true),
    onInitialised: handleInitialisation,
  });

  const {
    savedAlbums,
    setSavedAlbums,
    mostPlayedAlbums,
    setMostPlayedAlbums,
    recommendations,
    setRecommendations,
    audiobooks,
    setAudiobooks,
    newReleases,
    setNewReleases,
    playlists,
    setPlaylists,
    savedAlbumsUrl,
    setSavedAlbumsUrl,
    mostPlayedAlbumsUrl,
    setMostPlayedAlbumsUrl,
    recommendationsUrl,
    setRecommendationsUrl,
    newReleasesUrl,
    setNewReleasesUrl,
    playlistsUrl,
    setPlaylistsUrl,
    audiobooksUrl,
    setAudiobooksUrl,
  } = useDisplayItemsCache();

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
        deviceId: thisDeviceId,
        initialisationFailed: playerInitFailed,
        player: sdkPlayer,
      }}
    >
      <BodyScrollerContext.Provider value={{ scroller }}>
        <DisplayedItemCacheContext.Provider
          value={{
            audiobooks,
            audiobooksNextUrl: audiobooksUrl,
            mostPlayedAlbums,
            mostPlayedAlbumsNextUrl: mostPlayedAlbumsUrl,
            newReleases,
            newReleasesNextUrl: newReleasesUrl,
            onAudiobooksChanged: setAudiobooks,
            onAudiobooksNextUrlChanged: setAudiobooksUrl,
            onMostPlayedAlbumsChanged: setMostPlayedAlbums,
            onMostPlayedAlbumsNextUrlChanged: setMostPlayedAlbumsUrl,
            onNewReleasesChanged: setNewReleases,
            onNewReleasesNextUrlChanged: setNewReleasesUrl,
            onPlaylistsChanged: setPlaylists,
            onPlaylistsNextUrlChanged: setPlaylistsUrl,
            onRecommendationsChanged: setRecommendations,
            onRecommendationsNextUrlChanged: setRecommendationsUrl,
            onSavedAlbumsChanged: setSavedAlbums,
            onSavedAlbumsNextUrlChanged: setSavedAlbumsUrl,
            playlists,
            playlistsNextUrl: playlistsUrl,
            recommendations,
            recommendationsNextUrl: recommendationsUrl,
            savedAlbums,
            savedAlbumsNextUrl: savedAlbumsUrl,
          }}
        >
          <CurrentTrackContext.Provider value={{ track: currentTrack }}>
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
                <CurrentlyPlaying
                  onTrackChange={setCurrentTrack}
                  scrollbar={scroller}
                  onScrollbarInitialised={setScroller}
                />
              </div>
              {modal}
              {aiModal}
              {playerInitFailed && (
                <WarningAlert text="The Spotify player couldn't be started on this device. Please start playback on another device and come back here to control it. " />
              )}
            </ThreeDOptionsContext.Provider>
          </CurrentTrackContext.Provider>
        </DisplayedItemCacheContext.Provider>
      </BodyScrollerContext.Provider>
    </PlayerContext.Provider>
  );
}
