'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import { getSpotifyUrl } from '@/_utils/clientUtils';
import { SpotifyChapter } from '@/types';

const mapResponseToDisplayItems = (data: {
  items: SpotifyChapter[];
}): SpotifyChapter[] => data.items;

export default function AudiobooksPage() {
  return (
    <>
      <HtmlTitle pageTitle="Saved albums" />
      <LoadMoreDisplayItems
        initialUrl={getSpotifyUrl('me/audiobooks?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
