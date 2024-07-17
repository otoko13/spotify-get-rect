import { useContext } from 'react';
import CurrentTrackContext, {
  CurrentTrackContextType,
} from './CurrentTrackContext';

const usePlayerContext: () => CurrentTrackContextType = () =>
  useContext(CurrentTrackContext);

export default usePlayerContext;
