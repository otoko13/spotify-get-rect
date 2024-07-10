import LoadMoreGeneric from '@/_components/loadMoreGeneric/LoadMoreGeneric';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audiobooks',
  description: 'Your audiobooks saved in Spotify',
};

export default async function AudiobooksPage() {
  const response = await serverSpotifyFetch('me/audiobooks?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  if (!data.items) {
    console.error('No items', data);
    return (
      <LoadMoreGeneric
        initialItems={[]}
        nextUrl="https://api.spotify.com/v1/me/audiobooks?limit=50"
      />
    );
  }

  return <LoadMoreGeneric initialItems={data.items} nextUrl={data.next} />;
}
