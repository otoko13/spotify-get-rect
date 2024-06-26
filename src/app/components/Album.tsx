'use client';

import Image from 'next/image';
import { SpotifyAlbum } from '../types';
import useGetAuthToken from '../hooks/useGetAuthToken';
import { useCallback } from 'react';

interface AlbumProps {
  album: SpotifyAlbum;
}

const Album = ({ album }: AlbumProps) => {
  const authToken = useGetAuthToken();

  const handleClicked = useCallback(
    async (spotifyId: string) => {
      return await fetch(`https://api.spotify.com/v1/me/player/play`, {
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
