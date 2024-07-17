'use client';

import { useMemo } from 'react';

const artStyles = [
  'Art Deco',
  'Comic Book',
  'Expressionist',
  'Pop Art',
  'Impressionist',
  'Street Art',
  'Digital Art',
  'Pointilist',
  'Renaissance',
  'Art Nouveau',
  'Cubist',
  'Photorealistic',
  'Surrealist',
  'Romantic',
  'Rococo',
  'Baroque',
] as const;

export type ArtStyle = (typeof artStyles)[number]; //

const getStyleOptions = (): ArtStyle[] => {
  const options: ArtStyle[] = [];

  while (options.length < 4) {
    const indexToTry = Math.floor(Math.random() * artStyles.length);
    const style = artStyles[indexToTry];
    if (!options.includes(style)) {
      options.push(style);
    }
  }

  return options;
};

interface ArtStyleOptionsProps {
  onStyleSelected: (style: ArtStyle) => void;
}

export default function ArtStyleOptions({
  onStyleSelected,
}: ArtStyleOptionsProps) {
  const styleOptions = useMemo(() => {
    return getStyleOptions();
  }, []);

  return (
    <>
      <div className="pb-8 text-slate-500 text-center">
        Generate an image from the lyrics of the current track using one of the
        following styles:
      </div>
      <div className="grid grid-cols-2 gap-2 pb-4 mx-auto">
        {styleOptions.map((style) => (
          <button
            className="btn btn-outline btn-lg btn-primary"
            onClick={() => onStyleSelected(style)}
            key={style}
          >
            {style}
          </button>
        ))}
      </div>
    </>
  );
}
