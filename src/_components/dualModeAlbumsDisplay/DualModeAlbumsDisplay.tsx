'use client';

import { useCallback, useState } from 'react';
import Toggle from '../toggle/Toggle';
import BabylonAlbumsDisplay from '../babylonAlbumsDisplay/BabylonAlbumsDisplay';
import ItemsDisplay from '../itemsDisplay/ItemsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';
import { useCookies } from 'next-client-cookies';
import { BaseDisplayItem } from '../displayItem/DisplayItem';
import { SpotifyAlbum } from '@/types';

type BaseProps = {
  fetchMoreForCanvas: () => void;
  loading: boolean;
  noMoreItems?: boolean;
};

type AlbumOnlyProps = {
  show3dOption?: true;
  items: SpotifyAlbum[];
};

type GenericItemProps<T extends BaseDisplayItem> = {
  show3dOption: false;
  items: T[];
};

// interface DualModeAlbumsDisplayProps<T extends BaseDisplayItem> {
//   items: T[];
//   fetchMoreForCanvas: () => void;
//   loading: boolean;
//   noMoreItems?: boolean;
//   show3dOption?: boolean;
// }

type DualModeAlbumsDisplayProps<T extends BaseDisplayItem> = BaseProps &
  (AlbumOnlyProps | GenericItemProps<T>);

export default function DualModeAlbumsDisplay<T extends BaseDisplayItem>({
  items,
  fetchMoreForCanvas,
  loading,
  noMoreItems,
  show3dOption = true,
}: DualModeAlbumsDisplayProps<T>) {
  const cookies = useCookies();
  const [use3D, setUse3D] = useState(
    show3dOption && Boolean(cookies.get('use-3d')),
  );

  const handleToggle = useCallback(
    (val: boolean) => {
      setUse3D(val);
      if (val) {
        cookies.set('use-3d', 'true');
      } else {
        cookies.remove('use-3d');
      }
    },
    [cookies],
  );

  return (
    <div>
      <Toggle
        label="Go 3D!"
        on={use3D}
        onChange={handleToggle}
        className="fixed top-6 right-16"
      />
      {show3dOption && use3D ? (
        <BabylonAlbumsDisplay
          albums={items as SpotifyAlbum[]}
          loading={loading}
          noMoreAlbums={!!noMoreItems}
          onLoadMoreButtonClicked={fetchMoreForCanvas}
        />
      ) : (
        <ItemsDisplay items={items as T[]} loading={loading} />
      )}
      {loading && !use3D && <AlbumsLoading />}
    </div>
  );
}
