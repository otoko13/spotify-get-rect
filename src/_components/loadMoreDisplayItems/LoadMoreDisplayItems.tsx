'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { useCallback, useEffect, useState } from 'react';
import useAlbumDisplayScrollHandler from '@/_hooks/useAlbumDisplayScrollHandler';
import DualModeAlbumsDisplay from '../dualModeAlbumsDisplay/DualModeAlbumsDisplay';
import { BaseDisplayItem } from '../displayItem/DisplayItem';

export interface LoadMoreDisplayItemsProps<T extends BaseDisplayItem> {
  customFetchMore?: () => Promise<any>;
  initialUrl?: string;
  isAlbums?: boolean;
  mapResponseToDisplayItems: (items: any, existingItems?: T[]) => T[];
}

export default function LoadMoreDisplayItems<T extends BaseDisplayItem>({
  customFetchMore,
  initialUrl,
  isAlbums = true,
  mapResponseToDisplayItems,
}: LoadMoreDisplayItemsProps<T>) {
  const [fetchUrl, setFetchUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [urlsFetched, setUrlsFetched] = useState<string[]>([]);
  const [items, setItems] = useState<T[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const authToken = useGetAuthToken();

  const fetchMoreItems = useCallback(
    async (url: string) => {
      if (urlsFetched.includes(url)) {
        return;
      }
      setLoading(true);

      let data;

      if (customFetchMore) {
        data = await customFetchMore().catch(() => {
          setLoading(false);
          return;
        });
      } else {
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

        data = await response.json();
        // new releases uses albums.next - TODO: make the accessor a prop
        const nextUrl = data.next ?? data.albums?.next;
        setFetchUrl(nextUrl !== url ? nextUrl : undefined);
      }

      const processedItems = mapResponseToDisplayItems(data, items);

      setLoading(false);
      setItems((items) => [...items, ...processedItems]);
    },
    [authToken, customFetchMore, items, mapResponseToDisplayItems, urlsFetched],
  );

  useAlbumDisplayScrollHandler({
    disabled: !initialLoadComplete || loading,
    fetchUrl,
    urlsFetched,
    onBottom: fetchMoreItems,
  });

  useEffect(() => {
    async function initialLoad() {
      if (!initialUrl) {
        return;
      }
      await fetchMoreItems(initialUrl).then(() => {
        setInitialLoadComplete(true);
      });
    }

    initialLoad();
  }, [fetchMoreItems, initialUrl]);

  const fetchMoreForCanvas = useCallback(async () => {
    if (fetchUrl) {
      await fetchMoreItems(fetchUrl);
    }
  }, [fetchUrl, fetchMoreItems]);

  return (
    <DualModeAlbumsDisplay
      items={items}
      loading={loading}
      noMoreItems={!fetchUrl}
      {...(isAlbums
        ? { fetchMoreForCanvas, show3dOption: true }
        : { show3dOption: false })}
    />
  );
}
