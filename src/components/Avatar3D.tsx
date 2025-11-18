// @ts-nocheck
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { Mesh } from 'three';

function Avatar() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#3B82F6"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Avatar3D({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="h-[400px] w-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Avatar />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {/* Overlay con instrucción */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 px-3 py-1 rounded-full backdrop-blur">
        ↻ Arrastra para rotar
      </div>
    </div>
  );
}
