'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { SpotifyAlbum } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import AlbumsDisplay from '../albumsDisplay/AlbumsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';

export interface LoadMoreAlbumsProps {
  initialAlbums: SpotifyAlbum[];
  nextUrl?: string;
}

export default function LoadMoreAlbums({
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

      const sortedAlbums: SpotifyAlbum[] = data.items
        .sort(
          (
            a: SpotifyAlbum & { added_at: string },
            b: SpotifyAlbum & { added_at: string },
          ) => (a.added_at < b.added_at ? 1 : -1),
        )
        .map((d: { album: SpotifyAlbum }) => d.album)
        .filter((a: SpotifyAlbum) => a.album_type !== 'single');

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

  return (
    <>
      <AlbumsDisplay albums={albums} />
      {loading && <AlbumsLoading />}
    </>
  );
}
