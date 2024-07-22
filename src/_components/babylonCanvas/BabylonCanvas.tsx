'use-client';

import { memo, useEffect, useRef, useState } from 'react';
import {
  Color4,
  Engine,
  EngineOptions,
  EventState,
  PointerInfo,
  Scene,
  SceneOptions,
} from '@babylonjs/core';
import { Dimensions } from '@/types';
import classNames from 'classnames';

interface BabylonCanvasProps extends Record<string, any> {
  antialias?: boolean;
  adaptToDeviceRatio?: boolean;
  hideCanvas?: boolean;
  engineOptions?: EngineOptions;
  sceneOptions?: SceneOptions;
  onRender?: (scene: Scene) => void;
  onSceneReady: (scene: Scene) => void;
  onPointerObservable?: (
    eventInfo: PointerInfo,
    eventState: EventState,
  ) => void;
}

const BabylonCanvas = ({
  antialias,
  engineOptions = {},
  adaptToDeviceRatio = true,
  sceneOptions = {},
  hideCanvas,
  onRender,
  onSceneReady,
  onPointerObservable,
  ...rest
}: BabylonCanvasProps) => {
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

    if (onPointerObservable) {
      scene.onPointerObservable.add(onPointerObservable);
    }

    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    onRender?.(scene);
    scene.render();

    engine.runRenderLoop(() => {
      onRender?.(scene);
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    onPointerObservable,
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
      className={classNames('outline-none', { 'opacity-0': hideCanvas })}
      width={dimensions.width}
      height={dimensions.height}
      ref={reactCanvas}
      {...rest}
    />
  );
};

const MemoizedBabylonCanvas = memo(BabylonCanvas);
export default MemoizedBabylonCanvas;
