import AppCookies from '@/_constants/cookies';
import { THIS_DEVICE_NAME } from '@/_context/playerContext/PlayerContext';
import { useCookies } from 'next-client-cookies';
import { useEffect } from 'react';

interface UseInitialiseSpotifySdkPlayerArgs {
  onInitialised: (player: Spotify.Player, deviceId: string) => void;
  onInitialisationFailed: () => void;
}

const useInitialiseSpotifySdkPlayer = ({
  onInitialised,
  onInitialisationFailed,
}: UseInitialiseSpotifySdkPlayerArgs) => {
  const cookies = useCookies();

  useEffect(() => {
    (window as any).onSpotifyWebPlaybackSDKReady = async () => {
      const player = new Spotify.Player({
        name: THIS_DEVICE_NAME,
        getOAuthToken: (cb: any) => {
          cb(cookies.get(AppCookies.SPOTIFY_AUTH_TOKEN));
        },
        volume: 0.5,
      });

      player.on('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
        onInitialisationFailed();
      });

      player.on('playback_error', ({ message }) => {
        console.error('Failed to perform playback', message);
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log(
          'Spotify Web Playback SDK ready with Device ID ',
          device_id,
        );
        onInitialised(player, device_id);
      });

      player.connect();

      return () => {
        player.removeListener('ready');
        player.removeListener('player_state_changed');
        player.disconnect();
      };
    };
  }, [cookies, onInitialisationFailed, onInitialised]);
};

export default useInitialiseSpotifySdkPlayer;
