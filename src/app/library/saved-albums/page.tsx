'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
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
  return (
    <>
      <HtmlTitle pageTitle="Saved albums" />
      <LoadMoreDisplayItems
        initialUrl={getSpotifyUrl('me/albums?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
