'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import {
  clientSpotifyFetch,
  setPlayerBeingUsed,
  setPlayerReady,
} from '@/_utils/clientUtils';
import { SpotifyImage, SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './currentlyPlaying.module.scss';
import playButton from '@/_images/play.svg';
import pauseButton from '@/_images/pause.svg';
import useGetActiveDevice, {
  THIS_DEVICE_NAME,
} from '@/_hooks/useGetActiveDevice';
import { useCookies } from 'next-client-cookies';
import TransferPlaybackDropdown from '../transferPlaybackDropdown/TransferPlaybackDropdown';
import AppCookies from '@/_constants/cookies';

let player: Spotify.Player;

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
  const [thisDeviceReady, setThisDeviceReady] = useState(false);

  const cookies = useCookies();

  const getActiveDevice = useGetActiveDevice();

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

  useEffect(() => {
    console.info('TRACK CHANGED!', track?.item.name);
  }, [track]);

  useEffect(() => {
    console.info('LAST TRACK CHANGED!', lastTrack?.item.name);
  }, [lastTrack]);

  const getPlayData = useCallback(async () => {
    if (window.playerBeingUsed) {
      return;
    }
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

    // rely on the web playback sdk to change track data and playback status instead
    const thisDeviceId = cookies.get(AppCookies.THIS_DEVICE_ID);
    if (
      window.playerBeingUsed ||
      (data.device && data.device.id === thisDeviceId)
    ) {
      if (device?.id !== thisDeviceId) {
        setDevice({
          id: cookies.get(AppCookies.THIS_DEVICE_ID),
          name: THIS_DEVICE_NAME,
        });
      }
      return;
    }

    if (device?.id !== data.device.id) {
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
  }, [device, cookies, authToken, updateTracks]);

  const handlePlay = useCallback(async () => {
    const { id } = await getActiveDevice();

    const deviceToUse = id ?? device?.id;

    if (player) {
      player.activateElement();
    }

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
  }, [authToken, device?.id, getActiveDevice, getPlayData]);

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
    const interval = setInterval(async () => {
      await getPlayData();
    }, 3500);

    getPlayData();

    return () => {
      clearInterval(interval);
    };
  }, [getPlayData]);

  useEffect(() => {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      player = new Spotify.Player({
        name: THIS_DEVICE_NAME,
        getOAuthToken: (cb: any) => {
          cb(cookies.get(AppCookies.SPOTIFY_AUTH_TOKEN));
        },
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log(
          'Spotify Web Playback SDK ready with Device ID ',
          device_id,
        );
        cookies.set(AppCookies.THIS_DEVICE_ID, device_id);
        setPlayerReady();
        setThisDeviceReady(true);
      });

      player.addListener('player_state_changed', (response) => {
        if (!response) {
          return;
        }

        const {
          paused,
          track_window: { current_track },
        } = response;

        setTrackStopped(!!paused);
        setPlayerBeingUsed(!!paused);

        if (!paused) {
          setDevice({
            id: cookies.get(AppCookies.THIS_DEVICE_ID),
            name: THIS_DEVICE_NAME,
          });
        }

        if (current_track) {
          const convertedTrack = convertSdkTrackToApiTrack(current_track);

          updateTracks(convertedTrack);
        }
      });

      player.on('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
      });

      player.on('playback_error', ({ message }) => {
        console.error('Failed to perform playback', message);
      });

      player.connect();

      return () => {
        player.removeListener('ready');
        player.removeListener('player_state_changed');
        player.disconnect();
      };
    };
  }, [cookies, updateTracks]);

  // remove old device cookie on initialisation since this will be reset each time the app
  // is refreshed
  useEffect(() => {
    cookies.remove(AppCookies.THIS_DEVICE_ID);
  }, [cookies]);

  const setInitialDevice = useCallback(async () => {
    const initialDevice = await getActiveDevice();
    setDevice(initialDevice);
  }, [getActiveDevice]);

  useEffect(() => {
    setInitialDevice();
  }, [setInitialDevice]);

  const handlePlayTransferred = useCallback(() => {
    setDevice({
      id: cookies.get(AppCookies.THIS_DEVICE_ID) as string,
      name: THIS_DEVICE_NAME,
    });
  }, [cookies]);

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

  const needToWaitForThisDeviceToBeReady = useMemo(() => {
    if (!trackStopped || thisDeviceReady) {
      return false;
    }
    return !device?.id;
  }, [trackStopped, thisDeviceReady, device]);

  return (
    <>
      {lastTrack && (
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
      )}
      {track && (
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
          {needToWaitForThisDeviceToBeReady ? (
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
