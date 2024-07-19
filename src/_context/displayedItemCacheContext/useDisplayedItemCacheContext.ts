import { useContext } from 'react';
import DisplayedItemCacheContext, {
  DisplayedItemCacheContextType,
} from './DisplayedItemCacheContext';

const useDisplayedItemCacheContext: () => DisplayedItemCacheContextType = () =>
  useContext(DisplayedItemCacheContext);

export default useDisplayedItemCacheContext;
