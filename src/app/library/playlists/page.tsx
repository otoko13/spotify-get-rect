import LoadMoreGeneric from '@/_components/loadMoreGeneric/LoadMoreGeneric';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Your Spotify playlists',
};

export default async function PlaylistsPage() {
  const response = await serverSpotifyFetch('me/playlists?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  return <LoadMoreGeneric initialItems={data.items} nextUrl={data.next} />;
}
