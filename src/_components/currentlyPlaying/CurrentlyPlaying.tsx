'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const CurrentlyPlaying = () => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();
  const [lastTrack, setLastTrack] = useState<SpotifyPlayerTrack>();
  const [trackStopped, setTrackStopped] = useState(true);

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
    }, 2000);

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
    </>
  );
};

export default CurrentlyPlaying;
