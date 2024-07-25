'use client';

import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlaylist } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface PlaylistPanelProps {
  playlist: SpotifyPlaylist;
}

export default function PlaylistPanel({ playlist }: PlaylistPanelProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showSecondDialog, setShowSecondDialog] = useState(false);
  const;

  const handleFirstConfirmClicked = () => {
    setShowDialog(false);
    setShowSecondDialog(true);
  };

  const handleClearConfirmed = useCallback(async () => {
    const tracksResponse = await clientSpotifyFetch;
  }, [playlist]);

  return (
    <>
      <div className="bg-slate-800 mb-4 rounded-md w-full p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={playlist.images[0].url}
            alt={playlist.name}
            width={0}
            height={0}
            style={{ width: '64px', height: 'auto' }}
          />
          <div className="ml-8">
            {playlist.name}{' '}
            <span className="text-slate-500">
              ({playlist.tracks.total} tracks)
            </span>
          </div>
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
          <p className="py-4">Are you sure you want to clear this playlist??</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleFirstConfirmClicked}
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog
        id="my_modal_1"
        className={classNames('modal', { 'modal-open': showSecondDialog })}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Are you definitely sure??!!</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleClearConfirmed}>
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
