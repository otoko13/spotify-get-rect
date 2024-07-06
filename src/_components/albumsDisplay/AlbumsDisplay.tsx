'use client';

import { SpotifyAlbum } from '@/types';
import Album from '../album/Album';
import { useMemo } from 'react';

interface AlbumsDisplayProps {
  albums: SpotifyAlbum[];
  loading?: boolean;
}

export default function AlbumsDisplay({ albums }: AlbumsDisplayProps) {
  const colsToFillWhenLoading = useMemo(() => {
    return 6 - (albums.length % 6);
  }, [albums.length]);

  return (
    <div className="grid max-md:grid-cols-2 grid-cols-6 max-md:gap-4 gap-10 max-md:mb-4 mb-10 px-4 pt-4">
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
      {Array.from(Array(colsToFillWhenLoading).keys()).map((i) => (
        <div key={i} className="skeleton aspect-square" />
      ))}
    </div>
  );
}
