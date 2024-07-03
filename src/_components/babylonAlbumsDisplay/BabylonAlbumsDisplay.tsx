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
  Color4,
  Matrix,
  Mesh,
  ReflectionProbe,
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
const ALBUMS_PER_ROW = 48;
const ROW_SPACING = 8;

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
  scene.fogMode = Scene.FOGMODE_LINEAR;
  scene.fogDensity = 1;
  scene.fogStart = 200;
  scene.fogEnd = 300;
  scene.fogColor = new Color3(0.03, 0.115, 0.096);

  const camera = new ArcRotateCamera(
    'camera1',
    0,
    0.01,
    0,
    new Vector3(0, 0, -15),
    scene,
  );

  camera.setTarget(Vector3.Zero());
  camera.upperBetaLimit = (2 * Math.PI) / 3;
  camera.lowerRadiusLimit = 4;
  // camera.wheelDeltaPercentage = 0.5;

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  var m = new Matrix();
  camera.absoluteRotation.toRotationMatrix(m);
  const right = new Vector3(m.m[0], m.m[1], m.m[2]);
  camera.target.addInPlace(right);
  camera.position.addInPlace(right);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  // const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  const frontLight = new DirectionalLight('dl', new Vector3(0, -3.5, 8), scene);
  const backLight = new DirectionalLight('dl', new Vector3(0, -3, -7), scene);
  // Default intensity is 1. Let's dim the light a small amount
  frontLight.intensity = 0.9;
  backLight.intensity = 0.3;
};

const shineSpotlight = (scene: Scene, albumIndex: number) => {
  const existingLight = scene.getLightByName('spot');

  if (existingLight) {
    scene.removeLight(existingLight);
    existingLight.dispose();
  }

  // // add spot light
  const spotLight = new SpotLight(
    'spot',
    new Vector3(albumIndex * BOX_WIDTH, 10, -9),
    new Vector3(0, -1, 1),
    Math.PI / 10,
    200,
    scene,
  );

  const spotLightColor = new Color3(30, 215, 96);

  spotLight.specular = spotLightColor;
  spotLight.diffuse = spotLightColor;
  spotLight.intensity = 0.1;
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

  shineSpotlight(scene, albumIndex);
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
    Tags.EnableFor(box);
    Tags.AddTagsTo(box, 'album-art');

    const row = Math.floor(i / ALBUMS_PER_ROW);

    // position the box
    box.position.y = BOX_SIZE / 2 + row * 4;
    box.position.z = row * ROW_SPACING;
    box.position.x = (i % ALBUMS_PER_ROW) * BOX_WIDTH + row * 2;

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
    box.material = material;
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
    shineSpotlight(scene, indexOfPlaying);
  }
};

const createFloor = (scene: Scene, albumCount: number) => {
  const floorWidthBuffer = 20;

  const rows = Math.ceil(albumCount / ALBUMS_PER_ROW);

  const allBoxes = scene.getMeshesByTags(BOX_TAG);

  const mirror = MeshBuilder.CreateBox(
    'floor', // name property
    {
      width: albumCount * BOX_WIDTH + floorWidthBuffer,
      height: 0.1,
      depth: rows * (10 + ROW_SPACING),
    },
    scene,
  );

  // mirror.rotation = new Vector3(Math.PI / 2, 0, 0);
  mirror.position = new Vector3(
    0.5 * (albumCount * BOX_WIDTH) - 0.5 * BOX_SIZE,
    0,
    0,
  );

  const material = new StandardMaterial('mirror', scene);
  material.reflectionTexture = new MirrorTexture('mirror', 1024, scene, true);
  const mirrorMaterialReflectionTexture =
    material.reflectionTexture as MirrorTexture;
  mirrorMaterialReflectionTexture.mirrorPlane = new Plane(
    0,
    -1.0,
    -Math.PI / 4,
    -0,
  );
  mirrorMaterialReflectionTexture.renderList = [...allBoxes];
  mirrorMaterialReflectionTexture.adaptiveBlurKernel = 32;
  mirrorMaterialReflectionTexture.level = 0.5;

  material.diffuseColor = new Color3(0, 0, 0);
  material.specularColor = new Color3(0.15, 1.075, 0.48);

  material.useAlphaFromDiffuseTexture = true;
  material.useSpecularOverAlpha = true;

  const probe = new ReflectionProbe('probe', 512, scene);
  allBoxes.forEach((mesh) => probe.renderList?.push(mesh));

  mirror.material = material;
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

  createFloor(scene, albums.length);
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
