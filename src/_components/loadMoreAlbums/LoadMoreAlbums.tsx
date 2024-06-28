'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyAlbum } from '@/types';
import { useEffect, useState } from 'react';
import AlbumsDisplay from '../albumsDisplay/AlbumsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';

interface LoadMoreAlbumsProps {
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

  useEffect(() => {
    const fetchMoreAlbums = async (url: string) => {
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
    };

    const handleScroll = (event: any) => {
      const target = event.target.scrollingElement as HTMLElement;

      if (
        target.scrollTop >=
          (target.scrollHeight - target.clientHeight) * 0.95 &&
        fetchUrl &&
        !urlsFetched.includes(fetchUrl)
      ) {
        fetchMoreAlbums(fetchUrl);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [authToken, fetchUrl, loading, urlsFetched]);

  return (
    <>
      <AlbumsDisplay albums={albums} />
      {loading && <AlbumsLoading />}
    </>
  );
}
