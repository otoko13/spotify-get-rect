'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { useCookies } from 'next-client-cookies';
import { ReactNode, useCallback } from 'react';

interface TransferPlaybackDropdownProps {
  children: ReactNode;
}

export default function TransferPlaybackDropdown({
  children,
}: TransferPlaybackDropdownProps) {
  const cookies = useCookies();
  const authToken = useGetAuthToken();

  const handleClick = useCallback(async () => {
    const thisDeviceId = cookies.get('this-device-id');

    const response = await clientSpotifyFetch(`me/player`, {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [thisDeviceId],
      }),
      headers: {
        Authorization: authToken,
      },
    });
  }, [authToken, cookies]);

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
