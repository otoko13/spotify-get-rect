import { cookies } from 'next/headers';
import Album from '../components/Album';
import { SpotifyAlbum } from '../types';
import { getAuthToken } from '../serverUtils';

export default async function SavedAlbumsPage() {
  const response = await fetch(
    'https://api.spotify.com/v1/me/albums?limit=20',
    {
      headers: {
        Authorization: getAuthToken(),
      },
    },
  );

  const data = await response.json();

  const albums: SpotifyAlbum[] = data.items
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');

  return (
    <div>
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
    </div>
  );
}
