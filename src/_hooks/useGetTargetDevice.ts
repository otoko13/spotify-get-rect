import { useCallback } from 'react';
import useGetAuthToken from './useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyDevice } from '@/types';
import usePlayerContext from '@/_context/playerContext/usePlayerContext';

export type GetTargetDevice = () => Promise<string | undefined | null>;

const useGetTargetDevice = () => {
  const authToken = useGetAuthToken();
  const { deviceId: thisDeviceId } = usePlayerContext();

  const getTargetDevice: GetTargetDevice = useCallback(async () => {
    const devicesResponse = await clientSpotifyFetch('me/player/devices', {
      headers: {
        Authorization: authToken,
      },
    });

    const devicesData = await devicesResponse.json();
    const { devices }: { devices: SpotifyDevice[] } = devicesData;
    const activeDevice = devices?.find((d) => d.is_active);

    return activeDevice ? activeDevice.id : thisDeviceId;
  }, [authToken, thisDeviceId]);

  return getTargetDevice;
};

export default useGetTargetDevice;
