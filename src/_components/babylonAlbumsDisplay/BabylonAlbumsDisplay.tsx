import { Album, SpotifyAlbum } from '@/types';
import {
  Vector3,
  MeshBuilder,
  Scene,
  Mesh,
  ArcRotateCamera,
  PointLight,
  StandardMaterial,
  Texture,
  Vector4,
  DirectionalLight,
  SpotLight,
  EventState,
  PointerInfo,
  PointerEventTypes,
  ActionManager,
  ExecuteCodeAction,
} from '@babylonjs/core';
import BabylonCanvas from '../babylonCanvas/BabylonCanvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clientSpotifyFetch } from '@/_utils/clientUtils';
import useGetActiveDevice, {
  GetActiveDevice,
} from '@/_hooks/useGetActiveDevice';
import useGetAuthToken from '@/_hooks/useGetAuthToken';

interface BabylonAlbumsDisplayProps {
  albums: SpotifyAlbum[];
}

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
    -200,
    0,
    0,
    new Vector3(0, 0, -15),
    scene,
  );

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  // const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  const dLight = new DirectionalLight('dl', new Vector3(0, 0, 3), scene);
  // const light = new SpotLight(
  //   'spotLight',
  //   new Vector3(0, 30, -10),
  //   new Vector3(0, -1, 0),
  //   Math.PI / 3,
  //   2,
  //   scene,
  // );

  // Default intensity is 1. Let's dim the light a small amount
  dLight.intensity = 0.5;
};

const playAlbum = async (
  spotifyId: string,
  getActiveDevice: GetActiveDevice,
  authToken: string,
) => {
  // const { id: deviceId } = await getActiveDevice();
  let deviceId;

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
};

const addAlbums = (
  scene: Scene,
  albums: SpotifyAlbum[],
  getActiveDevice: GetActiveDevice,
  authToken: string,
) => {
  const faceUV: Vector4[] = new Array(6);

  for (var i = 0; i < 6; i++) {
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
    box.position.y = 3;
    box.position.x = i * 4.5;

    // add click action
    box.actionManager = new ActionManager(scene);
    box.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnLeftPickTrigger,
        },
        async () => await playAlbum(box.name, getActiveDevice, authToken),
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
  getActiveDevice: GetActiveDevice,
  authToken: string,
) => {
  createScene(scene);

  addAlbums(scene, albums, getActiveDevice, authToken);

  // TODO - change this to water and reflect.
  // MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
};

export default function BabylonAlbumsDisplay({
  albums,
}: BabylonAlbumsDisplayProps) {
  const getActiveDevice = useGetActiveDevice();
  const authToken = useGetAuthToken();

  const handleSceneReady = useCallback(
    (scene: Scene) => onSceneReady(scene, albums, getActiveDevice, authToken),
    [albums, authToken, getActiveDevice],
  );

  return (
    <div className="overflow-hidden" style={{ height: 'calc(100vh - 124px)' }}>
      <BabylonCanvas
        antialias
        onSceneReady={handleSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
    </div>
  );
}
