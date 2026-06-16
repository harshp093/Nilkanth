import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Preload, RoundedBox, ContactShadows, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

interface MarbleSlabProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number] | number;
  color: string;
  roughness: number;
  metalness: number;
  driftSpeed?: number;
  driftAmount?: number;
}

// Animated marble slab with smooth per-frame rotation drift
const MarbleSlab = ({
  position,
  rotation,
  scale,
  color,
  roughness,
  metalness,
  driftSpeed = 0.3,
  driftAmount = 0.04,
}: MarbleSlabProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth sinusoidal drift on top of the Float component
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * driftSpeed) * driftAmount;
    meshRef.current.rotation.x = rotation[0] + Math.cos(t * driftSpeed * 0.7) * (driftAmount * 0.5);
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.15}
      floatIntensity={0.8}
      position={position}
    >
      <RoundedBox
        ref={meshRef}
        args={[1, 1, 0.05]}
        radius={0.012}
        smoothness={4}
        scale={scale}
        rotation={rotation}
      >
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          envMapIntensity={2.5}
        />
      </RoundedBox>
    </Float>
  );
};

// Thin floating accent ring for extra depth
const AccentRing = () => {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.08;
    ringRef.current.rotation.z = t * 0.12;
    ringRef.current.position.y = -0.5 + Math.sin(t * 0.6) * 0.15;
  });

  return (
    <mesh ref={ringRef} position={[2, -0.5, 0.5]}>
      <torusGeometry args={[0.6, 0.025, 16, 64]} />
      <meshStandardMaterial
        color="#E8553A"
        roughness={0.1}
        metalness={0.9}
        envMapIntensity={3}
      />
    </mesh>
  );
};

const ThreeHero: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full bg-dark overflow-hidden flex flex-col justify-center">
      {/* Sophisticated Black & Cream White Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F7F5F2] opacity-[0.07] blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F7F5F2] opacity-[0.03] blur-[120px] pointer-events-none"></div>

      {/* 3D Canvas — frameloop="always" is required for smooth continuous animation */}
      <div className="absolute inset-0 z-0 opacity-90 pointer-events-none md:pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 35 }}
          dpr={[1, 2]}
          frameloop="always"
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.4} color="#F7F5F2" />
          <directionalLight position={[-10, -10, -5]} color="#E8553A" intensity={0.4} />
          <spotLight position={[0, 10, 0]} intensity={1.8} angle={0.6} penumbra={1} color="#F7F5F2" castShadow />

          <Suspense fallback={null}>
            <PresentationControls
              global
              zoom={1}
              rotation={[0, -Math.PI / 4, 0]}
              polar={[-0.1, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
              {/* Main Premium Dark Slab */}
              <MarbleSlab
                position={[0.5, 0, -1]}
                rotation={[0, -0.2, 0]}
                scale={[4, 6, 1]}
                color="#0a0a0a"
                roughness={0.08}
                metalness={0.92}
                driftSpeed={0.25}
                driftAmount={0.035}
              />

              {/* Secondary Accent Slab (Cream White) */}
              <MarbleSlab
                position={[-1.5, -0.5, 0.5]}
                rotation={[0, 0.3, 0]}
                scale={[2.5, 4, 1]}
                color="#F7F5F2"
                roughness={0.12}
                metalness={0.3}
                driftSpeed={0.35}
                driftAmount={0.05}
              />

              {/* Small Accent Tile (Brand Orange) */}
              <MarbleSlab
                position={[1.5, -1.5, 1.5]}
                rotation={[0.1, -0.5, 0.1]}
                scale={[1.5, 1.5, 1]}
                color="#E8553A"
                roughness={0.18}
                metalness={0.55}
                driftSpeed={0.45}
                driftAmount={0.06}
              />

              <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={25} blur={3} far={5} color="#000000" />
            </PresentationControls>

            {/* Floating accent ring for depth */}
            <AccentRing />

            {/* Studio lighting environment for premium reflections */}
            <Environment preset="city" />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 w-full max-w-5xl mx-auto pointer-events-none mt-16 md:mt-0">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Premium Marble & <br className="hidden md:block"/>Tile Collections
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-2xl text-gray-200 mb-8 md:mb-10 max-w-2xl drop-shadow-md font-light px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Authorized dealer for top Italian & Indian brands — Nadiad, Gujarat
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 pointer-events-auto px-4 sm:px-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Link to="/catalog" className="btn-primary text-base md:text-lg w-full sm:w-auto px-8 py-4 shadow-lg shadow-primary/30">
            Browse Catalog →
          </Link>
          <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-dark text-base md:text-lg w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm">
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Stats Strip */}
      <motion.div
        className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md border-t border-white/10 py-6 z-10 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-around text-white font-heading text-xl">
          {[
            { value: '6+', label: 'Brands' },
            { value: '500+', label: 'Products' },
            { value: '20+', label: 'Years of Trust' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.1, ease: 'easeOut' }}
            >
              <span className="text-3xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm font-sans tracking-widest uppercase text-gray-300 mt-1">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ThreeHero;
