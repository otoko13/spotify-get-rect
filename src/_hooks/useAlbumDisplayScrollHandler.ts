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
  useEffect(() => {
    const handleScroll = (event: any) => {
      const target = event.target.scrollingElement as HTMLElement;

      if (
        !disabled &&
        target.scrollTop >=
          (target.scrollHeight - target.clientHeight) * 0.95 &&
        fetchUrl &&
        !urlsFetched.includes(fetchUrl)
      ) {
        onBottom(fetchUrl);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [fetchUrl, urlsFetched, onBottom, disabled]);
};

export default useAlbumDisplayScrollHandler;
