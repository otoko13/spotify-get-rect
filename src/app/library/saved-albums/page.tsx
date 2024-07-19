'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useDisplayedItemCacheContext from '@/_context/displayedItemCacheContext/useDisplayedItemCacheContext';
import { getSpotifyUrl } from '@/_utils/clientUtils';
import { SpotifyAlbum } from '@/types';

type DataItem = {
  album: SpotifyAlbum;
  added_at: string;
};

const mapResponseToDisplayItems = (data: {
  items: DataItem[];
}): SpotifyAlbum[] => {
  const sorted = data.items.sort((a, b) => (a.added_at < b.added_at ? 1 : -1));

  return sorted
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');
};

export default function SavedAlbumsPage() {
  const {
    savedAlbums,
    onSavedAlbumsChanged,
    onSavedAlbumsNextUrlChanged,
    savedAlbumsNextUrl,
  } = useDisplayedItemCacheContext();

  return (
    <>
      <HtmlTitle pageTitle="Saved albums" />
      <LoadMoreDisplayItems
        cachedNextUrl={savedAlbumsNextUrl}
        updatedCachedNextUrl={onSavedAlbumsNextUrlChanged}
        cachedItems={savedAlbums}
        updatedCachedItems={onSavedAlbumsChanged}
        initialUrl={getSpotifyUrl('me/albums?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
