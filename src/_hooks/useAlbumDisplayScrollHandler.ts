import useBodyScrollerContext from '@/_context/bodyScrollerContext/useBodyScrollerContext';
import { OverlayScrollbars } from 'overlayscrollbars';
import { useEffect } from 'react';

interface UseAlbumDisplayScrollHandlerArgs {
  disabled?: boolean;
  fetchUrl?: string;
  urlsFetched: string[];
  onBottom: (url: string) => void;
}

const useAlbumDisplayScrollHandler = ({
  disabled,
  fetchUrl,
  urlsFetched,
  onBottom,
}: UseAlbumDisplayScrollHandlerArgs) => {
  const { scroller } = useBodyScrollerContext();

  useEffect(() => {
    const handleScroll = (instance: OverlayScrollbars) => {
      if (disabled || !fetchUrl || urlsFetched.includes(fetchUrl)) {
        return;
      }

      const { viewport } = instance.elements();
      const { scrollHeight, clientHeight, scrollTop } = viewport;
      if (scrollTop >= (scrollHeight - clientHeight) * 0.95) {
        onBottom(fetchUrl);
      }
    };

    scroller?.on('scroll', handleScroll);

    return () => {
      scroller?.off('scroll', handleScroll);
    };
  }, [fetchUrl, urlsFetched, onBottom, disabled, scroller]);
};

export default useAlbumDisplayScrollHandler;
