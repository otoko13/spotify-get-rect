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
} from '@babylonjs/core';
import BabylonCanvas from '../babylonCanvas/BabylonCanvas';
import { useCallback } from 'react';

interface BabylonAlbumsDisplayProps {
  albums: SpotifyAlbum[];
}

let box: Mesh;

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
    0,
    1,
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
  const light = new PointLight('pl', new Vector3(-2, 10, -10), scene);
  const light2 = new PointLight('pl', new Vector3(-2, 0, 3), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 1;
  light2.intensity = 0.5;
};

const addAlbums = (scene: Scene, albums: SpotifyAlbum[]) => {
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
    box = MeshBuilder.CreateBox(
      'box',
      { width: 3, height: 3, depth: 0.1, faceUV },
      scene,
    );

    // Move the box upward 1/2 its height
    box.position.y = 3;
    box.position.x = i * 4.5;

    const material = new StandardMaterial('material', scene);
    const texture = new Texture(album.images[1].url, scene);
    material.diffuseTexture = texture;
    box.material = material;
  });
};

export default function BabylonAlbumsDisplay({
  albums,
}: BabylonAlbumsDisplayProps) {
  const onSceneReady = useCallback(
    (scene: Scene) => {
      createScene(scene);

      addAlbums(scene, albums);

      // TODO - change this to water and reflect.
      // MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
    },
    [albums],
  );

  return (
    <div className="overflow-hidden" style={{ height: 'calc(100vh - 124px)' }}>
      <BabylonCanvas
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
        engineOptions={{}}
      />
    </div>
  );
}
