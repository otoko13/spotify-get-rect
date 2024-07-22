'use client';

import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { ReactNode, useCallback } from 'react';

interface TransferPlaybackDropdownProps {
  children: ReactNode;
  onPlayTransferred: () => void;
}

export default function TransferPlaybackDropdown({
  children,
  onPlayTransferred,
}: TransferPlaybackDropdownProps) {
  const authToken = useGetAuthToken();
  const { player, deviceId } = usePlayerContext();

  const handleClick = useCallback(async () => {
    const elem = document.activeElement as HTMLDivElement;
    if (elem) {
      elem?.blur();
    }

    if (!(deviceId && player)) {
      return;
    }

    player.activateElement();

    const response = await clientSpotifyFetch(`me/player`, {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
      }),
      headers: {
        Authorization: authToken,
      },
    });
    if (response.status === 200 || response.status === 204) {
      onPlayTransferred();
    }
  }, [authToken, deviceId, onPlayTransferred, player]);

  return (
    <details className="dropdown dropdown-top dropdown-end">
      <summary tabIndex={0} role="button" className="no-marker">
        {children}
      </summary>
      {deviceId && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-none z-[1] w-52 p-2 shadow w-auto"
          style={{ bottom: '150%' }}
        >
          <li>
            <button className="justify-end text-nowrap" onClick={handleClick}>
              Play here
            </button>
          </li>
        </ul>
      )}
    </details>
  );
}
