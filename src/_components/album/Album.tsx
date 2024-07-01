'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyAlbum, SpotifyDevice } from '@/types';
import { useCookies } from 'next-client-cookies';
import Image from 'next/image';
import { useCallback } from 'react';

interface AlbumProps {
  album: SpotifyAlbum;
}

const Album = ({ album }: AlbumProps) => {
  const authToken = useGetAuthToken();
  const cookies = useCookies();

  const handleClicked = useCallback(
    async (spotifyId: string) => {
      const devicesResponse = await clientSpotifyFetch('me/player/devices', {
        headers: {
          Authorization: authToken,
        },
      });

      const devicesData = await devicesResponse.json();
      const { devices }: { devices: SpotifyDevice[] } = devicesData;

      let deviceIdToUse: string | undefined;

      if (devices.length) {
        deviceIdToUse = devices.find((d) => d.is_active)?.id;
        if (!deviceIdToUse) {
          deviceIdToUse = devices[0].id;
        }
        if (!deviceIdToUse) {
          deviceIdToUse = cookies.get('active-device-id');
        }
      }

      return await clientSpotifyFetch(
        `me/player/play${deviceIdToUse ? `?device_id=${deviceIdToUse}` : ''}`,
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
    [authToken],
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
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </button>
    </div>
  );
};

export default Album;
