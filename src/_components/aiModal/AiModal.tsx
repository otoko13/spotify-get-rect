'use client';

import CloseButton from '@/_components/closeButton/CloseButton';
import useCurrentTrackContext from '@/_context/currentTrackContext/useCurrentTrackContext';
import openAiLogo from '@/_images/openai-white-logomark.svg';
import { SpotifyPlayerSongTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import OpenAI from 'openai';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [artistResponse, setArtistResponse] = useState<string | null>();
  const { track } = useCurrentTrackContext();

  const styleOptions = useMemo(() => {
    return getStyleOptions();
  }, []);

  const fetchArtistInfo = useCallback(async () => {
    const response = await fetch(
      `/api/artist-summary?artist=${
        (track as SpotifyPlayerSongTrack)?.item.artists[0].name
      }`,
    );
    if (response.status !== 200) {
      return;
    }

    const data: OpenAI.ChatCompletion = await response.json();
    setArtistResponse(data.choices[0]?.message?.content);
  }, [track]);

  useEffect(() => {
    if (generateArtistInfo && track?.currently_playing_type === 'track') {
      fetchArtistInfo();
    }
  }, [generateArtistInfo, track, fetchArtistInfo]);

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
      // fetchTrackImage();
    }
  }, [selectedStyle, track, fetchTrackImage]);

  return (
    <>
      <div className="fixed top-4 left-2 flex items-center self-start z-30">
        <Image alt="Open AI logo" src={openAiLogo} width={36} height={36} />
        <div className="text-3xl ml-2 pt-1.5">AI playground</div>
        <CloseButton className="fixed right-0" />
      </div>

      <dialog
        id="ai_modal"
        className={classNames('modal z-10', { 'modal-open': open })}
      >
        <div className="flex flex-col justify-evenly items-center h-full modal-box max-w-full w-full rounded-none opacity-90 min-h-screen max-h-screen pb-20">
          <div
            className="track-image-section w-full h-3/4 flex-none flex flex-col items-center justify-center py-4"
            style={{ minHeight: 512 }}
          >
            {!selectedStyle ? (
              <>
                <div className="pb-8 text-slate-500">
                  Generate an image from the lyrics of the current track using
                  one of the following styles:
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
              </>
            ) : imageUrl ? (
              <Image
                className="animate-fade-in"
                src={imageUrl}
                alt="ai generate track image"
                width={0}
                height={0}
                style={{
                  height: '100%',
                  width: 'auto',
                }}
              />
            ) : (
              <div className="loading loading-bars loading-lg text-primary" />
            )}
          </div>
          <div className="artist-info-section flex-grow border-slate-700 border-t w-full flex flex-col items-center justify-center p-4">
            {!generateArtistInfo ? (
              <button
                className="btn btn-outline btn-lg btn-primary"
                onClick={() => setGenerateArtistInfo(true)}
              >
                Tell me more about this artist
              </button>
            ) : artistResponse ? (
              <div className="text-center max-md:w-full w-8/12">
                <Typewriter
                  options={{
                    delay: 30,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(2500)
                      .typeString(artistResponse)
                      .start();
                  }}
                />
              </div>
            ) : (
              <div className="loading loading-bars loading-lg text-primary" />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
