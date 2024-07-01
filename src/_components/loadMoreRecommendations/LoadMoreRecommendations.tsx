'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyAlbum, SpotifyTrack } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import AlbumsDisplay from '../albumsDisplay/AlbumsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';

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
