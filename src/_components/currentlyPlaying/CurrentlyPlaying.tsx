'use client';

import { THIS_DEVICE_NAME } from '@/_context/playerContext/PlayerContext';
import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useGetTargetDevice from '@/_hooks/useGetTargetDevice';
import pauseButton from '@/_images/pause.svg';
import playButton from '@/_images/play.svg';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyImage, SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TransferPlaybackDropdown from '../transferPlaybackDropdown/TransferPlaybackDropdown';
import styles from './currentlyPlaying.module.scss';
import Link from 'next/link';

interface SpotifyDeviceSimple {
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
          uri: sdkArtist.uri,
          name: sdkArtist.name,
        })),
        ...commonProperties,
      },
    } as SpotifyPlayerTrack;
  } else {
    return {
      currently_playing_type: 'episode',
      item: {
        show: {
          id: sdkTrack.album.uri as string,
          name: sdkTrack.album.name,
        },
        images: sdkTrack.album.images as SpotifyImage[],
        ...commonProperties,
      },
    } as unknown as SpotifyPlayerTrack;
  }
};

interface CurrentlyPlayingProps {
  onTrackChange: (track?: SpotifyPlayerTrack) => void;
}

const CurrentlyPlaying = ({ onTrackChange }: CurrentlyPlayingProps) => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();
  const [lastTrack, setLastTrack] = useState<SpotifyPlayerTrack>();
  const [trackStopped, setTrackStopped] = useState(true);
  const [currentDevice, setCurrentDevice] = useState<SpotifyDeviceSimple>();
  const localPlayerTrackUpdateTime = useRef<number>();

  const {
    player,
    deviceId: thisDeviceId,
    initialisationFailed: playerInitialisationFailed,
  } = usePlayerContext();
  const getTargetDevice = useGetTargetDevice();

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

  const handlePlay = useCallback(async () => {
    if (!trackStopped) {
      return;
    }
    const targetDeviceId = await getTargetDevice();

    const deviceToUse = currentDevice?.id ?? targetDeviceId;

    player?.activateElement();

    await clientSpotifyFetch(
      `me/player/play${deviceToUse ? `?device_id=${deviceToUse}` : ''}`,
      {
        headers: {
          Authorization: authToken,
        },
        method: 'PUT',
      },
    );
    if (deviceToUse !== thisDeviceId) {
      await getPlayData();
    }
  }, [
    authToken,
    currentDevice?.id,
    getPlayData,
    getTargetDevice,
    player,
    thisDeviceId,
    trackStopped,
  ]);

  const handlePause = useCallback(async () => {
    if (trackStopped) {
      return;
    }
    await clientSpotifyFetch('me/player/pause', {
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
    });
    if (currentDevice?.id !== thisDeviceId) {
      await getPlayData();
    }
  }, [authToken, currentDevice?.id, getPlayData, thisDeviceId, trackStopped]);

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

  const handlePlayTransferred = useCallback(() => {
    setCurrentDevice({
      id: thisDeviceId,
      name: THIS_DEVICE_NAME,
    });
  }, [thisDeviceId]);

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

  const trackContext = useMemo(() => {
    if (!track) {
      return '';
    }
    return track?.currently_playing_type === 'track'
      ? track?.item.artists.map((artist) => artist.name).join(', ')
      : track?.item?.show?.name;
  }, [track]);

  const nowPlayingBarImage = useMemo(
    () => (
      <Image
        alt="currently playing album art blurred"
        key={currentTrackImageToUse}
        src={currentTrackImageToUse}
        width={64}
        height={64}
      />
    ),
    [currentTrackImageToUse],
  );

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
            style={{ width: '100vw', height: '100vh' }}
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
            style={{ width: '100vw', height: '100vh' }}
          />
        </div>
      )}
      <div
        className={classNames(
          'fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black to-slate-800 opacity-0 transition-opacity duration-1000 -z-20',
          { 'opacity-100': trackStopped },
        )}
      />
      <div
        className={classNames(
          'border-solid border-t-1 border-gray-600 px-4 py-1',
          styles['now-playing-bar'],
          {
            [styles.visible]: !!track,
          },
        )}
      >
        <div className="flex flex-grow overflow-hidden">
          <div className="flex-none">
            {track &&
              (track.currently_playing_type === 'track' ? (
                <Link href="/library/ai">{nowPlayingBarImage}</Link>
              ) : (
                nowPlayingBarImage
              ))}
          </div>
          <div className="flex flex-col max-md:ml-2 ml-4 justify-center basis-1/2 overflow-hidden">
            <div className="lg:text-xl md:text-lg whitespace-nowrap text-ellipsis overflow-hidden">
              {track?.item.name}
            </div>
            <div className="text-sm text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
              {trackContext}
            </div>
          </div>
        </div>
        <div className="controls flex items-center flex-none">
          {currentDevice?.name && currentDevice.name !== THIS_DEVICE_NAME && (
            <TransferPlaybackDropdown onPlayTransferred={handlePlayTransferred}>
              <div className="text-sm text-primary mr-4 ">
                <span className="max-lg:hidden visible">Playing on </span>
                {currentDevice?.name}
              </div>
            </TransferPlaybackDropdown>
          )}
          {!player && !playerInitialisationFailed ? (
            <div className="loading loading-dots loading-md"></div>
          ) : trackStopped ? (
            <button onClick={handlePlay}>
              <Image alt="play" src={playButton} width={48} height={48} />
            </button>
          ) : (
            <button onClick={handlePause}>
              <Image alt="pause" src={pauseButton} width={48} height={48} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CurrentlyPlaying;
