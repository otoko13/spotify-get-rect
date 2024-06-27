'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const CurrentlyPlaying = () => {
  const authToken = useGetAuthToken();
  const [track, setTrack] = useState<SpotifyPlayerTrack>();

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await clientSpotifyFetch('me/player', {
        headers: {
          Authorization: authToken,
        },
      });

      const data: SpotifyPlayerTrack = await response.json();

      if (response.status === 200 && data.is_playing) {
        setTrack(data);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [authToken]);

  return track ? (
    <Image
      alt="currently playing album art blurred"
      className="fixed top-0 left-0 blur-3xl opacity-60 -z-10"
      src={track.item.album.images[0].url}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100vw', height: '100vh' }}
    />
  ) : null;
};

export default CurrentlyPlaying;
