import { useContext } from 'react';
import CurrentTrackContext, {
  CurrentTrackContextType,
} from './CurrentTrackContext';

const useCurrentTrackContext: () => CurrentTrackContextType = () =>
  useContext(CurrentTrackContext);

export default useCurrentTrackContext;
