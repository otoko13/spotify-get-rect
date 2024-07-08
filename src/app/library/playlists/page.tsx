import LoadMoreAlbums from '@/_components/loadMoreAlbums/LoadMoreAlbums';
import LoadMorePlaylists from '@/_components/loadMorePlaylists/LoadMorePlaylists';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Your Spotify playlists',
};

export default async function PlaylistsPage({}: {}) {
  const response = await serverSpotifyFetch('me/playlists?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  return (
    <LoadMorePlaylists initialPlaylists={data.items} nextUrl={data.next} />
  );
}
