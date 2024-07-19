'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch, getSpotifyUrl } from '@/_utils/clientUtils';
import { SpotifyAlbum, SpotifyTrack } from '@/types';
import { useCallback, useEffect, useState } from 'react';

type DataItem = {
  album: SpotifyAlbum;
};

const mapResponseToDisplayItems = (
  data: {
    tracks: DataItem[];
  },
  existingItems?: SpotifyAlbum[],
): SpotifyAlbum[] => {
  return data.tracks
    .map((track) => track.album)
    .filter(
      (album) =>
        (existingItems ?? []).findIndex(
          (existingAlbum) => existingAlbum.id === album.id,
        ) === -1,
    );
};

export default function RecommendationsPage() {
  const [initialUrl, setInitialUrl] = useState<string>();
  const authToken = useGetAuthToken();

  const getRecommendationsUrl = useCallback(async () => {
    const randomOffset = Math.floor(Math.random() * 100);

    const response = await clientSpotifyFetch(
      `me/top/tracks?limit=5&offset=${randomOffset}`,
      {
        headers: {
          Authorization: authToken,
        },
      },
    );

    const topData = await response.json();

    const seedTrackIds = topData.items.map((t: SpotifyTrack) => t.id);

    return getSpotifyUrl(
      `recommendations?limit=48&seed_tracks=${seedTrackIds.join(',')}`,
    );
  }, [authToken]);

  const setInitialRecommendationsUrl = useCallback(async () => {
    const url = await getRecommendationsUrl();

    setInitialUrl(url);
  }, [getRecommendationsUrl]);

  useEffect(() => {
    if (!initialUrl) {
      setInitialRecommendationsUrl();
    }
  }, [initialUrl, setInitialRecommendationsUrl]);

  const fetchMore = useCallback(async () => {
    const nextUrl = await getRecommendationsUrl();

    const response = await fetch(nextUrl, {
      headers: {
        Authorization: authToken,
      },
    });

    if (response.status !== 200) {
      return;
    }

    return await response.json();
  }, [authToken, getRecommendationsUrl]);

  return (
    <>
      <HtmlTitle pageTitle="Recommendations" />
      <LoadMoreDisplayItems
        customFetchMore={fetchMore}
        initialUrl={initialUrl}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
