'use client';

import CloseButton from '@/_components/closeButton/CloseButton';
import useCurrentTrackContext from '@/_context/currentTrackContext/useCurrentTrackContext';
import openAiLogo from '@/_images/openai-white-logomark.svg';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AiArtistInfo from './AiArtistInfo';
import styles from './aiModal.module.scss';
import AiTrackImage from './AiTrackImage';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';

interface AiModalProps {
  open?: boolean;
}

export default function AiModal({ open }: AiModalProps) {
  const [modalWindow, setModalWindow] = useState<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { track } = useCurrentTrackContext();

  useEffect(() => {
    if (!modalWindow) {
      return;
    }

    OverlayScrollbars(
      modalWindow,
      {
        scrollbars: {
          visibility: 'auto',
          autoHideDelay: 2000,
        },
      },
      {
        scroll(_instance, event) {
          setScrolled((event.target as HTMLDivElement).scrollTop > 10);
        },
      },
    );
  }, [modalWindow]);

  return (
    <>
      <div className="fixed top-0 left-0 flex items-center self-start z-40 w-full">
        <div
          className={classNames(
            'absolute top-0 left-0 w-full h-full -z-10',
            styles['blurred-title'],
            {
              [styles.visible]: scrolled,
            },
          )}
        />
        <div className="py-3 px-2 flex justify-start items-center w-full">
          <Image alt="Open AI logo" src={openAiLogo} width={36} height={36} />
          <div className="text-3xl ml-2 pt-1.5 flex-grow">AI playground</div>
          <CloseButton className="justify-self-end relative" />
        </div>
      </div>

      <dialog
        id="ai_modal"
        className={classNames('modal z-10', { 'modal-open': open })}
      >
        <div
          className="modal-box h-full max-w-full w-full rounded-none min-h-screen max-h-screen pb-28 pt-20 max-md:pt-16 flex items-center"
          style={{ opacity: 0.97 }}
          ref={(elem) => setModalWindow(elem)}
        >
          <div className="flex max-lg:flex-col flex-row justify-evenly items-center w-full max-lg:h-full h-5/6 max-lg:pb-64">
            <AiTrackImage track={track} />
            <AiArtistInfo track={track} />
          </div>
        </div>
      </dialog>
    </>
  );
}
