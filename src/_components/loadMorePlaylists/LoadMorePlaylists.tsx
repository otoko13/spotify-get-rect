'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { SpotifyPlaylist } from '@/types';
import { useCallback, useState } from 'react';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';
import DualModeAlbumsDisplay from '../dualModeAlbumsDisplay/DualModeAlbumsDisplay';

export interface LoadMorePlaylistsProps {
  initialPlaylists: SpotifyPlaylist[];
  nextUrl?: string;
}

export default function LoadMorePlaylists({
  initialPlaylists,
  nextUrl,
}: LoadMorePlaylistsProps) {
  const [fetchUrl, setFetchUrl] = useState<string | undefined>(nextUrl);
  const [loading, setLoading] = useState(false);
  const [urlsFetched, setUrlsFetched] = useState<string[]>([]);
  const [playlists, setPlaylists] =
    useState<SpotifyPlaylist[]>(initialPlaylists);

  const authToken = useGetAuthToken();

  const fetchMore = useCallback(
    async (url: string) => {
      if (!url) {
        return;
      }

      if (urlsFetched.includes(url)) {
        return;
      }
      setLoading(true);
      setUrlsFetched((fetchedUrls) => [...fetchedUrls, url]);
      const response = await fetch(url, {
        headers: {
          Authorization: authToken,
        },
      });

      if (response.status !== 200) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setFetchUrl(data.next !== url ? data.next : undefined);

      setLoading(false);
      setPlaylists((albums) => [...albums, ...data.items]);
    },
    [authToken, urlsFetched],
  );

  useAlbumDisplayScrollHandler({
    disabled: !fetchUrl,
    fetchUrl,
    urlsFetched,
    onBottom: fetchMore,
  });

  // NOTE!!
  // the placement of Toggle here is very dodgy. From a UI perspective,
  // it breaks the information hierarchy on the page, as the menu bar (which
  // is where we're trying to badly place it using fixed positioning) is applicable
  // to all the albums routes, not just saved-albums, which is the only place it currently works.
  // Once it's applicable to every page, what we really need to do
  // is put it directly in MenuTabs, but then we would need to make layout (and
  // everything below it) client components since the toggle needs state.
  // There's also no way of passing the state info from layout down to page
  // without using context. Some advice suggests we would need to just put the
  // menu on every page, but then we lose the animation on the tabs selection.

  // If it's not applicable to every page, we need to put the setting only in the
  // area for the saved-albums page, but there's not currently a clean place to do this.
  // For now, I'll leave it here and sort it out later.

  return (
    <DualModeAlbumsDisplay
      items={playlists}
      loading={loading}
      noMoreItems={!fetchUrl}
      show3dOption={false}
    />
  );
}
