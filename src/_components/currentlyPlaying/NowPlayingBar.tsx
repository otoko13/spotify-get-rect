import { THIS_DEVICE_NAME } from '@/_context/bodyScrollerContext/BodyScrollerContext';
import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetTargetDevice from '@/_hooks/useGetTargetDevice';
import pauseButton from '@/_images/pause.svg';
import playButton from '@/_images/play.svg';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useCallback, useMemo } from 'react';
import TransferPlaybackDropdown from '../transferPlaybackDropdown/TransferPlaybackDropdown';
import { SpotifyDeviceSimple } from './CurrentlyPlaying';
import styles from './currentlyPlaying.module.scss';

interface NowPlayingBarProps {
  authToken: string;
  currentDevice?: SpotifyDeviceSimple;
  track?: SpotifyPlayerTrack;
  currentTrackImageToUse: string;
  trackStopped: boolean;
  getPlayData: () => Promise<any>;
  onPlayTransferredToThisDevice: () => void;
}

export default function NowPlayingBar({
  currentDevice,
  track,
  currentTrackImageToUse,
  authToken,
  trackStopped,
  getPlayData,
  onPlayTransferredToThisDevice,
}: NowPlayingBarProps) {
  const {
    player,
    deviceId: thisDeviceId,
    initialisationFailed: playerInitialisationFailed,
  } = usePlayerContext();
  const getTargetDevice = useGetTargetDevice();

  const trackContext = useMemo(() => {
    if (!track) {
      return '';
    }
    return track?.currently_playing_type === 'track'
      ? track?.item.artists.map((artist) => artist.name).join(', ')
      : track?.item?.show?.name;
  }, [track]);

  const nowPlayingBarImage = useMemo(
    () => (
      <Image
        alt="currently playing album art blurred"
        key={currentTrackImageToUse}
        src={currentTrackImageToUse}
        width={64}
        height={64}
      />
    ),
    [currentTrackImageToUse],
  );

  const handlePlay = useCallback(async () => {
    if (!trackStopped) {
      return;
    }
    const targetDeviceId = await getTargetDevice();

    const deviceToUse = currentDevice?.id ?? targetDeviceId;

    player?.activateElement();

    await clientSpotifyFetch(
      `me/player/play${deviceToUse ? `?device_id=${deviceToUse}` : ''}`,
      {
        headers: {
          Authorization: authToken,
        },
        method: 'PUT',
      },
    );
    if (deviceToUse !== thisDeviceId) {
      await getPlayData();
    }
  }, [
    authToken,
    currentDevice?.id,
    getPlayData,
    getTargetDevice,
    player,
    thisDeviceId,
    trackStopped,
  ]);

  const handlePause = useCallback(async () => {
    if (trackStopped) {
      return;
    }
    await clientSpotifyFetch('me/player/pause', {
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
    });
    if (currentDevice?.id !== thisDeviceId) {
      await getPlayData();
    }
  }, [authToken, currentDevice?.id, getPlayData, thisDeviceId, trackStopped]);

  return (
    <>
      <div
        className={classNames(
          'border-solid border-t-1 border-gray-600 px-4 py-1',
          styles['now-playing-bar'],
          {
            [styles.visible]: !!track,
          },
        )}
      >
        <div className="flex flex-grow overflow-hidden">
          <div className="flex-none">
            {track &&
              (track.currently_playing_type === 'track' ? (
                <Link href="/library/ai">{nowPlayingBarImage}</Link>
              ) : (
                nowPlayingBarImage
              ))}
          </div>
          <div className="flex flex-col max-md:ml-2 ml-4 justify-center basis-1/2 overflow-hidden">
            <div className="lg:text-xl md:text-lg whitespace-nowrap text-ellipsis overflow-hidden">
              {track?.item.name}
            </div>
            <div className="text-sm text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
              {trackContext}
            </div>
          </div>
        </div>
        <div className="controls flex items-center flex-none">
          {currentDevice?.name && currentDevice.name !== THIS_DEVICE_NAME && (
            <TransferPlaybackDropdown
              onPlayTransferred={onPlayTransferredToThisDevice}
            >
              <div className="text-sm text-primary mr-4 ">
                <span className="max-lg:hidden visible">Playing on </span>
                {currentDevice?.name}
              </div>
            </TransferPlaybackDropdown>
          )}
          {!player && !playerInitialisationFailed ? (
            <div className="loading loading-dots loading-md"></div>
          ) : trackStopped ? (
            <button onClick={handlePlay}>
              <Image alt="play" src={playButton} width={48} height={48} />
            </button>
          ) : (
            <button onClick={handlePause}>
              <Image alt="pause" src={pauseButton} width={48} height={48} />
            </button>
          )}
        </div>
      </div>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </>
  );
}
