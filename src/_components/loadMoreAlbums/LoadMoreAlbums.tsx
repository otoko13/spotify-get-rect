'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { Dimensions, SpotifyAlbum } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlbumsDisplay from '../albumsDisplay/AlbumsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';
import Toggle from '../toggle/Toggle';
import BabylonAlbumsDisplay from '../babylonAlbumsDisplay/BabylonAlbumsDisplay';

export interface LoadMoreAlbumsProps {
  initialAlbums: SpotifyAlbum[];
  nextUrl?: string;
}

export default function LoadMoreAlbums({
  initialAlbums,
  nextUrl,
}: LoadMoreAlbumsProps) {
  const [fetchUrl, setFetchUrl] = useState<string | undefined>(nextUrl);
  const [loading, setLoading] = useState(false);
  const [urlsFetched, setUrlsFetched] = useState<string[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>(initialAlbums);
  const [use3D, setUse3D] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const authToken = useGetAuthToken();

  const fetchMoreAlbums = useCallback(
    async (url: string) => {
      setLoading(true);
      setUrlsFetched((fetchedUrls) => [...fetchedUrls, url]);
      const response = await fetch(url, {
        headers: {
          Authorization: authToken,
        },
      });

      if (response.status !== 200) {
        return;
      }

      const data = await response.json();

      if (response.status !== 200) {
        setLoading(false);
        return;
      }

      setFetchUrl(data.next);

      const sortedAlbums: SpotifyAlbum[] = data.items
        .sort(
          (
            a: SpotifyAlbum & { added_at: string },
            b: SpotifyAlbum & { added_at: string },
          ) => (a.added_at < b.added_at ? 1 : -1),
        )
        .map((d: { album: SpotifyAlbum }) => d.album)
        .filter((a: SpotifyAlbum) => a.album_type !== 'single');

      setLoading(false);
      setAlbums((albums) => [...albums, ...sortedAlbums]);
    },
    [authToken],
  );

  useAlbumDisplayScrollHandler({
    disabled: use3D,
    fetchUrl,
    urlsFetched,
    onBottom: fetchMoreAlbums,
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
    <div ref={containerRef}>
      <Toggle
        label="Go 3D!"
        on={use3D}
        onChange={setUse3D}
        className="fixed top-4 right-16"
      ></Toggle>
      {use3D ? (
        <BabylonAlbumsDisplay albums={albums} />
      ) : (
        <AlbumsDisplay albums={albums} />
      )}
      {loading && <AlbumsLoading />}
    </div>
  );
}
