'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
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
  return (
    <>
      <HtmlTitle pageTitle="New releases" />
      <LoadMoreDisplayItems
        initialUrl={getSpotifyUrl('browse/new-releases?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
