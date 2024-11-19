'use client';

import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useGetTargetDevice from '@/_hooks/useGetTargetDevice';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SpotifyAlbum } from '@/types';
import classNames from 'classnames';
import styles from './displayItem.module.scss';

function isAlbum(
  toBeDetermined: BaseDisplayItem,
): toBeDetermined is SpotifyAlbum {
  return !!(toBeDetermined as SpotifyAlbum).artists;
}

export interface BaseDisplayItem {
  id: string;
  images: { url: string; width: number; height: number }[];
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
      body: JSON.stringify({
        context_uri: spotifyId,
      }),
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
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
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
      playItem({ authToken, deviceId: thisDeviceId, spotifyId: queuedItem });
      setQueuedItem(undefined);
    }
  }, [authToken, player, queuedItem, thisDeviceId]);

  const artistInfo = useMemo(() => {
    return isAlbum(item) ? item.artists[0].name : '';
  }, [item]);

  return (
    <button
      onClick={() => handleClicked(item.uri)}
      onMouseOver={() => setTooltipOpen(true)}
      onMouseOut={() => setTooltipOpen(false)}
      onBlur={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
    >
      {item.images?.[0]?.url && (
        <div className="relative">
          <Image
            className="shadow-lg animate-fast-fade-in -z-10"
            key={item.images[0].url}
            src={item.images[0].url}
            alt={item.name}
            width={0}
            height={0}
            priority
            sizes="100vw"
            style={{ height: 'auto', width: '100%' }}
          />
          {!process.env.DISABLE_TOOLTIPS && (
            <div className="w-full h-20 absolute bottom-0 overflow-hidden">
              <div
                className={classNames(
                  'flex flex-col h-full w-full items-start justify-center px-4 overflow-hidden absolute transition-all z-20 text-left',
                  { '-bottom-20': !tooltipOpen, 'bottom-0': tooltipOpen },
                )}
              >
                <div
                  className={classNames(
                    'absolute top-0 left-0 w-full h-full -z-10',
                    styles['blurred-bg'],
                  )}
                />
                {!!artistInfo.length && (
                  <div className="text-slate-300 text-lg whitespace-nowrap text-ellipsis w-full overflow-hidden">
                    {artistInfo}
                  </div>
                )}
                <div
                  className={classNames(
                    'text-slate-200 whitespace-nowrap text-ellipsis w-full overflow-hidden',
                  )}
                >
                  {item.name}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
