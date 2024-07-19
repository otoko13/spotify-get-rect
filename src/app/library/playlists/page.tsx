'use client';

import { BaseDisplayItem } from '@/_components/displayItem/DisplayItem';
import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useDisplayedItemCacheContext from '@/_context/displayedItemCacheContext/useDisplayedItemCacheContext';
import { getSpotifyUrl } from '@/_utils/clientUtils';

// export const metadata: Metadata = {
//   title: 'Playlists',
//   description: 'Your Spotify playlists',
// };

const mapResponseToDisplayItems = (data: {
  items: BaseDisplayItem[];
}): BaseDisplayItem[] => data.items;

export default function PlaylistsPage() {
  const {
    playLists,
    onPlayListsChanged,
    playlistsNextUrl,
    onPlaylistsNextUrlChanged,
  } = useDisplayedItemCacheContext();

  return (
    <>
      <HtmlTitle pageTitle="Playlists" />
      <LoadMoreDisplayItems
        cachedNextUrl={playlistsNextUrl}
        updatedCachedNextUrl={onPlaylistsNextUrlChanged}
        cachedItems={playLists}
        updatedCachedItems={onPlayListsChanged}
        initialUrl={getSpotifyUrl('me/playlists?limit=48')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
