'use client';

import { THIS_DEVICE_NAME } from '@/_context/playerContext/PlayerContext';
import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyImage, SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NowPlayingBar from './NowPlayingBar';

export interface SpotifyDeviceSimple {
  id: string | null | undefined;
  name: string | null | undefined;
}

const trackCoverHasChanged = (
  newTrack: SpotifyPlayerTrack,
  originalTrack: SpotifyPlayerTrack,
) => {
  if (
    newTrack.currently_playing_type !== originalTrack.currently_playing_type
  ) {
    return true;
  }
  if (
    newTrack.currently_playing_type === 'track' &&
    originalTrack.currently_playing_type === 'track'
  ) {
    return newTrack.item.album.uri !== originalTrack.item.album.uri;
  }
  if (
    newTrack.currently_playing_type === 'episode' &&
    originalTrack.currently_playing_type === 'episode'
  ) {
    return newTrack.item.show.id !== originalTrack.item.show.id;
  }
};

const convertSdkTrackToApiTrack = (
  sdkTrack: Spotify.Track,
): SpotifyPlayerTrack => {
  const commonProperties = {
    id: sdkTrack.id,
    name: sdkTrack.name,
    uri: sdkTrack.uri,
  };

  if (sdkTrack.type === 'track') {
    return {
      currently_playing_type: 'track',
      item: {
        album: sdkTrack.album,
        artists: sdkTrack.artists.map((sdkArtist) => ({
          name: sdkArtist.name,
          uri: sdkArtist.uri,
        })),
        ...commonProperties,
      },
    } as SpotifyPlayerTrack;
  } else {
    return {
      currently_playing_type: 'episode',
      item: {
        images: sdkTrack.album.images as SpotifyImage[],
        show: {
          id: sdkTrack.album.uri as string,
          name: sdkTrack.album.name,
        },
        ...commonProperties,
      },
    } as unknown as SpotifyPlayerTrack;
  }
};

interface CurrentlyPlayingProps {
  onTrackChange: (track?: SpotifyPlayerTrack) => void;
  onScrollbarInitialised: (scrollbar: OverlayScrollbars) => void;
  scrollbar?: OverlayScrollbars;
}

const CurrentlyPlaying = ({
  onTrackChange,
  onScrollbarInitialised,
  scrollbar,
}: CurrentlyPlayingProps) => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();
  const [lastTrack, setLastTrack] = useState<SpotifyPlayerTrack>();
  const [trackStopped, setTrackStopped] = useState(true);
  const [currentDevice, setCurrentDevice] = useState<SpotifyDeviceSimple>();
  const localPlayerTrackUpdateTime = useRef<number>();

  const path = usePathname();

  // we're putting this here because document is only defined in
  // client side components. Since we have some SSC higher up in the tree
  // let's not put it at the root layout.

  // Due to bug with scrollbar in body being scrolled when scrolling in a
  // modal, we temporarily destroy the scrollbar and reinstate when moving
  // away from the ai modal
  useEffect(() => {
    if (path.endsWith('/ai') && scrollbar) {
      scrollbar?.destroy();
    } else {
      const osScrollbar = OverlayScrollbars(document.body, {
        scrollbars: {
          autoHideDelay: 2000,
          visibility: 'auto',
        },
      });
      onScrollbarInitialised(osScrollbar);
    }
  }, [scrollbar, path, onScrollbarInitialised]);

  const { player, deviceId: thisDeviceId } = usePlayerContext();

  const updateTracks = useCallback(
    (newTrack: SpotifyPlayerTrack, oldTrack?: SpotifyPlayerTrack | null) => {
      // only update if track has changed, otherwise we trigger unnecessary rerenders
      if (!newTrack) {
        return;
      }

      if (oldTrack && oldTrack.item.id === newTrack.item.id) {
        return;
      }

      if (!oldTrack) {
        setTrack(newTrack);
        return;
      }

      // keep the last track so we can fade out its image
      if (trackCoverHasChanged(newTrack, oldTrack)) {
        setLastTrack(oldTrack);
      }

      if (oldTrack.item.id !== newTrack.item.id) {
        setTrack(newTrack);
      }
    },
    [],
  );

  const getPlayData = useCallback(async () => {
    const fnStart = Date.now();

    const response = await clientSpotifyFetch(
      'me/player?additional_types=track,episode',
      {
        headers: {
          Authorization: authToken,
        },
        method: 'GET',
      },
    );

    // ignore too many requests responses
    if (response.status === 429 || response.status === 204) {
      return;
    }

    if (response.status !== 200) {
      setTrackStopped(true);
      return;
    }

    const data: SpotifyPlayerTrack = await response?.json();

    if (fnStart < (localPlayerTrackUpdateTime?.current ?? 0)) {
      console.warn('FOUND AN OVERLAP!');
      return;
    }

    if (currentDevice?.id !== data.device.id) {
      setCurrentDevice({
        id: data.device.id,
        name: data.device.name,
      });
    }

    if (!data.is_playing) {
      setTrackStopped(true);
      return;
    }

    if (data.device.id === thisDeviceId) {
      return;
    }

    setTrackStopped(false);

    if (data.item.id !== track?.item?.id) {
      updateTracks(data, track);
    }

    return Promise.resolve();
  }, [authToken, currentDevice?.id, thisDeviceId, track, updateTracks]);

  // set up polling for data
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!getPlayData) {
        return;
      }
      await getPlayData();
    }, 3500);

    getPlayData();

    return () => {
      clearInterval(interval);
    };
  }, [getPlayData]);

  const handleLocalPlaybackStateChanged = useCallback(
    (response: Spotify.PlaybackState) => {
      if (!response) {
        return;
      }

      localPlayerTrackUpdateTime.current = Date.now();

      const {
        paused,
        track_window: { current_track },
      } = response;

      setTrackStopped(!!paused);

      if (paused) {
        return;
      }

      setCurrentDevice({
        id: thisDeviceId,
        name: THIS_DEVICE_NAME,
      });

      if (current_track && current_track.id !== track?.item.id) {
        const convertedTrack = convertSdkTrackToApiTrack(current_track);

        updateTracks(convertedTrack, track);
      }
    },
    [thisDeviceId, track, updateTracks],
  );

  useEffect(() => {
    if (!player) {
      return;
    }
    player.addListener('player_state_changed', handleLocalPlaybackStateChanged);

    return () => {
      player.removeListener(
        'player_state_changed',
        handleLocalPlaybackStateChanged,
      );
    };
  }, [handleLocalPlaybackStateChanged, player]);

  useEffect(() => {
    onTrackChange(track);
  }, [onTrackChange, track]);

  const currentTrackImageToUse = useMemo(() => {
    if (!track) {
      return '';
    }

    return track.currently_playing_type === 'episode'
      ? track.item.images[0].url
      : track.item.album.images[0].url;
  }, [track]);

  const lastTrackImageToUse = useMemo(() => {
    if (!lastTrack) {
      return '';
    }

    return lastTrack.currently_playing_type === 'episode'
      ? lastTrack.item.images[0].url
      : lastTrack.item.album.images[0].url;
  }, [lastTrack]);

  return (
    <>
      {lastTrack && (
        <div>
          <Image
            alt="currently playing album art blurred"
            className={classNames(
              'fixed top-0 left-0 blur-3xl opacity-67 -z-20',
              { 'opacity-0': trackStopped },
            )}
            src={lastTrackImageToUse}
            width={0}
            height={0}
            sizes="100vw"
            style={{ height: '100vh', width: '100vw' }}
          />
        </div>
      )}
      {track && (
        <div>
          <Image
            alt="currently playing album art blurred"
            className="fixed top-0 left-0 blur-3xl opacity-67 -z-20 animate-fade-in"
            key={currentTrackImageToUse}
            src={currentTrackImageToUse}
            width={0}
            height={0}
            sizes="100vw"
            style={{ height: '100vh', width: '100vw' }}
          />
        </div>
      )}
      <div
        className={classNames(
          'fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black to-slate-800 opacity-0 transition-opacity duration-1000 -z-20',
          { 'opacity-100': trackStopped },
        )}
      />
      <NowPlayingBar
        authToken={authToken}
        currentTrackImageToUse={currentTrackImageToUse}
        getPlayData={getPlayData}
        onPlayTransferredToThisDevice={() =>
          setCurrentDevice({ id: thisDeviceId, name: THIS_DEVICE_NAME })
        }
        trackStopped={trackStopped}
        currentDevice={currentDevice}
        track={track}
      />
    </>
  );
};

export default CurrentlyPlaying;
