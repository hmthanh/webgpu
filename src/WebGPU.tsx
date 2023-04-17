import * as React from "react";
import * as THREE from "three";
// @ts-ignore
import WebGPUCapabilities from "three/examples/jsm/capabilities/WebGPU";
// @ts-ignore
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer";
import { useThree } from "@react-three/fiber";
import { toneMapping } from "three/examples/jsm/nodes/Nodes";

export function WebGPU({ children }: React.PropsWithChildren) {
  const [renderer] = React.useState(new WebGPURenderer());

  const gl = useThree((state) => state.gl);
  const [originalGl] = React.useState(gl);

  const size = useThree((state) => state.size);
  const set = useThree((state) => state.set);
  const viewport = useThree((state) => state.viewport);
  const [root, setRoot] = React.useState(gl.domElement.parentElement);

  const [err, setErr] = React.useState(false);

  React.useLayoutEffect(() => {
    if (WebGPUCapabilities.isAvailable() === false) {
      setErr(true);
      alert("No WebGPU support");
      return;
    }

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(viewport.dpr);

    renderer.toneMappingNode = toneMapping(
      gl.toneMapping,
      gl.toneMappingExposure,
      null!
    );
    renderer.outputEncoding = gl.outputEncoding;

    const clearColor = new THREE.Color();
    const clearAlpha = gl.getClearAlpha();
    gl.getClearColor(clearColor);

    renderer.setClearColor(clearColor, clearAlpha);

    renderer.shadowMap = gl.shadowMap;

    if (root) {
      root.appendChild(renderer.domElement);
      originalGl.domElement.remove();
      setRoot(renderer.domElement.parentElement);

      set({ gl: renderer });

      return () => {
        renderer.domElement.remove();
        root.appendChild(originalGl.domElement);
        setRoot(originalGl.domElement.parentElement);

        set({ gl: originalGl });
      };
    }
  }, [renderer]);

  return err ? null! : <>{children}</>;
}
