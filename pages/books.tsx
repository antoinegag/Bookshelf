// @ts-nocheck
import React, { useRef, useState, useMemo } from "react";
import { useHelper } from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  extend,
} from "@react-three/fiber";
import * as THREE from "three";
import { SpotLightHelper } from "three";

function Book(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const rotationSpeed = 0.05;
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current != null) {
      const angle = mesh.current.rotation.x;
      if (hovered) {
        mesh.current.rotation.x = Math.min(angle + rotationSpeed, 1);
      } else {
        mesh.current.rotation.x = Math.max(angle - rotationSpeed, 0);
      }
    }
  });

  const url =
    "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364251156l/1307582.jpg";
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry args={[0.1, 1, 0.5]} />
      <meshStandardMaterial
        // color={hovered ? "hotpink" : "orange"}
        map={texture}
      />
    </mesh>
  );
}

const CameraControls = () => {
  const OrbitControls =
    require("three/examples/jsm/controls/OrbitControls").OrbitControls;
  extend({ OrbitControls });
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
    />
  );
};

function BookShelf() {
  return (
    <Canvas className="min-h-screen">
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Book position={[0, 0, 0]} />
      <Book position={[0.2, 0, 0]} />
    </Canvas>
  );
}

export default function Books() {
  return (
    <div className="min-h-screen">
      <BookShelf />
    </div>
  );
}
