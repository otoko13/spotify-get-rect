import { Album, SpotifyAlbum, SpotifyPlayerTrack } from '@/types';
import {
  Vector3,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Texture,
  Vector4,
  DirectionalLight,
  SpotLight,
  ActionManager,
  ExecuteCodeAction,
  Color3,
  MirrorTexture,
  Plane,
  Tags,
  Matrix,
  Mesh,
} from '@babylonjs/core';
import BabylonCanvas from '../babylonCanvas/BabylonCanvas';
import { useCallback, useState } from 'react';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { Cookies, useCookies } from 'next-client-cookies';
import CanvasLoadMoreButton from '../canvasLoadMoreButton/CanvasLoadMoreButton';

interface BabylonAlbumsDisplayProps {
  albums: SpotifyAlbum[];
  loading?: boolean;
  onLoadMoreButtonClicked: () => void;
}

const BOX_SIZE = 3;
const BOX_GAP = 1.5;
const BOX_WIDTH = BOX_SIZE + BOX_GAP;
const BOX_TAG = 'album-art';
const ALBUMS_PER_ROW = 24;
const ROW_Z_SPACING = 6;
const ROW_Y_SPACING = 4;
const SPOTIFY_COLOR = new Color3(30, 215, 96);

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  // if (!box) {
  //   return;
  // }
  // const deltaTimeInMillis = scene.getEngine().getDeltaTime();
  // const rpm = 10;
  // box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
};

const createScene = (scene: Scene) => {
  // scene.fogMode = Scene.FOGMODE_LINEAR;
  // scene.fogDensity = 1;
  // scene.fogStart = 200;
  // scene.fogEnd = 300;
  // scene.fogColor = new Color3(0.03, 0.115, 0.096);

  const camera = new ArcRotateCamera(
    'camera1',
    0,
    0.01,
    0,
    // new Vector3(0, 0, -15),
    new Vector3(-10, 2, -15),
    scene,
  );

  camera.setTarget(Vector3.Zero());
  camera.upperRadiusLimit = 50;
  camera.upperBetaLimit = (2 * Math.PI) / 3;
  // camera.wheelDeltaPercentage = 0.5;

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

const shineSpotlight = (
  scene: Scene,
  albumIndex: number,
  spotifyId: string,
) => {
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
    { width: BOX_SIZE, height: 0.01, depth: BOX_SIZE },
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

const playAlbum = async (
  spotifyId: string,
  authToken: string,
  cookies: Cookies,
  albumIndex: number,
  scene: Scene,
) => {
  // this line is causing massive rerenders of the canvas and no idea why just yet, so using
  // cookies which are updated every poll of currently playing
  // const { id: deviceId } = await getActiveDevice();
  const deviceId = cookies.get('active-device-id');

  await clientSpotifyFetch(
    `me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        context_uri: spotifyId,
      }),
      headers: {
        Authorization: authToken,
      },
    },
  );

  shineSpotlight(scene, albumIndex, spotifyId);
};

const addAlbums = (
  scene: Scene,
  albums: SpotifyAlbum[],
  authToken: string,
  cookies: Cookies,
) => {
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
      { width: 3, height: 3, depth: 0.1, faceUV },
      scene,
    );
    const row = Math.floor(i / ALBUMS_PER_ROW);
    Tags.EnableFor(box);
    Tags.AddTagsTo(box, `${BOX_TAG}-row${row}`);

    // position the box
    box.position.x = (i % ALBUMS_PER_ROW) * BOX_WIDTH + row * 2;
    box.position.y = BOX_SIZE / 2 + row * ROW_Y_SPACING;
    box.position.z = row * ROW_Z_SPACING;

    // add click action
    box.actionManager = new ActionManager(scene);
    box.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnLeftPickTrigger,
        },
        async () => await playAlbum(box.name, authToken, cookies, i, scene),
      ),
    );

    const material = new StandardMaterial('material', scene);
    const texture = new Texture(album.images[0].url, scene);
    material.diffuseTexture = texture;
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

const triggerSpotlight = async (
  scene: Scene,
  albums: SpotifyAlbum[],
  authToken: string,
) => {
  const response = await clientSpotifyFetch('me/player', {
    headers: {
      Authorization: authToken,
    },
  });

  // ignore too many requests responses
  if (response.status === 429) {
    return;
  }

  if (response.status !== 200 && response.status !== 429) {
    return;
  }

  const data: SpotifyPlayerTrack = await response?.json();

  if (!data.is_playing) {
    return;
  }

  const albumId = data.item.album.id;
  const indexOfPlaying = albums.findIndex((album) => album.id === albumId);
  if (indexOfPlaying > -1) {
    shineSpotlight(scene, indexOfPlaying, data.item.album.uri);
  }
};

const createFloor = (scene: Scene, albumCount: number) => {
  const rows = Math.ceil(albumCount / ALBUMS_PER_ROW);

  Array.from(Array(rows).keys()).forEach((row) => {
    const allBoxesInRow = scene.getMeshesByTags(`${BOX_TAG}-row${row}`);
    const mirror = MeshBuilder.CreateBox(
      `floor-row${row}`,
      {
        width: ALBUMS_PER_ROW * BOX_WIDTH - BOX_GAP,
        height: 0.001,
        depth: BOX_SIZE,
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

const onSceneReady = (
  scene: Scene,
  albums: SpotifyAlbum[],
  authToken: string,
  cookies: Cookies,
) => {
  createScene(scene);

  addAlbums(scene, albums, authToken, cookies);

  triggerSpotlight(scene, albums, authToken);

  // createFloor(scene, albums.length);
};

export default function BabylonAlbumsDisplay({
  albums,
  loading,
  onLoadMoreButtonClicked,
}: BabylonAlbumsDisplayProps) {
  const authToken = useGetAuthToken();
  const cookies = useCookies();
  const [ready, setReady] = useState(false);

  const handleSceneReady = useCallback(
    (scene: Scene) => {
      setReady(true);
      onSceneReady(scene, albums, authToken, cookies);
    },
    [albums, authToken, cookies],
  );

  return (
    <div className="overflow-hidden" style={{ height: 'calc(100vh - 124px)' }}>
      {(!ready || loading) && (
        <div className="fixed flex w-screen h-screen justify-center items-center overflow-hidden">
          <div className="loading loading-bars loading-lg text-primary absolute" />
        </div>
      )}
      <BabylonCanvas
        antialias
        onSceneReady={handleSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
      <CanvasLoadMoreButton
        onClick={onLoadMoreButtonClicked}
        disabled={loading || !ready}
      />
    </div>
  );
}
