'use client';

import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useGetTargetDevice from '@/_hooks/useGetTargetDevice';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export interface BaseDisplayItem {
  id: string;
  images: { url: string }[];
  name: string;
  uri: string;
}

interface DisplayItemProps<T extends BaseDisplayItem> {
  item: T;
}

interface PlayItemArgs {
  spotifyId: string;
  deviceId: string;
  authToken: string;
}

const playItem = async ({ spotifyId, deviceId, authToken }: PlayItemArgs) => {
  return clientSpotifyFetch(
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
};

export default function DisplayItem<T extends BaseDisplayItem>({
  item,
}: DisplayItemProps<T>) {
  const authToken = useGetAuthToken();
  const getTargetDevice = useGetTargetDevice();
  const [queuedItem, setQueuedItem] = useState<string>();
  const { player, deviceId: thisDeviceId } = usePlayerContext();

  const handleClicked = useCallback(
    async (spotifyId: string) => {
      const targetDeviceId = await getTargetDevice();

      if (!targetDeviceId) {
        setQueuedItem(spotifyId);
        return;
      }

      player?.activateElement();

      return await playItem({
        authToken,
        deviceId: targetDeviceId,
        spotifyId,
      });
    },
    [authToken, getTargetDevice, player],
  );

  useEffect(() => {
    if (queuedItem && thisDeviceId && player) {
      player.activateElement();
      playItem({ spotifyId: queuedItem, authToken, deviceId: thisDeviceId });
      setQueuedItem(undefined);
    }
  }, [authToken, player, queuedItem, thisDeviceId]);

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
