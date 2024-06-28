'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './currentlyPlaying.module.scss';
import playButton from '@/_images/play.svg';
import pauseButton from '@/_images/pause.svg';

const CurrentlyPlaying = () => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();
  const [lastTrack, setLastTrack] = useState<SpotifyPlayerTrack>();
  const [trackStopped, setTrackStopped] = useState(true);

  const handlePlayToggled = useCallback(async () => {
    await clientSpotifyFetch('/me/player/pause', {
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
    });
  }, [authToken]);

  useEffect(() => {
    const getPlayData = async () => {
      const response = await clientSpotifyFetch('me/player', {
        headers: {
          Authorization: authToken,
        },
      });

      const data: SpotifyPlayerTrack = await response?.json();

      if (response.status === 200 && data.is_playing) {
        setTrackStopped(false);

        // keep the last track so we can fade out its image
        if (track && track?.item.album.id !== data.item.album.id) {
          setLastTrack(track);
        }

        setTrack(data);
      } else {
        setTrackStopped(true);
      }
    };

    const interval = setInterval(async () => {
      getPlayData();
    }, 2500);

    getPlayData();

    return () => clearInterval(interval);
  }, [authToken, track]);

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
            <div className="text-2xl">{track?.item.name}</div>
            <div className="text-md text-slate-300">
              {track?.item.artists.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </div>
        <div className="controls flex items-center">
          <button onClick={handlePlayToggled}>
            {trackStopped ? (
              <Image alt="play" src={playButton} width={48} height={48} />
            ) : (
              <Image alt="pause" src={pauseButton} width={48} height={48} />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CurrentlyPlaying;
