import { createContext } from 'react';

export type PlayerContextType = {
  player?: Spotify.Player;
  deviceId?: string;
};

const PlayerContext = createContext<PlayerContextType>({
  player: undefined,
  deviceId: undefined,
});

export default PlayerContext;
