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

    // if no devices returned, check if we have an id for this device
    if (!devices?.length && cookies.get('this-device-id')) {
      return {
        name: cookies.get('this-device-name'),
        id: cookies.get('this-device-id'),
      };
    }

    // if we do have an active device, use that
    const activeDevice = devices.find((d) => d.is_active);
    if (activeDevice) {
      cookies.set('active-device-id', activeDevice.id);
      cookies.set('active-device-name', activeDevice.name);
      return {
        name: activeDevice.name,
        id: activeDevice.id,
      };
    } else {
      cookies.remove('active-device-id');
      cookies.remove('active-device-name');
    }

    // if no active devices elsewhere, return this device, which might be empty
    return {
      id: cookies.get('this-device-id'),
      name: cookies.get('this-device-id'),
    };
  }, [authToken, cookies]);

  return getActiveDevice;
};

export default useGetActiveDevice;
