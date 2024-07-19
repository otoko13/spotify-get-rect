'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useDisplayedItemCacheContext from '@/_context/displayedItemCacheContext/useDisplayedItemCacheContext';
import { getSpotifyUrl } from '@/_utils/clientUtils';
import { SpotifyAlbum } from '@/types';

type DataItem = {
  items: SpotifyAlbum[];
};

const mapResponseToDisplayItems = (data: {
  albums: DataItem;
}): SpotifyAlbum[] => {
  return data.albums.items?.filter(
    (a: SpotifyAlbum) => a.album_type !== 'single',
  );
};

export default function NewReleasesPage() {
  const {
    newReleases,
    onNewReleasesChanged,
    newReleasesNextUrl,
    onNewReleasesNextUrlChanged,
  } = useDisplayedItemCacheContext();

  return (
    <>
      <HtmlTitle pageTitle="New releases" />
      <LoadMoreDisplayItems
        cachedNextUrl={newReleasesNextUrl}
        updatedCachedNextUrl={onNewReleasesNextUrlChanged}
        cachedItems={newReleases}
        updatedCachedItems={onNewReleasesChanged}
        initialUrl={getSpotifyUrl('browse/new-releases?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
