import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import PlaylistPanel from '@/_components/playlistPanel/PlaylistPanel';
import { getAuthToken, serverSpotifyFetch } from '@/_utils/serverUtils';
import { SpotifyPlaylist } from '@/types';

export default async function Playlists() {
  const response = await serverSpotifyFetch('me/playlists?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  if (!data.items) {
    console.error('No items', data);
  }

  return (
    <div className="pb-4 pt-20 px-4">
      <HtmlTitle pageTitle="Clear playlists" />
      {data.items.map((playlist: SpotifyPlaylist, index: number) => (
        <PlaylistPanel key={index} playlist={playlist} />
      ))}
    </div>
  );
}
