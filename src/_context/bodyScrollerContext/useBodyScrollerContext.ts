import { useContext } from 'react';
import BodyScrollerContext, {
  BodyScrollerContextType,
} from './BodyScrollerContext';

const useBodyScrollerContext: () => BodyScrollerContextType = () =>
  useContext(BodyScrollerContext);

export default useBodyScrollerContext;
