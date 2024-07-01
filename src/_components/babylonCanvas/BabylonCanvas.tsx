'use-client';

import { useEffect, useRef, useState } from 'react';
import {
  Color3,
  Color4,
  Engine,
  EngineOptions,
  Scene,
  SceneOptions,
} from '@babylonjs/core';
import { Dimensions } from '@/types';
import { Container } from 'postcss';

interface BabylonCanvasProps extends Record<string, any> {
  antialias?: boolean;
  adaptToDeviceRatio?: boolean;
  engineOptions?: EngineOptions;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene) => void;
  onSceneReady: (scene: Scene) => void;
}

export default function BabylonCanvas({
  antialias,
  engineOptions = {},
  adaptToDeviceRatio,
  sceneOptions = {},
  onRender,
  onSceneReady,
  ...rest
}: BabylonCanvasProps) {
  const reactCanvas = useRef(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio,
    );

    const scene = new Scene(engine, sceneOptions);
    scene.clearColor = new Color4(0, 0, 0, 0);

    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === 'function') onRender(scene);
      scene.render();
    });
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      className="outline-none"
      width={dimensions.width}
      height={dimensions.height}
      ref={reactCanvas}
      {...rest}
    />
  );
}
