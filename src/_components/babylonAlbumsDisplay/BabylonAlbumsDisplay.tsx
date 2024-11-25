import useCurrentTrackContext from '@/_context/currentTrackContext/useCurrentTrackContext';
import usePlayerContext from '@/_context/playerContext/usePlayerContext';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import useGetTargetDevice from '@/_hooks/useGetTargetDevice';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import { SpotifyPlayerTrack } from '@/types';
import {
  AbstractMesh,
  ActionManager,
  ArcRotateCamera,
  Color3,
  DirectionalLight,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  MirrorTexture,
  Plane,
  Scene,
  SpotLight,
  StandardMaterial,
  Tags,
  Texture,
  Vector3,
  Vector4,
} from '@babylonjs/core';
import { memo, useCallback, useEffect, useState } from 'react';
import BabylonCanvas from '../babylonCanvas/BabylonCanvas';
import CanvasLoadMoreButton from '../canvasLoadMoreButton/CanvasLoadMoreButton';
import { BaseDisplayItem } from '../displayItem/DisplayItem';
import FullPageSpinner from '../fullPageSpinner/FullPageSpinner';

interface BabylonAlbumsDisplayProps {
  albums?: BaseDisplayItem[];
  loading?: boolean;
  noMoreAlbums?: boolean;
  onLoadMoreButtonClicked: () => void;
}

const BOX_SIZE = 3;
const BOX_GAP = 1.5;
const BOX_WIDTH = BOX_SIZE + BOX_GAP;
const BOX_TAG = 'album-art';
const ALBUMS_PER_ROW = 24;
const ROW_Z_SPACING = 6;
const ROW_Y_SPACING = 3.2;
const SPOTIFY_COLOR = new Color3(30, 215, 96);

let scene: Scene;
let camera: ArcRotateCamera;

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
// const onRender = (scene: Scene) => {
//   console.info(scene);
//   // if (!box) {
//   //   return;
//   // }
//   // const deltaTimeInMillis = scene.getEngine().getDeltaTime();
//   // const rpm = 10;
//   // box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
// };

const setCameraTarget = (albumCount: number) => {
  const rows = Math.ceil(albumCount / ALBUMS_PER_ROW);
  const depth = rows * ROW_Z_SPACING;
  camera.setTarget(new Vector3(0, 0, depth));
};

const createScene = (scene: Scene, albumCount: number) => {
  // scene.fogMode = Scene.FOGMODE_LINEAR;
  // scene.fogDensity = 1;
  // scene.fogStart = 200;
  // scene.fogEnd = 300;
  // scene.fogColor = new Color3(0.03, 0.115, 0.096);

  camera = new ArcRotateCamera(
    'camera1',
    0,
    0.01,
    0,
    // new Vector3(0, 0, -15),
    new Vector3(-10, 2, -10),
    scene,
  );
  setCameraTarget(albumCount);
  camera.target.addInPlace(new Vector3(4, 0, 0));
  camera.position.addInPlace(new Vector3(4, 0, 0));

  camera.upperRadiusLimit = 100;
  // camera.upperBetaLimit = (2 * Math.PI) / 3;
  // camera.wheelDeltaPercentage = 0.01;
  camera.wheelPrecision = 50;
  camera.maxZ = 1000;
  camera.panningSensibility = 400;
  // camera.pinchDeltaPercentage = 50;
  // camera.pinchPrecision = 200;
  camera.angularSensibilityX = 4000;
  camera.angularSensibilityY = 4000;
  camera.useNaturalPinchZoom = true;

  const canvas = scene.getEngine().getRenderingCanvas();

  camera.attachControl(canvas, true, true);

  camera.target.addInPlace(new Vector3(8, 1.5, -3));
  camera.position.addInPlace(new Vector3(8, 1.5, -3));

  const frontLight = new DirectionalLight('dl', new Vector3(0, -3.5, 8), scene);
  const backLight = new DirectionalLight('dl', new Vector3(0, -3, -7), scene);
  const topLight = new DirectionalLight('dl', new Vector3(0, -1, 0.01), scene);
  frontLight.intensity = 0.9;
  backLight.intensity = 0.3;
  topLight.intensity = 0.4;
};

interface ShineSpotlightArgs {
  albumIndex: number;
  spotifyId: string;
}

const shineSpotlight = ({ albumIndex, spotifyId }: ShineSpotlightArgs) => {
  const existingLight = scene.getLightByName('spot');

  if (existingLight) {
    scene.removeLight(existingLight);
    existingLight.dispose();
  }

  const row = Math.floor(albumIndex / ALBUMS_PER_ROW);

  // // add spot light
  const spotLight = new SpotLight(
    'spot',
    new Vector3(
      (albumIndex % ALBUMS_PER_ROW) * BOX_WIDTH + row * 2,
      row * ROW_Y_SPACING + 12.6,
      row * ROW_Z_SPACING - 12,
    ),
    new Vector3(0, -1, 1),
    Math.PI / 15,
    0.0003,
    scene,
  );

  const spotLightColor = SPOTIFY_COLOR;

  spotLight.specular = spotLightColor;
  spotLight.diffuse = spotLightColor;
  spotLight.intensity = 1;

  // show mirror mesh
  const existing = scene.getMeshByName('mirrorMesh');
  if (existing) {
    scene.removeMesh(existing);
    existing.dispose();
  }

  // add reflection under playing album
  const mirrorMesh = MeshBuilder.CreateBox(
    `mirrorMesh`,
    { depth: BOX_SIZE, height: 0.01, width: BOX_SIZE },
    scene,
  );

  const box = scene.getMeshByName(spotifyId) as Mesh;

  mirrorMesh.position = new Vector3(
    box.position.x,
    box.position.y - BOX_SIZE / 2,
    box.position.z - BOX_SIZE / 2,
  );
  mirrorMesh.rotation = new Vector3(0, Math.PI, 0);
  const mirrorMaterial = new StandardMaterial('mirrorMaterial', scene);
  const reflectionTexture = new MirrorTexture(
    `mirrorTexture`,
    { ratio: 0.5 },
    scene,
    true,
  );
  reflectionTexture.mirrorPlane = new Plane(0, -1.0, -1, 0);
  reflectionTexture.renderList = [box];
  reflectionTexture.adaptiveBlurKernel = 30;
  reflectionTexture.level = 1;

  mirrorMaterial.diffuseColor = new Color3(0, 0, 0);
  mirrorMaterial.specularColor = new Color3(0.15, 1.075, 0.48);
  mirrorMaterial.useSpecularOverAlpha = true;
  mirrorMaterial.indexOfRefraction = 0.52;
  mirrorMaterial.alpha = 0.01;
  mirrorMaterial.useReflectionOverAlpha = true;
  mirrorMaterial.reflectionTexture = reflectionTexture;
  mirrorMesh.material = mirrorMaterial;
};

const removeSpotlight = () => {
  const existingLight = scene.getLightByName('spot');

  if (existingLight) {
    scene.removeLight(existingLight);
    existingLight.dispose();
  }

  const existing = scene.getMeshByName('mirrorMesh');
  if (existing) {
    scene.removeMesh(existing);
    existing.dispose();
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createFloor = (scene: Scene, albumCount: number) => {
  const rows = Math.ceil(albumCount / ALBUMS_PER_ROW);

  Array.from(Array(rows).keys()).forEach((row) => {
    const allBoxesInRow = scene.getMeshesByTags(`${BOX_TAG}-row${row}`);
    const mirror = MeshBuilder.CreateBox(
      `floor-row${row}`,
      {
        depth: BOX_SIZE,
        height: 0.001,
        width: ALBUMS_PER_ROW * BOX_WIDTH - BOX_GAP,
      },
      scene,
    );

    mirror.position = new Vector3(
      0.5 * (ALBUMS_PER_ROW * BOX_WIDTH - BOX_WIDTH) + row * 2,
      row * ROW_Z_SPACING,
      -0.5 * BOX_SIZE,
    );

    const material = new StandardMaterial('mirror', scene);

    // taking care of reflective texture
    material.reflectionTexture = new MirrorTexture(
      `mirror-row${row}`,
      1024,
      scene,
      true,
    );
    const mirrorMaterialReflectionTexture =
      material.reflectionTexture as MirrorTexture;
    const mirrorPlane = new Plane(0, -1.0, -1.0, -0);
    mirrorMaterialReflectionTexture.mirrorPlane = mirrorPlane;
    mirrorMaterialReflectionTexture.renderList = [...allBoxesInRow];
    mirrorMaterialReflectionTexture.adaptiveBlurKernel = 32;
    mirrorMaterialReflectionTexture.level = 0.6;

    material.diffuseColor = new Color3(0, 0, 0);
    material.specularColor = SPOTIFY_COLOR;

    material.useAlphaFromDiffuseTexture = true;
    material.useSpecularOverAlpha = true;
    material.indexOfRefraction = 0.52;
    material.alpha = 0.0;
    // material.alpha = 1;
    material.useReflectionOverAlpha = true;

    mirror.material = material;
  });
};

interface PlayAlbumsArgs {
  authToken: string;
  spotifyId: string;
  albumIndex: number;
}

interface AddAlbumsArgs {
  authToken: string;
  albums: BaseDisplayItem[];
  playAlbum: (args: PlayAlbumsArgs) => void;
}

const addAlbums = ({ albums, authToken, playAlbum }: AddAlbumsArgs) => {
  if (!scene) {
    return;
  }

  const faceUV: Vector4[] = new Array(6);

  for (let i = 0; i < 6; i++) {
    if (i === 1) {
      faceUV[i] = new Vector4(0, 0, 1, 1);
    } else if (i === 0) {
      faceUV[i] = new Vector4(0, 1, 1, 0);
    } else {
      faceUV[i] = new Vector4(0, 0, 0, 0);
    }
  }

  albums.forEach((album, i) => {
    // Our built-in 'box' shape.
    const box = MeshBuilder.CreateBox(
      album.uri, // name property
      { depth: 0.1, faceUV, height: 3, width: 3 },
      scene,
    );
    const row = Math.floor(i / ALBUMS_PER_ROW);
    Tags.EnableFor(box);
    Tags.AddTagsTo(box, `${BOX_TAG}-row${row}`);

    // position the box
    box.position.x = (i % ALBUMS_PER_ROW) * BOX_WIDTH + row * 2;
    box.position.y = BOX_SIZE / 2 + row * ROW_Y_SPACING;
    box.position.z = row * ROW_Z_SPACING;
    box.alwaysSelectAsActiveMesh = true;

    // add click action
    box.actionManager = new ActionManager(scene);
    box.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickTrigger,
        },
        async () => {
          await playAlbum({
            albumIndex: i,
            authToken,
            spotifyId: box.name,
          });
        },
      ),
    );
    box.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;

    const material = new StandardMaterial('material', scene);
    const texture = new Texture(album.images[0].url, scene);
    material.diffuseTexture = texture;
    material.backFaceCulling = true;
    // material.specularColor = new Color3(0.0429, 0.307, 0.137);
    box.material = material;

    // create album reflection
    // NOTE - this works but it might be slower than a single mirror mesh

    // const mirrorMesh = MeshBuilder.CreateBox(
    //   `mirrorMesh-${album.uri}`,
    //   { width: BOX_SIZE, height: 0.01, depth: BOX_SIZE },
    //   scene,
    // );
    // mirrorMesh.position = new Vector3(
    //   box.position.x,
    //   box.position.y - BOX_SIZE / 2,
    //   box.position.z - BOX_SIZE / 2,
    // );
    // mirrorMesh.rotation = new Vector3(0, Math.PI, 0);
    // const mirrorMaterial = new StandardMaterial('mirrorMaterial', scene);
    // const reflectionTexture = new MirrorTexture(
    //   `mirrorTexture-${album.uri}`,
    //   { ratio: 0.5 },
    //   scene,
    //   true,
    // );
    // reflectionTexture.mirrorPlane = new Plane(0, -1.0, -1, 0);
    // reflectionTexture.renderList = [box];
    // reflectionTexture.adaptiveBlurKernel = 32;
    // reflectionTexture.level = 1;

    // mirrorMaterial.diffuseColor = new Color3(0, 0, 0);
    // mirrorMaterial.specularColor = new Color3(0.15, 1.075, 0.48);
    // material.useAlphaFromDiffuseTexture = true;
    // mirrorMaterial.useSpecularOverAlpha = true;
    // mirrorMaterial.indexOfRefraction = 0.52;
    // mirrorMaterial.alpha = 0.01;
    // mirrorMaterial.useReflectionOverAlpha = true;
    // mirrorMaterial.reflectionTexture = reflectionTexture;
    // mirrorMesh.material = mirrorMaterial;
  });
};

const triggerSpotlight = (
  currentTrack: SpotifyPlayerTrack | undefined,
  items: { id: string }[],
) => {
  if (!currentTrack) {
    return;
  }

  if (currentTrack.currently_playing_type === 'track') {
    const albumId = currentTrack.item.album.id;
    const indexOfPlaying = items.findIndex((item) => item.id === albumId);

    if (indexOfPlaying > -1) {
      shineSpotlight({
        albumIndex: indexOfPlaying,
        spotifyId: currentTrack.item.album.uri,
      });
    }
  } else if (currentTrack.currently_playing_type === 'episode') {
    const albumId = currentTrack.item.show.id;
    const indexOfPlaying = items.findIndex((item) => item.id === albumId);

    if (indexOfPlaying > -1) {
      shineSpotlight({
        albumIndex: indexOfPlaying,
        spotifyId: currentTrack.item.show.uri,
      });
    }
  }
};

let displayedAlbums: BaseDisplayItem[] = [];

const BabylonAlbumsDisplay = ({
  albums = [],
  loading,
  noMoreAlbums,
  onLoadMoreButtonClicked,
}: BabylonAlbumsDisplayProps) => {
  const authToken = useGetAuthToken();
  const [ready, setReady] = useState(false);
  const getTargetDevice = useGetTargetDevice();
  const { player } = usePlayerContext();
  const { track: currentTrack } = useCurrentTrackContext();

  const playAlbum = useCallback(
    async ({ authToken, spotifyId, albumIndex }: PlayAlbumsArgs) => {
      const deviceId = await getTargetDevice();

      player?.activateElement();

      await clientSpotifyFetch(
        `me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`,
        {
          body: JSON.stringify({
            context_uri: spotifyId,
          }),
          headers: {
            Authorization: authToken,
          },
          method: 'PUT',
        },
      );

      shineSpotlight({ albumIndex, spotifyId });
    },
    [getTargetDevice, player],
  );

  const handleLoadMoreClicked = useCallback(() => {
    scene.dispose();
    onLoadMoreButtonClicked();
  }, [onLoadMoreButtonClicked]);

  useEffect(() => {
    console.log('\n\nCHANGED\n\n');
  }, [albums]);

  const handleSceneReady = useCallback(
    (newScene: Scene) => {
      setReady(true);
      scene = newScene;
      createScene(scene, albums.length);
      addAlbums({ albums, authToken, playAlbum });
      // triggerSpotlight(currentTrack, albums);
      displayedAlbums = albums;
      // createFloor(scene, albums.length);
    },
    [albums, authToken, playAlbum],
  );

  useEffect(() => {
    const newAlbums = albums.splice(displayedAlbums.length);
    addAlbums({ albums: newAlbums, authToken, playAlbum });
    // setCameraTarget(albums.length);
  }, [albums, authToken, playAlbum]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!currentTrack) {
      removeSpotlight();
      return;
    }

    triggerSpotlight(currentTrack, albums);
  }, [albums, currentTrack, ready]);

  return (
    <div className="overflow-hidden h-screen">
      {(!ready || loading) && <FullPageSpinner />}
      {!loading && (
        <>
          <BabylonCanvas
            hideCanvas={loading}
            onSceneReady={handleSceneReady}
            id="my-canvas"
            adaptToDeviceRatio={false}
            antialias
          />
          <CanvasLoadMoreButton
            onClick={handleLoadMoreClicked}
            disabled={loading || !ready || noMoreAlbums}
          />
        </>
      )}
    </div>
  );
};

const MemoizedBabylonAlbumsDisplay = memo(BabylonAlbumsDisplay);
export default MemoizedBabylonAlbumsDisplay;
