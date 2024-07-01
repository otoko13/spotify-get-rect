import { useCallback } from 'react';
import useGetAuthToken from './useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyDevice } from '@/types';
import { useCookies } from 'next-client-cookies';

const useGetActiveDevice = () => {
  const authToken = useGetAuthToken();
  const cookies = useCookies();

  const getActiveDevice = useCallback(async () => {
    const devicesResponse = await clientSpotifyFetch('me/player/devices', {
      headers: {
        Authorization: authToken,
      },
    });

    const devicesData = await devicesResponse.json();
    const { devices }: { devices: SpotifyDevice[] } = devicesData;

    let activeDevice: SpotifyDevice | undefined;

    if (devices?.length) {
      activeDevice = devices.find((d) => d.is_active);
      if (!activeDevice) {
        activeDevice = devices[0];
      }
    }

    if (activeDevice) {
      cookies.set('active-device-id', activeDevice.id);
      cookies.set('active-device-name', activeDevice.name);
      return activeDevice;
    }

    return {
      name: cookies.get('active-device-name'),
      id: cookies.get('active-device-id'),
    };
  }, [authToken, cookies]);

  return getActiveDevice;
};

export default useGetActiveDevice;
