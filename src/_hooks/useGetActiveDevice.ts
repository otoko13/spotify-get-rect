import { useCallback, useEffect } from 'react';
import useGetAuthToken from './useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyDevice } from '@/types';
import { useCookies } from 'next-client-cookies';
import AppCookies from '@/_constants/cookies';

export type GetActiveDevice = () => Promise<{
  name: string | undefined | null;
  id: string | undefined | null;
}>;

export const THIS_DEVICE_NAME = 'Spotify Get Rect';

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
    if (!devices?.length && cookies.get(AppCookies.THIS_DEVICE_ID)) {
      return {
        name: THIS_DEVICE_NAME,
        id: cookies.get(AppCookies.THIS_DEVICE_ID),
      };
    }

    // if we do have an active device, use that
    const activeDevice = devices.find((d) => d.is_active);
    if (activeDevice) {
      cookies.set(AppCookies.ACTIVE_DEVICE_ID, activeDevice.id);
      cookies.set(AppCookies.ACTIVE_DEVICE_NAME, activeDevice.name);
      return {
        name: activeDevice.name,
        id: activeDevice.id,
      };
    } else {
      cookies.remove(AppCookies.ACTIVE_DEVICE_ID);
      cookies.remove(AppCookies.ACTIVE_DEVICE_NAME);
    }

    // if no active devices elsewhere, return this device, which might be empty
    return {
      id: cookies.get(AppCookies.THIS_DEVICE_ID),
      name: THIS_DEVICE_NAME,
    };
  }, [authToken, cookies]);

  return getActiveDevice;
};

export default useGetActiveDevice;
