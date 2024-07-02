'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyAlbum, SpotifyTrack } from '@/types';
import { useCallback, useState } from 'react';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';
import DualModeAlbumsDisplay from '../dualModeAlbumsDisplay/DualModeAlbumsDisplay';

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
        `recommendations?limit=48&seed_tracks=${seedTrackIds.join(',')}`,
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
