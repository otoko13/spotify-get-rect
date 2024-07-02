import { useCallback, useEffect } from 'react';
import useGetAuthToken from './useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyDevice } from '@/types';
import { useCookies } from 'next-client-cookies';

export type GetActiveDevice = () => Promise<{
  name: string | undefined;
  id: string | undefined;
}>;

const useGetActiveDevice = () => {
  const authToken = useGetAuthToken();
  const cookies = useCookies();

  const getActiveDevice: GetActiveDevice = useCallback(async () => {
    const devicesResponse = await clientSpotifyFetch('me/player/devices', {
      headers: {
        Authorization: authToken,
      },
    });

    const devicesData = await devicesResponse.json();
    const { devices }: { devices: SpotifyDevice[] } = devicesData;

    if (!devices?.length) {
      return {
        name: cookies.get('active-device-name'),
        id: cookies.get('active-device-id'),
      };
    }

    const activeDevice = devices.find((d) => d.is_active) ?? devices[0];
    cookies.set('active-device-id', activeDevice.id);
    cookies.set('active-device-name', activeDevice.name);
    return {
      name: activeDevice.name,
      id: activeDevice.id,
    };
  }, [authToken, cookies]);

  return getActiveDevice;
};

export default useGetActiveDevice;
