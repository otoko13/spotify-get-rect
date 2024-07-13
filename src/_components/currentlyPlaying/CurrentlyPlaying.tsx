'use client';

import { THIS_DEVICE_NAME } from '@/_context/playerContext/PlayerContext';
import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import pauseButton from '@/_images/pause.svg';
import playButton from '@/_images/play.svg';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyImage, SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import { useCookies } from 'next-client-cookies';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TransferPlaybackDropdown from '../transferPlaybackDropdown/TransferPlaybackDropdown';
import styles from './currentlyPlaying.module.scss';

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
    return newTrack.item.album.id !== originalTrack.item.album.id;
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

const CurrentlyPlaying = () => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();
  const [lastTrack, setLastTrack] = useState<SpotifyPlayerTrack>();
  const [trackStopped, setTrackStopped] = useState(true);
  const [device, setDevice] = useState<SpotifyDeviceSimple>();

  const { player, deviceId: thisDeviceId } = usePlayerContext();

  const cookies = useCookies();

  const updateTracks = useCallback(
    (newTrack: SpotifyPlayerTrack) => {
      if (!track) {
        setTrack(newTrack);
        return;
      }

      // keep the last track so we can fade out its image
      if (track && trackCoverHasChanged(newTrack, track)) {
        setLastTrack(track);
      }
      // only set the track if it has changed, otherwise we trigger
      // rerenders with the state change
      if (track.item.id !== newTrack.item.id) {
        setTrack(newTrack);
      }
    },
    [track],
  );

  const getPlayData = useCallback(async () => {
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

    if (
      data.device &&
      data.device.id === thisDeviceId &&
      data.device.id !== thisDeviceId
    ) {
      setDevice({
        id: thisDeviceId,
        name: THIS_DEVICE_NAME,
      });
      return;
    }

    if (device?.id && device?.id !== data.device.id) {
      setDevice({
        id: data.device.id,
        name: data.device.name,
      });
    }

    if (data.is_playing) {
      setTrackStopped(false);
      updateTracks(data);
    } else {
      setTrackStopped(true);
    }
  }, [authToken, device?.id, thisDeviceId, updateTracks]);

  const handlePlay = useCallback(async () => {
    const { id } = await getTargetDevice();

    const deviceToUse = id ?? device?.id;

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

    getPlayData();
  }, [authToken, device?.id, getPlayData, player]);

  const handlePause = useCallback(async () => {
    await clientSpotifyFetch('me/player/pause', {
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
    });

    getPlayData();
  }, [authToken, getPlayData]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const pollPlayData = async () => {
      await getPlayData();
      timeout = setTimeout(pollPlayData, 3500);
    };

    // const interval = setInterval(async () => {
    //   await getPlayData();
    // }, 3500);

    getPlayData();
    pollPlayData();

    return () => {
      clearTimeout(timeout);
    };
  }, [getPlayData]);

  useEffect(() => {
    if (!player) {
      return;
    }

    player.addListener('player_state_changed', (response) => {
      if (!response) {
        return;
      }

      const {
        paused,
        track_window: { current_track },
      } = response;

      setTrackStopped(!!paused);

      if (!paused) {
        setDevice({
          id: thisDeviceId,
          name: THIS_DEVICE_NAME,
        });
      }

      if (current_track) {
        const convertedTrack = convertSdkTrackToApiTrack(current_track);

        updateTracks(convertedTrack);
      }
    });
  }, [cookies, player, thisDeviceId, updateTracks]);

  const handlePlayTransferred = useCallback(() => {
    setDevice({
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

  return (
    <>
      {lastTrack && (
        <div>
          <Image
            alt="currently playing album art blurred"
            className="fixed top-0 left-0 blur-3xl opacity-67 -z-20"
            key={lastTrackImageToUse}
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
          'border-solid border-t-1 border-gray-600',
          styles['now-playing-bar'],
          {
            [styles.visible]: !!track,
          },
        )}
      >
        <div className="flex">
          <div>
            {track && (
              <Image
                alt="currently playing album art blurred"
                key={currentTrackImageToUse}
                src={currentTrackImageToUse}
                width={64}
                height={64}
              />
            )}
          </div>
          <div className="flex flex-col ml-4 justify-center">
            <div className="lg:text-xl md:text-lg">{track?.item.name}</div>
            <div className="text-sm text-slate-300">{trackContext}</div>
          </div>
        </div>
        <div className="controls flex items-center">
          {device?.name && device.name !== THIS_DEVICE_NAME && (
            <TransferPlaybackDropdown onPlayTransferred={handlePlayTransferred}>
              <div className="text-sm text-primary mr-4 ">
                <span className="max-lg:hidden visible">Playing on </span>
                {device?.name}
              </div>
            </TransferPlaybackDropdown>
          )}
          {!player ? (
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
function getTargetDevice(): { id: any } | PromiseLike<{ id: any }> {
  throw new Error('Function not implemented.');
}
