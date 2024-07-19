'use client';

import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useGetTargetDevice from '@/_hooks/useGetTargetDevice';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  useHover,
  useInteractions,
  offset,
  flip,
  shift,
  useFocus,
} from '@floating-ui/react';
import { SpotifyAlbum } from '@/types';
import classNames from 'classnames';

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
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    middleware: [offset(4), flip(), shift()],
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

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

  const artistInfo = useMemo(() => {
    return isAlbum(item) ? item.artists[0].name : '';
  }, [item]);

  return (
    <button onClick={() => handleClicked(item.uri)}>
      {item.images?.[0]?.url && (
        <>
          <Image
            className="shadow-lg animate-fast-fade-in -z-10"
            key={item.images[0].url}
            ref={refs.setReference}
            src={item.images[0].url}
            alt={item.name}
            width={0}
            height={0}
            priority
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            {...getReferenceProps()}
          />
          {tooltipOpen && (
            <div
              className="z-50 animate-fast-fade-in"
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <div className="flex flex-col">
                {!!artistInfo.length && (
                  <div className="text-slate-400 text-lg">{artistInfo}</div>
                )}
                <div
                  className={classNames('text-slate-300', {
                    'relative top-2': !artistInfo,
                  })}
                >
                  {item.name}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </button>
  );
}
