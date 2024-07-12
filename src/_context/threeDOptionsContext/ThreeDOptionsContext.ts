import { createContext } from 'react';

export type ThreeDOptionsContextType = {
  use3d?: boolean;
};

const ThreeDOptionsContext = createContext<ThreeDOptionsContextType>({
  use3d: false,
});

export default ThreeDOptionsContext;
