import { OverlayScrollbars } from 'overlayscrollbars';
import { createContext } from 'react';

export const THIS_DEVICE_NAME = 'Spotify Get Rect';

export type BodyScrollerContextType = {
  scroller?: OverlayScrollbars;
};

const BodyScrollerContext = createContext<BodyScrollerContextType>({
  scroller: undefined,
});

export default BodyScrollerContext;
