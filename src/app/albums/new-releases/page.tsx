import LoadMoreNewReleases from '@/_components/loadMoreNewReleases/LoadMoreNewReleases';
import { serverSpotifyFetch } from '@/_utils/serverUtils';
import { getAuthToken } from '@/_utils/serverUtils';
import { SpotifyAlbum } from '@/types';

export default async function NewReleasesPage({}: {}) {
  const response = await serverSpotifyFetch('browse/new-releases?limit=50', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  const sortedAlbums: SpotifyAlbum[] = data.albums.items?.filter(
    (a: SpotifyAlbum) => a.album_type !== 'single',
  );

  return (
    <LoadMoreNewReleases
      initialAlbums={sortedAlbums ?? []}
      nextUrl={data.next}
    />
  );
}
