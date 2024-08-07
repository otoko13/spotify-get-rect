'use client';

import { useMemo } from 'react';
import DisplayItem, { BaseDisplayItem } from '../displayItem/DisplayItem';

interface ItemsDisplayProps<T extends BaseDisplayItem> {
  items: T[];
  loading?: boolean;
}

export default function ItemsDisplay<T extends BaseDisplayItem>({
  items,
  loading,
}: ItemsDisplayProps<T>) {
  const colsToFillWhenLoading = useMemo(() => {
    return 6 - (items.length % 6);
  }, [items.length]);

  return (
    <div className="grid max-md:grid-cols-2 grid-cols-6 max-md:gap-4 gap-10 mb-10 max-md:mb-4">
      {items.map((item, index) => (
        <DisplayItem key={`${index}-${item.id}`} item={item} />
      ))}
      {loading &&
        Array.from(Array(colsToFillWhenLoading + 24).keys()).map((i) => (
          <div key={i} className="skeleton block aspect-square" />
        ))}
    </div>
  );
}
