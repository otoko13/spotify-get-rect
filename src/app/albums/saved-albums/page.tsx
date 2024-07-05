import LoadMoreAlbums from '@/_components/loadMoreAlbums/LoadMoreAlbums';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyAlbum } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Albums',
  description: 'Your latest liked albums in Spotify',
};

const sortAlbums = (
  items: { album: SpotifyAlbum; added_at: string }[],
): SpotifyAlbum[] =>
  items
    .sort((a: { added_at: string }, b: { added_at: string }) =>
      a.added_at < b.added_at ? 1 : -1,
    )
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');

export default async function SavedAlbumsPage({}: {}) {
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

  const sortedAlbums = sortAlbums(data.items);

  return (
    <LoadMoreAlbums
      initialAlbums={sortedAlbums}
      nextUrl={data.next}
      processAlbums={sortAlbums}
    />
  );
}
