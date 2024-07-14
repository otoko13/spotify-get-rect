'use client';

import { BaseDisplayItem } from '@/_components/displayItem/DisplayItem';
import HtmlTitle from '@/_components/htmlTitle/HtmlTitle';
import LoadMoreDisplayItems from '@/_components/loadMoreDisplayItems/LoadMoreDisplayItems';
import { getSpotifyUrl } from '@/_utils/clientUtils';

// export const metadata: Metadata = {
//   title: 'Playlists',
//   description: 'Your Spotify playlists',
// };

const mapResponseToDisplayItems = (data: {
  items: BaseDisplayItem[];
}): BaseDisplayItem[] => data.items;

export default function PlaylistsPage() {
  return (
    <>
      <HtmlTitle pageTitle="Playlists" />
      <LoadMoreDisplayItems
        initialUrl={getSpotifyUrl('me/playlists?limit=48')}
        mapResponseToDisplayItems={mapResponseToDisplayItems}
      />
    </>
  );
}
