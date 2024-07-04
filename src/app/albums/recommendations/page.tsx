import LoadMoreRecommendations from '@/_components/loadMoreRecommendations/LoadMoreRecommendations';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyAlbum, SpotifyTrack } from '@/types';

export default async function RecommendationsPage({}: {}) {
  const randomOffset = Math.floor(Math.random() * 100);

  const response = await serverSpotifyFetch(
    `me/top/tracks?limit=5&offset=${randomOffset}`,
    {
      headers: {
        Authorization: getAuthToken(),
      },
    },
  );

  const topData = await response.json();

  const seedTrackIds = topData.items.map((t: SpotifyTrack) => t.id);

  const response2 = await serverSpotifyFetch(
    `recommendations?limit=50&seed_tracks=${seedTrackIds.join(',')}`,
    {
      headers: {
        Authorization: getAuthToken(),
      },
    },
  );

  const recommendationData = await response2.json();

  const recommendations: SpotifyAlbum[] = recommendationData.tracks.map(
    (t: SpotifyTrack) => t.album,
  );

  return (
    <LoadMoreRecommendations
      initialAlbums={recommendations}
      nextUrl={topData.next}
    />
  );
}
