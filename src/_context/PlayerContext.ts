import { createContext } from 'react';

export type PlayerContextType = {
  loading?: boolean;
  player?: Spotify.Player;
};

const PlayerContext = createContext<PlayerContextType>({
  loading: false,
  player: undefined,
});

export default PlayerContext;
