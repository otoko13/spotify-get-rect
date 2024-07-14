import { createContext } from 'react';

export const THIS_DEVICE_NAME = 'Spotify Get Rect';

export type PlayerContextType = {
  player?: Spotify.Player;
  deviceId?: string;
};

const PlayerContext = createContext<PlayerContextType>({
  player: undefined,
  deviceId: undefined,
});

export default PlayerContext;
