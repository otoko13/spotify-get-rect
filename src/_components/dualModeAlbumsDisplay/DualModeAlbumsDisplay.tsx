'use client';

import { useCallback, useState } from 'react';
import Toggle from '../toggle/Toggle';
import BabylonAlbumsDisplay from '../babylonAlbumsDisplay/BabylonAlbumsDisplay';
import ItemsDisplay from '../itemsDisplay/ItemsDisplay';
import { useCookies } from 'next-client-cookies';
import { BaseDisplayItem } from '../displayItem/DisplayItem';
import AppCookies from '@/_constants/cookies';

type BaseProps<T extends BaseDisplayItem> = {
  loading: boolean;
  noMoreItems?: boolean;
  items: T[];
};

type Show3DProps = {
  show3dOption?: true;
  fetchMoreForCanvas: () => void;
};

type GenericItemProps = {
  fetchMoreForCanvas?: never;
  show3dOption: false;
};

type DualModeAlbumsDisplayProps<T extends BaseDisplayItem> = BaseProps<T> &
  (Show3DProps | GenericItemProps);

export default function DualModeAlbumsDisplay<T extends BaseDisplayItem>({
  items,
  fetchMoreForCanvas,
  loading,
  noMoreItems,
  show3dOption = true,
}: DualModeAlbumsDisplayProps<T>) {
  const cookies = useCookies();
  const [use3D, setUse3D] = useState(
    show3dOption && Boolean(cookies.get(AppCookies.USE_3D)),
  );

  const handleToggle = useCallback(
    (val: boolean) => {
      setUse3D(val);
      if (val) {
        cookies.set(AppCookies.USE_3D, 'true');
      } else {
        cookies.remove(AppCookies.USE_3D);
      }
    },
    [cookies],
  );

  return (
    <div>
      {show3dOption && (
        <Toggle
          label="Go 3D!"
          on={use3D}
          onChange={handleToggle}
          className="fixed top-6 max-md:top-4 right-16"
        />
      )}
      {show3dOption && use3D ? (
        <BabylonAlbumsDisplay
          albums={items}
          loading={loading}
          noMoreAlbums={!!noMoreItems}
          onLoadMoreButtonClicked={fetchMoreForCanvas as () => void}
        />
      ) : (
        <div className="pb-4 pt-20 px-4">
          <ItemsDisplay items={items as T[]} loading={loading} />
        </div>
      )}
    </div>
  );
}
