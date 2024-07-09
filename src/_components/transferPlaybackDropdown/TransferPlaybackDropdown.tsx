'use client';

import AppCookies from '@/_constants/cookies';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { useCookies } from 'next-client-cookies';
import { ReactNode, useCallback } from 'react';

interface TransferPlaybackDropdownProps {
  children: ReactNode;
  onPlayTransferred: () => void;
}

export default function TransferPlaybackDropdown({
  children,
  onPlayTransferred,
}: TransferPlaybackDropdownProps) {
  const cookies = useCookies();
  const authToken = useGetAuthToken();

  const handleClick = useCallback(async () => {
    const thisDeviceId = cookies.get(AppCookies.THIS_DEVICE_ID);
    console.log('transfer', thisDeviceId);

    const response = await clientSpotifyFetch(`me/player`, {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [thisDeviceId],
      }),
      headers: {
        Authorization: authToken,
      },
    });
    if (response.status === 200 || response.status === 204) {
      onPlayTransferred();
    }
  }, [authToken, cookies, onPlayTransferred]);

  return (
    <div className="dropdown dropdown-top dropdown-end">
      <div tabIndex={0} role="button">
        {children}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <button onClick={handleClick}>Transfer here</button>
        </li>
      </ul>
    </div>
  );
}
