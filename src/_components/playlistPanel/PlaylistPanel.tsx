'use client';

import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlaylist } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FullPageSpinner from '../fullPageSpinner/FullPageSpinner';

interface PlaylistPanelProps {
  playlist: SpotifyPlaylist;
}

export default function PlaylistPanel({ playlist }: PlaylistPanelProps) {
  const params = useSearchParams();
  const [showDialog, setShowDialog] = useState(false);
  const [updatedPlaylist, setUpdatedPlaylist] =
    useState<SpotifyPlaylist>(playlist);
  const [showSecondDialog, setShowSecondDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState(
    !!params.get('success'),
  );
  const authToken = useGetAuthToken();

  const handleFirstConfirmClicked = () => {
    setShowDialog(false);
    setShowSecondDialog(true);
  };

  const handleClearConfirmed = useCallback(async () => {
    setShowSecondDialog(false);
    setLoading(true);

    let trackUris: string[] = [];
    let nextUrl = playlist.tracks.href;

    try {
      while (nextUrl) {
        const tracksResponse = await fetch(nextUrl, {
          headers: {
            Authorization: authToken,
          },
        });

        const data = await tracksResponse.json();

        if (data.items.length) {
          const newTrackUris = data.items.map(
            (item: { track: { uri: string } }) => item.track.uri,
          );
          trackUris = [...trackUris, ...newTrackUris];
        }

        nextUrl = data.next;
      }

      const deleteCallsCount = Math.ceil(trackUris.length / 100);

      const promises = Array.from(Array(deleteCallsCount).keys()).map((i) => {
        const urisToDelete = trackUris.slice(i * 100, i * 100 + 100);

        return clientSpotifyFetch(`playlists/${playlist.id}/tracks`, {
          headers: {
            Authorization: authToken,
          },
          body: JSON.stringify({
            tracks: urisToDelete.map((uri) => ({
              uri,
            })),
            snapshot_id: playlist.snapshot_id,
          }),
          method: 'DELETE',
        });
      });

      await Promise.all(promises);
      setShowSuccessToast(true);
      setUpdatedPlaylist({
        ...playlist,
        tracks: {
          ...playlist.tracks,
          total: 0,
        },
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }, [authToken, playlist]);

  useEffect(() => {
    if (showSuccessToast) {
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    }
  }, [showSuccessToast]);

  return (
    <>
      <div className="bg-slate-800 mb-4 rounded-md w-full p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={updatedPlaylist.images[0].url}
            alt={updatedPlaylist.name}
            width={0}
            height={0}
            style={{ width: '64px', height: 'auto' }}
          />
          <div className="ml-8">
            {updatedPlaylist.name}{' '}
            <span className="text-slate-500">
              ({updatedPlaylist.tracks.total} tracks)
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
          <p className="py-4">
            Are you definitely sure??!! Type 1234 into the box below
          </p>
          <p className="py-4">
            <input
              type="text"
              placeholder="Type 1234 here"
              className="input input-bordered input-lg input-primary w-1/2 max-w-xs"
              onChange={(e) => setConfirmationInput(e.target.value)}
            />
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button
                disabled={confirmationInput !== '1234'}
                className="btn btn-error"
                onClick={handleClearConfirmed}
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {showSuccessToast && (
        <button
          className="toast toast-center"
          onClick={() => setShowSuccessToast(false)}
        >
          <div className="alert alert-success">
            <span>
              {playlist.tracks.total} tracks deleted from {playlist.name}
            </span>
          </div>
        </button>
      )}
      {loading && (
        <div className="w-full h-full bg-slate-700 bg-opacity-85">
          <FullPageSpinner />
        </div>
      )}
    </>
  );
}
