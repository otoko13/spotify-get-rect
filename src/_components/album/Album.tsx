'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import spotifyFetch from '@/_utils/spotifyFetch';
import { SpotifyAlbum } from '@/types';
import Image from 'next/image';
import { useCallback } from 'react';

interface AlbumProps {
  album: SpotifyAlbum;
}

const Album = ({ album }: AlbumProps) => {
  const authToken = useGetAuthToken();

  const handleClicked = useCallback(
    async (spotifyId: string) => {
      return await spotifyFetch('me/player/play', {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: spotifyId,
        }),
        headers: {
          Authorization: authToken,
        },
      });
    },
    [authToken],
  );

  return (
    <div className="grid place-content-around">
      <button onClick={() => handleClicked(album.uri)}>
        <Image
          src={album.images[0].url}
          alt={album.name}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </button>
    </div>
  );
};

export default Album;
