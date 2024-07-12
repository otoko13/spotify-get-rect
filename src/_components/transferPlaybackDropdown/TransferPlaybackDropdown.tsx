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
  const { deviceId } = usePlayerContext();

  const handleClick = useCallback(async () => {
    if (!deviceId) {
      return;
    }

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
  }, [authToken, deviceId, onPlayTransferred]);

  return (
    <div className="dropdown dropdown-top dropdown-end">
      <div tabIndex={0} role="button">
        {children}
      </div>
      {deviceId && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <button onClick={handleClick}>Transfer here</button>
          </li>
        </ul>
      )}
    </div>
  );
}
