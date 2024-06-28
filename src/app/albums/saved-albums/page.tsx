import AlbumsDisplay from '@/_components/albumsDisplay/AlbumsDisplay';
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

  console.log(data);

  const sortedAlbums: SpotifyAlbum[] = data.items
    .sort(
      (
        a: SpotifyAlbum & { added_at: string },
        b: SpotifyAlbum & { added_at: string },
      ) => (a.added_at < b.added_at ? 1 : -1),
    )
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');

  return <AlbumsDisplay albums={sortedAlbums} />;
}
