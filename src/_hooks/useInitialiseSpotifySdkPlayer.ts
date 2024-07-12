import { useCookies } from 'next-client-cookies';
import { useEffect, useRef, useState } from 'react';
import { THIS_DEVICE_NAME } from './useGetActiveDevice';
import AppCookies from '@/_constants/cookies';

interface UseInitialiseSpotifySdkPlayerArgs {
  onInitialised: (player: Spotify.Player, deviceId: string) => void;
}

const useInitialiseSpotifySdkPlayer = ({
  onInitialised,
}: UseInitialiseSpotifySdkPlayerArgs) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const cookies = useCookies();
  const deviceId = useRef<string>();

  useEffect(() => {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log(cookies.get(AppCookies.SPOTIFY_AUTH_TOKEN));

      const _player = new Spotify.Player({
        name: THIS_DEVICE_NAME,
        getOAuthToken: (cb: any) => {
          cb(cookies.get(AppCookies.SPOTIFY_AUTH_TOKEN));
        },
        volume: 0.5,
      });
      _player.on('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
      });

      _player.on('playback_error', ({ message }) => {
        console.error('Failed to perform playback', message);
      });

      _player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log(
          'Spotify Web Playback SDK ready with Device ID ',
          device_id,
        );
        deviceId.current = device_id;
        setPlayer(_player);
      });

      return () => {
        _player.removeListener('ready');
        _player.removeListener('player_state_changed');
      };
    };
  }, [cookies]);

  useEffect(() => {
    if (!player) {
      return;
    }
    player.connect().then((success) => {
      if (success && deviceId.current) {
        onInitialised(player, deviceId.current);
      }
    });

    return () => {
      player.disconnect();
    };
  }, [onInitialised, player]);
};

export default useInitialiseSpotifySdkPlayer;
