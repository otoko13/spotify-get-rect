import { useEffect } from 'react';

interface UseAlbumDisplayScrollHandlerArgs {
  fetchUrl?: string;
  urlsFetched: string[];
  onBottom: (url: string) => void;
}

const useAlbumDisplayScrollHandler = ({
  fetchUrl,
  urlsFetched,
  onBottom,
}: UseAlbumDisplayScrollHandlerArgs) => {
  useEffect(() => {
    const handleScroll = (event: any) => {
      const target = event.target.scrollingElement as HTMLElement;

      if (
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
  }, [fetchUrl, urlsFetched, onBottom]);
};

export default useAlbumDisplayScrollHandler;
