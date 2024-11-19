import { createContext } from 'react';

export const THIS_DEVICE_NAME = 'Spotify Get Rect';

export type PlayerContextType = {
  player?: Spotify.Player;
  deviceId?: string;
  initialisationFailed: boolean;
};

const PlayerContext = createContext<PlayerContextType>({
  deviceId: undefined,
  initialisationFailed: false,
  player: undefined,
});

export default PlayerContext;
