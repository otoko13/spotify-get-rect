import { Album, SpotifyAlbum } from '@/types';
import {
  Vector3,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  PointLight,
  StandardMaterial,
  Texture,
  Vector4,
  DirectionalLight,
  SpotLight,
  ActionManager,
  ExecuteCodeAction,
  Color3,
} from '@babylonjs/core';
import BabylonCanvas from '../babylonCanvas/BabylonCanvas';
import { useCallback, useState } from 'react';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import useGetAuthToken from '@/_hooks/useGetAuthToken';
import { Cookies, useCookies } from 'next-client-cookies';

import { Inspector } from '@babylonjs/inspector';

interface BabylonAlbumsDisplayProps {
  albums: SpotifyAlbum[];
}

const BOX_SIZE = 3;
const BOX_GAP = 1.5;

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
  // This creates and positions a free camera (non-mesh)
  const camera = new ArcRotateCamera(
    'camera1',
    0,
    0.01,
    0,
    new Vector3(0, 0, -15),
    scene,
  );

  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  // const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  const frontLight = new DirectionalLight('dl', new Vector3(0, -3.5, 8), scene);
  const backLight = new DirectionalLight('dl', new Vector3(0, -3, -7), scene);
  const spotLight = new SpotLight(
    'spot',
    new Vector3(0, 10, -9),
    new Vector3(0, -1, 1),
    Math.PI / 10,
    200,
    scene,
  );

  const spotLightColor = new Color3(30, 215, 96);

  spotLight.specular = spotLightColor;
  spotLight.diffuse = spotLightColor;
  spotLight.intensity = 0.1;

  // Default intensity is 1. Let's dim the light a small amount
  frontLight.intensity = 0.9;
  backLight.intensity = 0.3;
};

const playAlbum = async (
  spotifyId: string,
  authToken: string,
  cookies: Cookies,
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

  // add spot light
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

    // position the box
    box.position.y = BOX_SIZE / 2;
    box.position.x = i * (BOX_SIZE + BOX_GAP);

    // add click action
    box.actionManager = new ActionManager(scene);
    box.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnLeftPickTrigger,
        },
        async () => await playAlbum(box.name, authToken, cookies),
      ),
    );

    const material = new StandardMaterial('material', scene);
    const texture = new Texture(album.images[1].url, scene);
    material.diffuseTexture = texture;
    box.material = material;
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

  // Inspector.Show(scene, {});

  // TODO - change this to water and reflect.
  // MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
};

export default function BabylonAlbumsDisplay({
  albums,
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
      {!ready && (
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
    </div>
  );
}
