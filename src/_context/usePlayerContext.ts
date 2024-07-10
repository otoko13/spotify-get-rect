import { useContext } from 'react';
import PlayerContext, { PlayerContextType } from './PlayerContext';

const usePlayerContext: () => PlayerContextType = () =>
  useContext(PlayerContext);

export default usePlayerContext;
