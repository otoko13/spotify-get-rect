import { useContext } from 'react';
import ThreeDOptionsContext, {
  ThreeDOptionsContextType,
} from './ThreeDOptionsContext';

const useThreeDOptionsContext: () => ThreeDOptionsContextType = () =>
  useContext(ThreeDOptionsContext);

export default useThreeDOptionsContext;
