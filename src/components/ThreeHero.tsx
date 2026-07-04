import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Stars,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

/* ────────────────────────────────────────────────────────────────
   React Canvas Error Boundary (WebGL Fallback Support)
────────────────────────────────────────────────────────────────── */
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Canvas rendering fallback activated:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ────────────────────────────────────────────────────────────────
   Marble Dust Particles — Computed once at module boundary (Purity compliant)
────────────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 400;
const [PARTICLE_POSITIONS, PARTICLE_COLORS] = (() => {
  const count = PARTICLE_COUNT;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const random = () => Math.random();
  for (let i = 0; i < count; i++) {
    const r = 10 + random() * 6;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = (random() - 0.5) * 12;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 3;
    
    const t = random();
    if (t < 0.4) {
      // Gold
      col[i * 3] = 0.78 + random() * 0.22;
      col[i * 3 + 1] = 0.55 + random() * 0.2;
      col[i * 3 + 2] = 0.1 + random() * 0.15;
    } else {
      // Cream/White
      col[i * 3] = 0.9 + random() * 0.1;
      col[i * 3 + 1] = 0.88 + random() * 0.12;
      col[i * 3 + 2] = 0.82 + random() * 0.18;
    }
  }
  return [pos, col];
})();

const MarbleDust = () => {
  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
        <bufferAttribute attach="attributes-color"    args={[PARTICLE_COLORS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

/* ────────────────────────────────────────────────────────────────
   Animated Marble/Granite Slab
────────────────────────────────────────────────────────────────── */
interface SlabProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  baseColor: string;
  roughness: number;
  metalness: number;
  emissive?: string;
  emissiveIntensity?: number;
  driftSpeed?: number;
  driftAmt?: number;
  floatSpeed?: number;
}

const MarbleSlab = ({
  position, rotation, scale,
  baseColor, roughness, metalness,
  emissive = '#000000', emissiveIntensity = 0,
  driftSpeed = 0.22, driftAmt = 0.03,
  floatSpeed = 1.2,
}: SlabProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * driftSpeed) * driftAmt;
    meshRef.current.rotation.x = rotation[0] + Math.cos(t * driftSpeed * 0.7) * (driftAmt * 0.45);
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * driftSpeed * 0.5) * (driftAmt * 0.3);
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.08} floatIntensity={0.6} position={position}>
      <mesh ref={meshRef} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={roughness}
          metalness={metalness}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </Float>
  );
};

/* ────────────────────────────────────────────────────────────────
   Gold Accent Ring
────────────────────────────────────────────────────────────────── */
const GoldRing = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.35) * 0.12;
    ref.current.rotation.z = t * 0.18;
    ref.current.position.y = position[1] + Math.sin(t * 0.55) * 0.18;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.55, 0.022, 16, 60]} />
      <meshStandardMaterial color="#C8962E" roughness={0.05} metalness={1.0} />
    </mesh>
  );
};

/* ────────────────────────────────────────────────────────────────
   Gold Vein Slab
────────────────────────────────────────────────────────────────── */
const GoldVeinSlab = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = t * 0.06;
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.12;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[3.5, 0.012, 0.012]} />
      <meshStandardMaterial color="#d4a832" roughness={0.02} metalness={1.0} emissive="#b88820" emissiveIntensity={0.6} />
    </mesh>
  );
};

/* ────────────────────────────────────────────────────────────────
   Granite Crystals Showcase
────────────────────────────────────────────────────────────────── */
const GraniteCrystals = () => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.08;
  });
  return (
    <group ref={ref}>
      {[
        { pos: [-2.2, 1.2, 0.5], scale: 0.45, color: '#C8962E', emissive: '#6e4f10' },
        { pos: [2.5, -0.5, 0.8], scale: 0.35, color: '#4B5563', emissive: '#111827' },
        { pos: [1.8, 2.2, -0.5], scale: 0.4, color: '#D4AF37', emissive: '#805b10' },
      ].map((c, i) => (
        <mesh key={i} position={c.pos as [number, number, number]} scale={c.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={c.color}
            roughness={0.02}
            metalness={0.98}
            emissive={c.emissive}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ────────────────────────────────────────────────────────────────
   Sanitary Ware Ceramic Bowl & Gold Tap
────────────────────────────────────────────────────────────────── */
const CeramicBasin = () => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.08 + 0.15;
  });
  return (
    <group ref={ref} position={[0.2, -0.2, -0.5]}>
      {/* Basin Bowl */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.1, 0.7, 64, 1, true]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.02} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {/* Basin Inside Bottom */}
      <mesh position={[0, -0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 64]} />
        <meshStandardMaterial color="#EEEEEE" roughness={0.05} metalness={0.05} />
      </mesh>
      {/* Gold Drain Cap */}
      <mesh position={[0, -0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#C8962E" roughness={0.05} metalness={0.95} />
      </mesh>
      {/* Glowing Base Halo Ring */}
      <mesh position={[0, -0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 64]} />
        <meshStandardMaterial color="#C8962E" emissive="#C8962E" emissiveIntensity={3} roughness={0.1} />
      </mesh>
    </group>
  );
};

const GoldFaucet = () => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = -state.clock.getElapsedTime() * 0.12;
  });
  return (
    <group ref={ref} position={[0.2, 1.1, -0.5]}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
        <meshStandardMaterial color="#C8962E" roughness={0.05} metalness={1.0} />
      </mesh>
      <mesh position={[0.22, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.44, 12]} />
        <meshStandardMaterial color="#C8962E" roughness={0.05} metalness={1.0} />
      </mesh>
      <mesh position={[0.44, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.22, 12]} />
        <meshStandardMaterial color="#C8962E" roughness={0.05} metalness={1.0} />
      </mesh>
    </group>
  );
};

/* ────────────────────────────────────────────────────────────────
   Tiles Grid Showcase
────────────────────────────────────────────────────────────────── */
const TilesGridShowcase = () => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.06;
  });
  return (
    <group ref={ref} position={[0.2, 0.1, -1]}>
      {[
        { pos: [-1.1, 1.1, 0], color: '#FAFAFA', r: 0.02, m: 0.1 },
        { pos: [1.1, 1.1, 0], color: '#16161f', r: 0.05, m: 0.95 },
        { pos: [-1.1, -1.1, 0], color: '#C8962E', r: 0.05, m: 0.85 },
        { pos: [1.1, -1.1, 0], color: '#374151', r: 0.08, m: 0.5 },
      ].map((tile, i) => (
        <group key={i} position={tile.pos as [number, number, number]}>
          {/* Gold Frame backing */}
          <mesh position={[0, 0, -0.015]}>
            <boxGeometry args={[1.86, 1.86, 0.04]} />
            <meshStandardMaterial color="#C8962E" roughness={0.05} metalness={1.0} />
          </mesh>
          {/* Tile Surface */}
          <mesh>
            <boxGeometry args={[1.78, 1.78, 0.04]} />
            <meshStandardMaterial color={tile.color} roughness={tile.r} metalness={tile.m} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ────────────────────────────────────────────────────────────────
   Smooth Group transitioning scale based on active slide
────────────────────────────────────────────────────────────────── */
const SmoothGroup = ({ active, children }: { active: boolean; children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (!ref.current) return;
    const targetScale = active ? 1 : 0;
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.08);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, 0.08);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, targetScale, 0.08);
    ref.current.visible = active || ref.current.scale.x > 0.01;
  });
  return (
    <group ref={ref}>
      {children}
    </group>
  );
};

/* ────────────────────────────────────────────────────────────────
   Camera Auto-pan
────────────────────────────────────────────────────────────────── */
const CameraController = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.08) * 1.2;
    state.camera.position.y = Math.cos(t * 0.06) * 0.4 + 0.3;
    state.camera.lookAt(0.3, 0, 0);
  });
  return null;
};

/* ────────────────────────────────────────────────────────────────
   Cinematic Scene Renderer (Optimized with standard lights)
────────────────────────────────────────────────────────────────── */
interface CinematicSceneProps {
  activeModel: 'marble' | 'granite' | 'sanitary' | 'tiles';
}

const CinematicScene = ({ activeModel }: CinematicSceneProps) => (
  <>
    {/* Lights layout (0 CDNs, instant load) */}
     <ambientLight intensity={0.5} color="#1a120a" />
     <directionalLight position={[8, 12, 4]}  intensity={2.8} color="#FFF5E0" />
     <directionalLight position={[-8, -4, -6]} intensity={1.5} color="#C8962E" />
     <pointLight       position={[0, 8, 2]}   intensity={3.5} color="#F7F3EC" distance={20} />
     <pointLight       position={[3, -2, 4]}  intensity={2.5} color="#C8962E" distance={12} />
     <pointLight       position={[-4, 2, -2]} intensity={1.5} color="#C8962E" distance={15} />

    <CameraController />

    <Suspense fallback={null}>
      {/* 1. MARBLE MODEL GROUP */}
      <SmoothGroup active={activeModel === 'marble'}>
        <MarbleSlab
          position={[0.3, 0.2, -1.5]}
          rotation={[0, -0.15, 0.02]}
          scale={[4.5, 6.5, 1]}
          baseColor="#0c0c12"
          roughness={0.05}
          metalness={0.95}
          driftSpeed={0.2}
          driftAmt={0.025}
          floatSpeed={0.8}
        />
        <MarbleSlab
          position={[-2.5, -0.3, 0.5]}
          rotation={[0, 0.4, -0.05]}
          scale={[2.8, 4.2, 1]}
          baseColor="#F5F0E8"
          roughness={0.08}
          metalness={0.25}
          driftSpeed={0.28}
          driftAmt={0.04}
          floatSpeed={1.1}
        />
        <MarbleSlab
          position={[2.8, -1.0, 0.8]}
          rotation={[0.05, -0.55, 0.08]}
          scale={[1.8, 2.5, 1]}
          baseColor="#8B6914"
          roughness={0.12}
          metalness={0.88}
          emissive="#7a5a10"
          emissiveIntensity={0.3}
          driftSpeed={0.38}
          driftAmt={0.055}
          floatSpeed={1.5}
        />
        <GoldRing position={[2.6, 0.3, 0.6]} />
        <GoldRing position={[-2.0, 1.5, -0.3]} />
        <GoldVeinSlab position={[0, 1.5, 0.8]} />
        <GoldVeinSlab position={[0.5, -0.8, 1.0]} />
      </SmoothGroup>

      {/* 2. GRANITE MODEL GROUP */}
      <SmoothGroup active={activeModel === 'granite'}>
        <MarbleSlab
          position={[0.3, 0.2, -1.5]}
          rotation={[0, 0.1, -0.02]}
          scale={[4.2, 6.2, 1]}
          baseColor="#111118"
          roughness={0.05}
          metalness={0.98}
          driftSpeed={0.15}
          driftAmt={0.02}
          floatSpeed={0.95}
        />
        <MarbleSlab
          position={[-2.4, -0.5, 0.4]}
          rotation={[0, -0.35, 0.05]}
          scale={[2.6, 3.8, 1]}
          baseColor="#33333a"
          roughness={0.15}
          metalness={0.85}
          driftSpeed={0.22}
          floatSpeed={1.2}
        />
        <GraniteCrystals />
      </SmoothGroup>

      {/* 3. SANITARY MODEL GROUP */}
      <SmoothGroup active={activeModel === 'sanitary'}>
        <CeramicBasin />
        <GoldFaucet />
      </SmoothGroup>

      {/* 4. TILES MODEL GROUP */}
      <SmoothGroup active={activeModel === 'tiles'}>
        <TilesGridShowcase />
      </SmoothGroup>

      {/* Scene Addons */}
      <MarbleDust />
      <Stars radius={60} depth={30} count={300} factor={1.5} saturation={0.1} fade speed={0.3} />
    </Suspense>
  </>
);

/* ────────────────────────────────────────────────────────────────
   Slide Animations
────────────────────────────────────────────────────────────────── */
const textVariants = {
  hidden:  { opacity: 0, y: 35, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.9, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const HERO_SLIDES = [
  {
    tag: 'ESTABLISHED 2003 · NADIAD, GUJARAT',
    heading1: 'Premium Italian',
    heading2: 'Marble Collections',
    sub: 'Authorized dealer for Italy\'s finest marble brands. Discover Carrara, Calacatta, and Statuario of the highest grade.',
    btnLabel: 'Browse Marble Slabs',
    btnRoute: '/marble',
    modelType: 'marble' as const,
  },
  {
    tag: 'NATURAL & ENGINEERED STONE',
    heading1: 'Sleek Granite &',
    heading2: 'Quartz Surfaces',
    sub: 'Extremely durable countertops, wall claddings, and floorings. Premium Black Galaxy, Kashmir White, and Quartz.',
    btnLabel: 'Explore Granite',
    btnRoute: '/granite',
    modelType: 'granite' as const,
  },
  {
    tag: 'LUXURY BATHROOM FITTINGS',
    heading1: 'Designer Sanitary',
    heading2: 'Ware & Faucets',
    sub: 'Upgrading bathrooms with premium water closets, wash basins, faucets, and showers in multiple custom finishes.',
    btnLabel: 'View Sanitary Ware',
    btnRoute: '/sanitary-ware',
    modelType: 'sanitary' as const,
  },
  {
    tag: 'COLOR TILES EXCLUSIVE PARTNER',
    heading1: 'Premium Ceramic &',
    heading2: 'Vitrified Tiles',
    sub: 'Floor tiles, designer wall panels, and high-gloss vitrified tiles. Browse or download PDF catalogs instantly.',
    btnLabel: 'Download Tiles PDF',
    btnRoute: '/tiles-catalog',
    modelType: 'tiles' as const,
  }
];

/* ────────────────────────────────────────────────────────────────
   Main Hero Component
────────────────────────────────────────────────────────────────── */
const ThreeHero: React.FC = () => {
  const [slide, setSlide] = useState(0);

  // Auto transition every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(curr => (curr + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = HERO_SLIDES[slide];

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-center bg-[#0c0a1a]"
         style={{ background: 'radial-gradient(ellipse at 35% 50%, #0c0a1a 0%, #050508 60%, #000000 100%)' }}>

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
           style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.025]"
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)', backgroundSize: '100% 4px' }} />

      {/* ─── 3D Canvas with error boundary and performance boosts ─── */}
      <div className="absolute inset-0 z-0">
        <CanvasErrorBoundary fallback={<div className="absolute inset-0 bg-[#050505] opacity-80" />}>
          <Canvas
            camera={{ position: [0, 0.5, 9], fov: 38 }}
            dpr={[1, 1.5]}
            frameloop="always"
            gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
          >
            <CinematicScene activeModel={activeSlide.modelType} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* ─── Overlay gradients ─── */}
      <div className="absolute left-0 top-0 bottom-0 w-[40%] pointer-events-none z-[2]"
           style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }} />

      {/* ─── Slide Content Staggered Animations ─── */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full pointer-events-none mt-16 md:mt-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-2xl"
          >
            {/* Tagline */}
            <motion.div
              custom={0}
              variants={textVariants}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-8 bg-[#C8962E]" />
              <span className="text-[#C8962E] text-xs font-bold tracking-[0.25em] uppercase font-outfit">
                {activeSlide.tag}
              </span>
            </motion.div>

            {/* Heading — Luxury typography using Playfair Display font */}
            <motion.h1
              custom={1}
              variants={textVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-luxury font-bold text-white leading-[1.05] tracking-tight mb-5"
            >
              <span className="block">{activeSlide.heading1}</span>
              <span className="block text-gradient-gold italic font-normal">{activeSlide.heading2}</span>
            </motion.h1>

            {/* Divider line */}
            <motion.div
              custom={2}
              variants={textVariants}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-36 bg-gradient-to-r from-[#C8962E] to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8962E]" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              custom={3}
              variants={textVariants}
              className="text-gray-300 text-sm sm:text-base md:text-lg max-w-lg font-light leading-relaxed mb-9 font-sans"
            >
              {activeSlide.sub}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={4}
              variants={textVariants}
              className="flex flex-row flex-wrap gap-4 pointer-events-auto"
            >
              <Link to={activeSlide.btnRoute} className="btn-accent text-sm px-6 py-3.5 shadow-2xl hover:brightness-115">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                {activeSlide.btnLabel}
              </Link>
              <Link to="/contact" className="btn-secondary text-sm px-6 py-3.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.57 4.5 2 2 0 0 1 3.56 2.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation indicators */}
      <div className="absolute bottom-28 left-6 sm:left-12 lg:left-20 z-10 flex gap-3 pointer-events-auto">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="w-8 py-2 group focus:outline-none cursor-pointer"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slide ? 'bg-[#C8962E] w-8' : 'bg-white/20 group-hover:bg-white/40 w-4'
            }`} />
          </button>
        ))}
      </div>

      {/* ─── Bottom Stats Bar ─── */}
      <motion.div
        className="absolute bottom-0 w-full z-10 hidden md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-dark border-t border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              {[
                { value: '6+',   label: 'Premium Brands' },
                { value: '500+', label: 'Stone Products' },
                { value: '20+',  label: 'Years of Trust' },
                { value: '∞',    label: 'Design Possibilities' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xl font-heading font-black text-gradient-gold">{s.value}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest">{s.label}</span>
                  {i < 3 && <div className="w-px h-5 bg-white/10 ml-4" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-[11px] font-medium font-sans">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Showroom Open · Mon–Sat 9AM–7PM
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 right-8 z-10 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="text-white/30 text-[9px] uppercase tracking-[0.25em] rotate-90 origin-center mb-4">Scroll</div>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-transparent to-[#C8962E]"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};

export default ThreeHero;
