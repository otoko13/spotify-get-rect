'use client';

import Image from 'next/image';
import { SpotifyAlbum } from '../types';
import Link from 'next/link';
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
    <div className="Album">
      <button onClick={() => handleClicked(album.uri)}>
        <Image
          src={album.images[0].url}
          alt={album.name}
          height={200}
          width={200}
        />
      </button>
    </div>
  );
};

export default Album;
