'use client';

import CloseButton from '@/_components/closeButton/CloseButton';
import classNames from 'classnames';
import Image from 'next/image';
import openAiLogo from '@/_images/openai-white-logomark.svg';
import { useMemo, useState } from 'react';
import Typewriter from 'typewriter-effect';

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
  'Photo Realistic',
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

interface AiModalProps {
  open?: boolean;
}

export default function AiModal({ open }: AiModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [generateArtistInfo, setGenerateArtistInfo] = useState(false);
  const [artistResponse, setArtistResponse] = useState<string>();

  const styleOptions = useMemo(() => {
    return getStyleOptions();
  }, []);

  return (
    <dialog
      id="ai_modal"
      className={classNames('modal z-10', { 'modal-open': open })}
    >
      <div className="flex flex-col justify-evenly items-center h-full modal-box max-w-full w-full rounded-none opacity-90 min-h-screen max-h-screen pb-20">
        <div className="flex items-center self-start">
          <Image alt="Open AI logo" src={openAiLogo} width={36} height={36} />
          <div className="text-3xl ml-2 pt-1.5">AI playground</div>
        </div>
        <CloseButton />
        {!selectedStyle ? (
          <div className="track-image-section w-full h-1/2 flex-none flex flex-col items-center justify-center">
            <div className="pb-4">
              Generate an image from the lyrics of the current track using one
              of the following styles:
            </div>
            <div className="grid grid-cols-2 gap-2 pb-4 mx-auto">
              {styleOptions.map((style) => (
                <button
                  className="btn btn-outline btn-lg btn-primary"
                  onClick={() => setSelectedStyle(style)}
                  key={style}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="ai generate track image"
            width={512}
            height={512}
          />
        ) : (
          <div className="loading loading-bars loading-lg text-primary" />
        )}
        <div className="artist-info-section flex-grow border-slate-700 border-t w-full flex flex-col items-center justify-center">
          {!generateArtistInfo ? (
            <button
              className="btn btn-outline btn-lg btn-primary"
              onClick={() => setGenerateArtistInfo(true)}
            >
              Tell me more about this artist
            </button>
          ) : artistResponse ? (
            <Typewriter
              onInit={(typewriter) => {
                typewriter.pauseFor(2500).typeString(artistResponse).start();
              }}
            />
          ) : (
            <div className="loading loading-bars loading-lg text-primary" />
          )}
        </div>
      </div>
    </dialog>
  );
}
