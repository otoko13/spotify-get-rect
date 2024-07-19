'use client';

import { useCallback, useEffect, useState } from 'react';
import ArtStyleOptions, { ArtStyle } from './ArtStyleOptions';
import { SpotifyPlayerSongTrack, SpotifyPlayerTrack } from '@/types';
import Image from 'next/image';
import classNames from 'classnames';

interface AiTrackImageProps {
  track: SpotifyPlayerTrack | undefined;
}

export default function AiTrackImage({ track }: AiTrackImageProps) {
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchTrackImage = useCallback(async () => {
    const response = await fetch(
      `/api/track-image?style=${selectedStyle}&artist=${
        (track as SpotifyPlayerSongTrack)?.item.artists[0].name
      }&song=${(track as SpotifyPlayerSongTrack)?.item.name}`,
    );
    if (response.status !== 200) {
      return;
    }

    const data = await response.json();
    setImageUrl(data.url);
  }, [selectedStyle, track]);

  useEffect(() => {
    if (selectedStyle && track?.currently_playing_type === 'track') {
      fetchTrackImage();
    }
  }, [selectedStyle, fetchTrackImage, track?.currently_playing_type]);

  return (
    <div
      className="track-image-section max-lg:w-full w-1/2 h-full flex-none flex flex-col items-center justify-center py-4 max-lg:px-0 px-4 border-slate-700 max-lg:border-b max-lg:border-r-0 border-r"
      style={{ minHeight: 512 }}
    >
      {!selectedStyle ? (
        <ArtStyleOptions onStyleSelected={setSelectedStyle} />
      ) : imageUrl ? (
        <Image
          className={classNames(
            'h-full w-auto max-sm:w-full max-sm:h-auto opacity-0',
            { 'animate-slow-fade-in': imageLoaded },
          )}
          key={imageUrl}
          onLoad={() => setImageLoaded(true)}
          src={imageUrl}
          alt="ai generate track image"
          width={0}
          height={0}
        />
      ) : (
        <div className="loading loading-bars loading-lg text-primary" />
      )}
    </div>
  );
}
