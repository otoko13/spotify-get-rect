import LoadMoreAlbums from '@/_components/loadMoreAlbums/LoadMoreAlbums';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyAlbum } from '@/types';

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

  const sortedAlbums: SpotifyAlbum[] = data.items
    .sort(
      (
        a: SpotifyAlbum & { added_at: string },
        b: SpotifyAlbum & { added_at: string },
      ) => (a.added_at < b.added_at ? 1 : -1),
    )
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');

  return <LoadMoreAlbums initialAlbums={sortedAlbums} nextUrl={data.next} />;
}
