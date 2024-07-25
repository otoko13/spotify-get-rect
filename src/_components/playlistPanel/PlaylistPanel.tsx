'use client';

import { SpotifyPlaylist } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface PlaylistPanelProps {
  playlist: SpotifyPlaylist;
}

export default function PlaylistPanel({ playlist }: PlaylistPanelProps) {
  const [showDialog, setShowDialog] = useState(false);

  const onClearConfirmed = useCallback(() => {
    console.log('clearing ' + playlist.name);
  }, [playlist.name]);

  return (
    <>
      <div className="bg-slate-600 mb-3 rounded-md w-full p-4 flex justify-between items-center">
        <div className="">
          <Image
            src={playlist.images[0].url}
            alt={playlist.name}
            width={0}
            height={0}
            style={{ width: '64px', height: 'auto' }}
          />
          <div className="ml-4">{playlist.name}</div>
        </div>
        <button className="btn btn-error" onClick={() => setShowDialog(true)}>
          Clear playlist
        </button>
      </div>
      <dialog
        id="my_modal_1"
        className={classNames('modal', { 'modal-open': showDialog })}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={onClearConfirmed}>
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
