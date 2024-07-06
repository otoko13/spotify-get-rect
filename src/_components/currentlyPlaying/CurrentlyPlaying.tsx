'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack, SpotifyTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './currentlyPlaying.module.scss';
import playButton from '@/_images/play.svg';
import pauseButton from '@/_images/pause.svg';
import useGetActiveDevice from '@/_hooks/useGetActiveDevice';
import { useCookies } from 'next-client-cookies';
import TransferPlaybackDropdown from '../transferPlaybackDropdown/TransferPlaybackDropdown';

const THIS_DEVICE_PLAYER_NAME = 'Spotify Get Rect';

let player: Spotify.Player;

interface SpotifyDeviceSimple {
  id: string;
  name: string;
}

const convertSdkTrackToApiTrack = (
  sdkTrack: Spotify.Track,
): SpotifyPlayerTrack =>
  ({
    item: {
      album: sdkTrack.album,
      artists: sdkTrack.artists.map((sdkArtist) => ({
        uri: sdkArtist.uri,
        name: sdkArtist.name,
      })),
      id: sdkTrack.id,
      name: sdkTrack.name,
      uri: sdkTrack.uri,
    },
  } as SpotifyPlayerTrack);

const CurrentlyPlaying = () => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();
  const [lastTrack, setLastTrack] = useState<SpotifyPlayerTrack>();
  const [trackStopped, setTrackStopped] = useState(true);
  const [device, setDevice] = useState<SpotifyDeviceSimple>();

  const cookies = useCookies();

  const getActiveDevice = useGetActiveDevice();

  const updateTracks = useCallback(
    (newTrack: SpotifyPlayerTrack) => {
      if (!track) {
        setTrack(newTrack);
        return;
      }

      // keep the last track so we can fade out its image
      if (track && track?.item.album.id !== newTrack.item.album.id) {
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
    if (player) {
      player.activateElement();
    }

    const response = await clientSpotifyFetch('me/player', {
      headers: {
        Authorization: authToken,
      },
      method: 'GET',
    });

    // ignore too many requests responses
    if (response.status === 429) {
      return;
    }

    if (response.status !== 200) {
      setTrackStopped(true);
      return;
    }

    const thisDeviceId = cookies.get('this-device-id');

    const data: SpotifyPlayerTrack = await response?.json();

    if (data.device) {
      if (device?.id !== data.device.id) {
        setDevice({
          id: data.device.id,
          name: data.device.name,
        });
      }

      if (data.device.id === thisDeviceId) {
        // rely on the web playback sdk to change track data and playback status instead
        return;
      }
    }

    if (data.is_playing) {
      setTrackStopped(false);

      updateTracks(data);
    } else {
      setTrackStopped(true);
    }
  }, [authToken, cookies, device?.id, updateTracks]);

  const handlePlay = useCallback(async () => {
    const { id } = await getActiveDevice();

    const deviceToUse = id ?? device?.id;

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
      getPlayData();
    }, 3500);

    getPlayData();

    return () => clearInterval(interval);
  }, [getPlayData]);

  useEffect(() => {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      player = new Spotify.Player({
        name: THIS_DEVICE_PLAYER_NAME,
        getOAuthToken: (cb: any) => {
          cb(cookies.get('spotify-auth-token'));
        },
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log(
          'Spotify Web Playback SDK ready with Device ID ',
          device_id,
        );
        cookies.set('this-device-id', device_id);
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
        if (current_track) {
          console.log(current_track);

          const convertedTrack = convertSdkTrackToApiTrack(current_track);

          updateTracks(convertedTrack);
        }
      });

      player.connect();

      return () => {
        cookies.remove('this-device-id');
        player.removeListener('ready');
        player.removeListener('player_state_changed');
        player.disconnect();
      };
    };
  }, [cookies, updateTracks]);

  return (
    <>
      {lastTrack && (
        <Image
          alt="currently playing album art blurred"
          className="fixed top-0 left-0 blur-3xl opacity-67 -z-20"
          key={lastTrack.item.album.images[0].url}
          src={lastTrack.item.album.images[0].url}
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
          key={track.item.album.images[0].url}
          src={track.item.album.images[0].url}
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
                key={track.item.album.images[0].url}
                src={track.item.album.images[0].url}
                width={64}
                height={64}
              />
            )}
          </div>
          <div className="flex flex-col ml-4 justify-center">
            <div className="lg:text-xl md:text-lg">{track?.item.name}</div>
            <div className="text-sm text-slate-300">
              {track?.item.artists.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </div>
        <div className="controls flex items-center">
          {device?.name !== THIS_DEVICE_PLAYER_NAME && (
            <TransferPlaybackDropdown>
              <div className="text-sm text-primary mr-4 ">
                <span className="max-lg:hidden visible">Playing on </span>
                {device?.name}
              </div>
            </TransferPlaybackDropdown>
          )}
          {trackStopped ? (
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
