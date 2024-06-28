'use client';

import { SpotifyAlbum } from '@/types';
import Album from '../album/Album';
import { useEffect, useState } from 'react';

interface AlbumsDisplayProps {
  albums: SpotifyAlbum[];
}

export default function AlbumsDisplay({ albums }: AlbumsDisplayProps) {
  return (
    <div className="grid grid-cols-6 gap-10 mb-10">
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
    </div>
  );
}
