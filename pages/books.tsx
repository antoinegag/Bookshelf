// @ts-nocheck
import React, { useRef, useState, useMemo } from "react";
import { useHelper } from "@react-three/drei";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

function Book(props) {
  const { coverUrl } = props;
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const rotationSpeed = 0.07;
  const translationSpeed = 0.05;
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current != null) {
      const angle = mesh.current.rotation.y;
      const yPosition = mesh.current.position.z;

      if (active) {
        mesh.current.rotation.y = Math.min(angle + rotationSpeed, 2);

        mesh.current.position.z = Math.min(yPosition + translationSpeed, 1);
        return;
      } else {
        mesh.current.position.z = Math.max(yPosition - translationSpeed, 0);
      }

      if (hovered) {
        mesh.current.rotation.y = Math.min(angle + rotationSpeed, 2);
        mesh.current.position.z = Math.min(yPosition + translationSpeed, 1);
      } else {
        mesh.current.rotation.y = Math.max(angle - rotationSpeed, 0);
        mesh.current.position.z = Math.max(yPosition - translationSpeed, 0);
      }
    }
  });

  const texture = useMemo(
    () => new THREE.TextureLoader().load(coverUrl),
    [coverUrl]
  );

  const textOptions = {
    size: 100,
    height: 1,
  };

  return (
    <>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <boxGeometry args={[0.1, 1, 0.6]} />
        <meshStandardMaterial map={texture} attachArray="material" />
        <meshStandardMaterial map={texture} attachArray="material" />
        <meshStandardMaterial attachArray="material" />
        <meshStandardMaterial attachArray="material" />
        <meshStandardMaterial color="#404040" attachArray="material" />
        <meshStandardMaterial attachArray="material" />
      </mesh>
      <mesh>
        <textGeometry attach="geometry" args={["three.js", textOptions]} />
        <meshStandardMaterial attach="material" />
      </mesh>
    </>
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
      <Book
        position={[0, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364251156l/1307582.jpg"
      />
      <Book
        position={[0.2, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364251156l/1307582.jpg"
      />
      <Book
        position={[0.4, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364251156l/1307582.jpg"
      />
      <Book
        position={[0.6, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364251156l/1307582.jpg"
      />
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
