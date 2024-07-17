'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch, getSpotifyUrl } from '@/_utils/clientUtils';
import { SpotifyAlbum, SpotifyTrack } from '@/types';
import { useCallback, useEffect, useState } from 'react';

// export const metadata: Metadata = {
//   title: 'Recommendations',
//   description: 'Recommendations for you from Spotify',
// };

type DataItem = {
  album: SpotifyAlbum;
};

const mapResponseToDisplayItems = (data: {
  tracks: DataItem[];
}): SpotifyAlbum[] => {
  return data.tracks.map((track) => track.album);
};

export default function RecommendationsPage() {
  const [initialUrl, setInitialUrl] = useState<string>();
  const authToken = useGetAuthToken();

  const setInitialRecommendationsUrl = useCallback(async () => {
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

    const recommendationsUrl = getSpotifyUrl(
      `recommendations?limit=100&seed_tracks=${seedTrackIds.join(',')}`,
    );
    setInitialUrl(recommendationsUrl);
  }, [authToken]);

  useEffect(() => {
    setInitialRecommendationsUrl();
  }, [setInitialRecommendationsUrl]);

  return (
    <>
      <HtmlTitle pageTitle="Recommendations" />
      <LoadMoreDisplayItems
        initialUrl={initialUrl}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
