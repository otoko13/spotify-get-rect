import { SpotifyAlbum } from '../../../types';
import { getAuthToken } from '../../../_utils/serverUtils';
import Album from '@/_components/Album';
import spotifyFetch from '@/_utils/spotifyFetch';

export default async function SavedAlbumsPage() {
  // await new Promise((resolve) => setTimeout(resolve, 100000));

  const response = await spotifyFetch('me/albums?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  const sortedAlbums: SpotifyAlbum[] = data.items
    .sort(
      (
        a: SpotifyAlbum & { added_at: string },
        b: SpotifyAlbum & { added_at: string },
      ) => (a.added_at < b.added_at ? 1 : -1),
    )
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');

  return (
    <div className="grid grid-cols-6 gap-10">
      {sortedAlbums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
    </div>
  );
}
