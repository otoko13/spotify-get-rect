'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyAlbum, SpotifyTrack } from '@/types';
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

      const topData = await response.json();

      if (response.status !== 200) {
        setLoading(false);
        return;
      }

      setFetchUrl(topData.next);

      const seedTrackIds = topData.items.map((t: SpotifyTrack) => t.id);

      const response2 = await clientSpotifyFetch(
        `recommendations?limit=50&seed_tracks=${seedTrackIds.join(',')}`,
        {
          headers: {
            Authorization: authToken,
          },
        },
      );

      const recommendationData = await response2.json();

      const recommendations: SpotifyAlbum[] = recommendationData.tracks.map(
        (t: SpotifyTrack) => t.album,
      );

      setLoading(false);
      setAlbums((albums) => [...albums, ...recommendations]);
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
