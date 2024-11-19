'use client';

import { BaseDisplayItem } from '@/_components/displayItem/DisplayItem';
import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useDisplayedItemCacheContext from '@/_context/displayedItemCacheContext/useDisplayedItemCacheContext';
import { getSpotifyUrl } from '@/_utils/clientUtils';

function mapResponseToDisplayItems<T extends BaseDisplayItem>(data: {
  items: T[];
}): T[] {
  return data.items;
}

export default function PlaylistsPage() {
  const {
    playlists: playLists,
    onPlaylistsChanged: onPlayListsChanged,
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
