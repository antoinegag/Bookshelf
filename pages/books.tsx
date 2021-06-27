// @ts-nocheck
import {
  BookEntry,
  getCachedBookshelf,
  getCachedUserData,
} from "../lib/scrapper/GoodReads";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

function Book({ coverUrl, position }) {
  const mesh = useRef();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [cameraVerticalPosition, setCameraVerticalPosition] = useState(0); // Used to smooth panning

  const rotationSpeed = 0.01;
  const translationSpeed = 0.05;
  const baseRotation = 1.55;

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current != null) {
      const angle = mesh.current.rotation.y;
      const yPosition = mesh.current.position.y;

      if (active) {
        console.log(position);
        camera.position.x = position[0];
        new THREE.Vector3(position[0], position[1], position[2]);
      }

      if (hovered) {
        mesh.current.rotation.y = Math.min(
          angle + rotationSpeed,
          baseRotation - 0.3
        );
        mesh.current.position.y = Math.min(yPosition + translationSpeed, 0.1);
      } else {
        mesh.current.rotation.y = Math.max(angle - rotationSpeed, baseRotation);
        mesh.current.position.y = Math.max(yPosition - translationSpeed, 0);
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
        position={position}
        ref={mesh}
        rotation={[0, baseRotation, 0]}
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

  camera.lookAt(new THREE.Vector3(1, 10, 1));

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
      {/* <CameraControls /> */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Book
        position={[0, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364251156l/1307582.jpg"
      />
      <Book
        position={[0.8, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1387770614l/17290807.jpg"
      />
      <Book
        position={[1.6, 0, 0]}
        coverUrl="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1421139927l/23719262.jpg"
      />
      <Book
        position={[2.4, 0, 0]}
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

export const getStaticProps: GetStaticProps = async (context) => {
  const userId = "131654245-antoine";
  const userData = await getCachedUserData(userId);
  const readingBookshelfUrl = userData?.bookshelves["currently-reading‎"];
  let currentlyReadingBooks: BookEntry[] = [];
  if (readingBookshelfUrl) {
    currentlyReadingBooks = await getCachedBookshelf(readingBookshelfUrl);
  }

  return {
    props: {
      user: userData,
      currentlyReading: currentlyReadingBooks,
    },
  };
};
