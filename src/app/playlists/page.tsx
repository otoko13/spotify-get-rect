import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import PlaylistPanel from '@/_components/playlistPanel/PlaylistPanel';
import { getAuthToken, serverSpotifyFetch } from '@/_utils/serverUtils';
import { SpotifyPlaylist } from '@/types';

export default async function Playlists() {
  const userResponse = await serverSpotifyFetch('me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const userData = await userResponse.json();

  const response = await serverSpotifyFetch('me/playlists?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  if (!data.items) {
    console.error('No items', data);
  }

  const filteredByUser = data.items.filter(
    (item: SpotifyPlaylist) => item.owner.id === userData.id,
  );

  return (
    <div className="pb-4 pt-20 px-4 w-3/4 mx-auto">
      <HtmlTitle pageTitle="Clear playlists" />
      {filteredByUser.map((playlist: SpotifyPlaylist, index: number) => (
        <PlaylistPanel key={index} playlist={playlist} />
      ))}
    </div>
  );
}
