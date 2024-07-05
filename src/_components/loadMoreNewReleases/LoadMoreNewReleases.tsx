'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { SpotifyAlbum } from '@/types';
import { useCallback, useState } from 'react';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';
import { LoadMoreAlbumsProps } from '../loadMoreAlbums/LoadMoreAlbums';
import DualModeAlbumsDisplay from '../dualModeAlbumsDisplay/DualModeAlbumsDisplay';

export default function LoadMoreNewReleases({
  initialAlbums,
  nextUrl,
}: LoadMoreAlbumsProps) {
  const [fetchUrl, setFetchUrl] = useState<string | undefined>(nextUrl);
  const [loading, setLoading] = useState(false);
  const [urlsFetched, setUrlsFetched] = useState<string[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>(initialAlbums);

  const authToken = useGetAuthToken();

  const fetchMoreAlbums = useCallback(
    async (url: string) => {
      if (urlsFetched.includes(url)) {
        return;
      }
      setLoading(true);
      setUrlsFetched((fetchedUrls) => [...fetchedUrls, url]);
      const response = await fetch(url, {
        headers: {
          Authorization: authToken,
        },
      });

      if (response.status !== 200) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setFetchUrl(data.next !== url ? data.next : undefined);

      const sortedAlbums: SpotifyAlbum[] = data.albums.items.filter(
        (a: SpotifyAlbum) => a.album_type !== 'single',
      );

      setLoading(false);
      setAlbums((albums) => [...albums, ...sortedAlbums]);
    },
    [authToken, urlsFetched],
  );

  useAlbumDisplayScrollHandler({
    fetchUrl,
    urlsFetched,
    onBottom: fetchMoreAlbums,
  });

  const fetchMoreForCanvas = useCallback(() => {
    if (fetchUrl) {
      fetchMoreAlbums(fetchUrl);
    }
  }, [fetchMoreAlbums, fetchUrl]);

  return (
    <DualModeAlbumsDisplay
      albums={albums}
      loading={loading}
      noMoreAlbums={!fetchUrl}
      fetchMoreForCanvas={fetchMoreForCanvas}
    />
  );
}
