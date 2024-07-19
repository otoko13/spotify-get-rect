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
  return data.items
    .map((d: { album: SpotifyAlbum }) => d.album)
    .filter((a: SpotifyAlbum) => a.album_type !== 'single');
};

export default function LatestPlayedPage() {
  const {
    mostPlayedAlbums,
    onMostPlayedAlbumsChanged,
    mostPlayedAlbumsNextUrl,
    onMostPlayedAlbumsNextUrlChanged,
  } = useDisplayedItemCacheContext();

  return (
    <>
      <HtmlTitle pageTitle="Latest played" />
      <LoadMoreDisplayItems
        cachedNextUrl={mostPlayedAlbumsNextUrl}
        updatedCachedNextUrl={onMostPlayedAlbumsNextUrlChanged}
        cachedItems={mostPlayedAlbums}
        updatedCachedItems={onMostPlayedAlbumsChanged}
        initialUrl={getSpotifyUrl('me/albums?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
