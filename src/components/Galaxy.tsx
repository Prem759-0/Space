
import { useRef, useMemo, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 50000;

interface GalaxyProps {
  showConstellations: boolean;
  onHoverStar?: (id: string | null) => void;
}

export function Galaxy({ showConstellations, onHoverStar }: GalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const color = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 2) * 500;
        const spiralFactor = radius * 0.1;
        
        const x = Math.cos(angle + spiralFactor) * radius + (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 10 * (1 - radius / 500); 
        const z = Math.sin(angle + spiralFactor) * radius + (Math.random() - 0.5) * 20;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const mixed = Math.random();
        if (mixed > 0.8) {
            color.setHSL(0.6, 0.4, 0.8 + Math.random() * 0.2); 
        } else if (mixed > 0.4) {
            color.setHSL(0.1, 0.2, 0.9); 
        } else {
            color.setHSL(0.05, 0.5, 0.7 + Math.random() * 0.3); 
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 1.5 + 0.1;
    }

    return { positions, colors, sizes };
  }, []);

  // Generate constellation lines for a subset of bright stars
  const constellationLines = useMemo(() => {
    const lines = [];
    const step = 500; // Only connect every 500th star to form pseudo-constellations
    for (let i = 0; i < STAR_COUNT; i += step) {
      if (i + step < STAR_COUNT) {
        const start = new THREE.Vector3(particles.positions[i * 3], particles.positions[i * 3 + 1], particles.positions[i * 3 + 2]);
        const end = new THREE.Vector3(particles.positions[(i + step) * 3], particles.positions[(i + step) * 3 + 1], particles.positions[(i + step) * 3 + 2]);
        
        if (start.distanceTo(end) < 50) { // Only connect relatively close stars
          lines.push(start, end);
        }
      }
    }
    return lines;
  }, [particles]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.index !== undefined) {
      setHoveredIdx(e.index);
      if (onHoverStar) onHoverStar(e.index.toString());
    }
  };

  const handlePointerOut = () => {
    setHoveredIdx(null);
    if (onHoverStar) onHoverStar(null);
  };

  useFrame((state) => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <group>
      <points 
        ref={pointsRef} 
        onPointerOver={handlePointerOver} 
        onPointerOut={handlePointerOut}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={STAR_COUNT}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={STAR_COUNT}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Hover Highlighter */}
      {hoveredIdx !== null && (
        <group 
          position={[
            particles.positions[hoveredIdx * 3],
            particles.positions[hoveredIdx * 3 + 1],
            particles.positions[hoveredIdx * 3 + 2]
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial color="white" transparent opacity={0.6} />
          </mesh>
          <mesh scale={[1.5, 1.5, 1.5]}>
             <sphereGeometry args={[1, 16, 16]} />
             <meshBasicMaterial color="white" transparent opacity={0.2} />
          </mesh>
          <pointLight intensity={2} distance={10} color="white" />
        </group>
      )}

      {/* Constellations */}
      {showConstellations && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={constellationLines.length}
              array={new Float32Array(constellationLines.flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4488ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </lineSegments>
      )}
    </group>
  );
}
