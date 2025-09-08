import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows /*, OrbitControls */,
} from "@react-three/drei";
import * as THREE from "three";
import logoUrl from "../assets/logo.glb?url"; // your GLB in src/assets

function Model() {
  const { scene } = useGLTF(logoUrl);
  const ref = useRef();

  // Keep Blender materials, just nudge a few PBR params for a clean white look
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh && o.material) {
        // ensure pure white base
        o.material.color?.set("#ffffff");
        // make sure vertex colors (if any) don't gray it out
        if ("vertexColors" in o.material) o.material.vertexColors = false;
        // nice subtle sheen
        if ("roughness" in o.material) o.material.roughness = 0.25;
        if ("metalness" in o.material) o.material.metalness = 0.0;
        // tiny emissive lift to keep whites punchy under filmic
        if ("emissive" in o.material) {
          o.material.emissive?.set("#ffffff");
          o.material.emissiveIntensity = 0.08; // subtle! increase to ~0.12 if still dull
        }
        o.castShadow = true;
        o.receiveShadow = false;
        o.material.needsUpdate = true;
      }
    });
  }, [scene]);

  // Gentle idle motion (optional)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload(logoUrl);

export default function Logo3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0); // transparent bg
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping; // cinematic curve
        gl.toneMappingExposure = 1.4; // brighten whites
        scene.background = null;
      }}
      style={{ background: "transparent" }}
    >
      {/* Key + fill */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[4, 6, 5]}
        intensity={1} // brighter key light
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* HDRI environment for nice reflections/overall lift */}
      <Environment preset="studio" />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      {/* Soft ground shadow under the logo */}
      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.35}
        scale={10}
        blur={2.6}
        far={5}
      />

      {/* Debug if needed */}
      {/* <OrbitControls makeDefault /> */}
      {/* <axesHelper args={[2]} /> */}
    </Canvas>
  );
}
