import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  Bounds,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

import {
  MeshBasicNodeMaterial,
  MeshStandardNodeMaterial,
  positionLocal,
  color as colorNode,
} from "three/examples/jsm/nodes/Nodes";

import { WebGPU } from "./WebGPU";
import { Model } from "./Model";
import { UI } from "./UI";

extend({ MeshBasicNodeMaterial, MeshStandardNodeMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshBasicNodeMaterial: any;
      meshStandardNodeMaterial: any;
    }
  }
}

function Thing() {
  return <Model />;
}

export default function App() {
  return (
    <>
      <Canvas shadows>
        <WebGPU>
          <OrbitControls makeDefault autoRotate />
          <PerspectiveCamera position={[2, 1, 2]} makeDefault />

          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />

          <Bounds fit clip observe margin={1.3}>
            <Thing />
          </Bounds>
        </WebGPU>
      </Canvas>
      <UI />
    </>
  );
}
