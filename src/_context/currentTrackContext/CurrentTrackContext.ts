import { SpotifyPlayerTrack } from '@/types';
import { createContext } from 'react';

export const THIS_DEVICE_NAME = 'Spotify Get Rect';

export type CurrentTrackContextType = {
  track?: SpotifyPlayerTrack;
};

const PlayerContext = createContext<CurrentTrackContextType>({
  track: undefined,
});

export default PlayerContext;
