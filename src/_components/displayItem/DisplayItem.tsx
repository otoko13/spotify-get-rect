'use client';

import AppCookies from '@/_constants/cookies';
import useGetActiveDevice from '@/_hooks/useGetActiveDevice';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import {
  clientSpotifyFetch,
  waitForSpotifySdkPlayer,
} from '@/_utils/clientUtils';
import { useCookies } from 'next-client-cookies';
import Image from 'next/image';
import { useCallback } from 'react';

export interface BaseDisplayItem {
  id: string;
  images: { url: string }[];
  name: string;
  uri: string;
}

interface DisplayItemProps<T extends BaseDisplayItem> {
  item: T;
}

export default function DisplayItem<T extends BaseDisplayItem>({
  item,
}: DisplayItemProps<T>) {
  const authToken = useGetAuthToken();
  const getActiveDevice = useGetActiveDevice();
  const cookies = useCookies();

  const handleClicked = useCallback(
    async (spotifyId: string) => {
      const { id: deviceId } = await getActiveDevice();

      let deviceToUse = deviceId;

      if (!deviceId && !window.spotifySdkPlayerReady) {
        await waitForSpotifySdkPlayer();
        deviceToUse = cookies.get(AppCookies.THIS_DEVICE_ID);
      }

      return await clientSpotifyFetch(
        `me/player/play${deviceToUse ? `?device_id=${deviceToUse}` : ''}`,
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
    [authToken, getActiveDevice, cookies],
  );

  return (
    <button onClick={() => handleClicked(item.uri)}>
      {item.images?.[0]?.url && (
        <Image
          className="shadow-lg"
          src={item.images[0].url}
          alt={item.name}
          width={0}
          height={0}
          priority
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      )}
    </button>
  );
}
