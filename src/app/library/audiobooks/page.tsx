'use client';

import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import useDisplayedItemCacheContext from '@/_context/displayedItemCacheContext/useDisplayedItemCacheContext';
import { getSpotifyUrl } from '@/_utils/clientUtils';
import { SpotifyChapter } from '@/types';

const mapResponseToDisplayItems = (data: {
  items: SpotifyChapter[];
}): SpotifyChapter[] => data.items;

export default function AudiobooksPage() {
  const {
    audiobooks,
    onAudiobooksChanged,
    audiobooksNextUrl,
    onAudiobooksNextUrlChanged,
  } = useDisplayedItemCacheContext();

  return (
    <>
      <HtmlTitle pageTitle="Saved albums" />
      <LoadMoreDisplayItems
        cachedNextUrl={audiobooksNextUrl}
        updatedCachedNextUrl={onAudiobooksNextUrlChanged}
        cachedItems={audiobooks}
        updatedCachedItems={onAudiobooksChanged}
        initialUrl={getSpotifyUrl('me/audiobooks?limit=50')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
