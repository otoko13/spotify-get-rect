'use client';

import useGetActiveDevice from '@/_hooks/useGetActiveDevice';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyAlbum } from '@/types';
import Image from 'next/image';
import { useCallback } from 'react';

interface AlbumProps {
  album: SpotifyAlbum;
}

const Album = ({ album }: AlbumProps) => {
  const authToken = useGetAuthToken();
  const getActiveDevice = useGetActiveDevice();

  const handleClicked = useCallback(
    async (spotifyId: string) => {
      const { id: deviceId } = await getActiveDevice();

      return await clientSpotifyFetch(
        `me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            context_uri: spotifyId,
          }),
          headers: {
            Authorization: authToken,
          },
        },
      );
    },
    [authToken, getActiveDevice],
  );

  return (
    <div className="grid place-content-around">
      <button onClick={() => handleClicked(album.uri)}>
        <Image
          className="shadow-lg"
          src={album.images[0].url}
          alt={album.name}
          width={0}
          height={0}
          priority
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </button>
    </div>
  );
};

export default Album;
