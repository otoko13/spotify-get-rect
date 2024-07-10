import LoadMoreAlbums from '@/_components/loadMoreAlbums/LoadMoreAlbums';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyAlbum } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Albums',
  description: 'Your latest liked albums in Spotify',
};

export default async function SavedAlbumsPage() {
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

  const albums = data.items.map((i: { album: SpotifyAlbum }) => i.album);

  return <LoadMoreAlbums initialAlbums={albums} nextUrl={data.next} />;
}
