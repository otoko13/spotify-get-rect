import LoadMoreAlbums from '@/_components/loadMoreAlbums/LoadMoreAlbums';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyAlbum } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Your Spotify playlists',
};

export default async function PlaylistsPage({}: {}) {
  const response = await serverSpotifyFetch('me/albums?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  if (!data.items) {
    console.error('No items', data);
    return (
      <LoadMoreAlbums
        initialAlbums={[]}
        nextUrl="https://api.spotify.com/v1/me/albums?limit=50"
      />
    );
  }

  return <LoadMoreAlbums initialAlbums={data.items} nextUrl={data.next} />;
}
