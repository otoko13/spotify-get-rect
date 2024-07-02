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
  const [use3D, setUse3D] = useState(true);

  const authToken = useGetAuthToken();

  const fetchMoreAlbums = useCallback(
    async (url: string) => {
      setLoading(true);
      setUrlsFetched((fetchedUrls) => [...fetchedUrls, url]);
      const response = await fetch(url, {
        headers: {
          Authorization: authToken,
        },
      });

      if (response.status !== 200) {
        return;
      }

      const data = await response.json();

      if (response.status !== 200) {
        setLoading(false);
        return;
      }

      setFetchUrl(data.next);

      const sortedAlbums: SpotifyAlbum[] = data.albums.items.filter(
        (a: SpotifyAlbum) => a.album_type !== 'single',
      );

      setLoading(false);
      setAlbums((albums) => [...albums, ...sortedAlbums]);
    },
    [authToken],
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
  }, []);

  return (
    <DualModeAlbumsDisplay
      albums={albums}
      loading={loading}
      fetchMoreForCanvas={fetchMoreForCanvas}
    />
  );
}
