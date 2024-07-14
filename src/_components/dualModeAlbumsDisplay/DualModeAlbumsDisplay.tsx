'use client';

import useThreeDOptionsContext from '@/_context/threeDOptionsContext/useThreeDOptionsContext';
import BabylonAlbumsDisplay from '../babylonAlbumsDisplay/BabylonAlbumsDisplay';
import { BaseDisplayItem } from '../displayItem/DisplayItem';
import ItemsDisplay from '../itemsDisplay/ItemsDisplay';

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
  const { use3d } = useThreeDOptionsContext();
  return (
    <div>
      {show3dOption && use3d ? (
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
