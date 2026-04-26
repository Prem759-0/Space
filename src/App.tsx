/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera, Float, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

import { Galaxy } from './components/Galaxy';
import { Sun } from './components/Sun';
import { Overlay } from './components/Overlay';
import { WarpStreaks } from './components/WarpStreaks';
import { StarData, FAMOUS_STARS } from './constants/stars';

function Scene({ 
  selectedStar, 
  showConstellations, 
  isWarping 
}: { 
  selectedStar: StarData | null; 
  showConstellations: boolean;
  isWarping: boolean;
}) {
  return (
    <>
      <color attach="background" args={['#010103']} />
      <fog attach="fog" args={['#010103', 10, isWarping ? 500 : 1000]} />
      
      <ambientLight intensity={0.2} />
      
      <Suspense fallback={null}>
        <Sun />
        <Galaxy showConstellations={showConstellations} />
        <WarpStreaks active={isWarping} />
        
        {/* Distance markers for famous stars */}
        {FAMOUS_STARS.map((star, idx) => {
          if (star.id === 'sun') return null;
          const angle = (idx / FAMOUS_STARS.length) * Math.PI * 2;
          const dist = parseFloat(star.distance) * 10;
          return (
            <Float key={star.id} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <group position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}>
                 <mesh 
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                 >
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color={star.color} />
                 </mesh>
                 <Text
                  position={[0, 2, 0]}
                  fontSize={0.8}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
                >
                  {star.name}
                </Text>
              </group>
            </Float>
          );
        })}
      </Suspense>

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={isWarping ? 5 : 1.5} 
          radius={isWarping ? 0.8 : 0.4} 
        />
      </EffectComposer>
    </>
  );
}

export default function App() {
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [showConstellations, setShowConstellations] = useState(false);
  const [zoom, setZoom] = useState(100);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setSelectedStar(null);
    }
  };

  const handleWarp = async () => {
    if (isWarping || !controlsRef.current) return;
    
    setIsWarping(true);
    setIsTransitioning(true);

    // Random destination warp
    const targetX = (Math.random() - 0.5) * 500;
    const targetY = (Math.random() - 0.5) * 100;
    const targetZ = (Math.random() - 0.5) * 500;

    await controlsRef.current.setLookAt(
      targetX + 50, targetY + 20, targetZ + 100,
      targetX, targetY, targetZ,
      true
    );

    setIsWarping(false);
    setIsTransitioning(false);
  };

  const handleSelectStar = async (star: StarData | null) => {
    setSelectedStar(star);
    if (star && controlsRef.current) {
      setIsTransitioning(true);
      const angle = (FAMOUS_STARS.indexOf(star) / FAMOUS_STARS.length) * Math.PI * 2;
      const dist = parseFloat(star.distance) * 10;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      await controlsRef.current.setLookAt(
        x + 10, 5, z + 10,
        x, 0, z,
        true
      );
      setIsTransitioning(false);
    } else if (controlsRef.current) {
      controlsRef.current.reset(true);
    }
  };

  return (
    <div className="w-full h-screen bg-[#010103] overflow-hidden select-none">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#010103] flex flex-col items-center justify-center gap-6"
          >
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="w-16 h-16 border-t-2 border-r-2 border-yellow-400 rounded-full"
            />
            <div className="flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-light tracking-[0.4em] uppercase text-xl"
              >
                Initializing Universe
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 240 }}
                transition={{ duration: 2 }}
                className="h-[1px] bg-white/20 mt-4"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Overlay 
        selectedStar={selectedStar} 
        onSelectStar={handleSelectStar} 
        onReset={handleReset}
        onWarp={handleWarp}
        showConstellations={showConstellations}
        onToggleConstellations={() => setShowConstellations(!showConstellations)}
        zoom={zoom}
        isTransitioning={isTransitioning}
      />

      <Canvas
        camera={{ position: [50, 20, 100], fov: 45 }}
        gl={{ alpha: false, antialias: true, stencil: false, depth: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[50, 20, 100]} />
        <Scene 
          selectedStar={selectedStar} 
          showConstellations={showConstellations}
          isWarping={isWarping}
        />
        
        <CameraControls
          ref={controlsRef}
          minDistance={5}
          maxDistance={1000}
          smoothTime={0.8}
          draggingSmoothTime={0.2}
        />
      </Canvas>

      {/* Background Starry noise */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}

