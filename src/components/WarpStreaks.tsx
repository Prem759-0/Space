import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STREAK_COUNT = 400;

export function WarpStreaks({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  const streakData = useMemo(() => {
    const lines = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      const z = Math.random() * 1000 - 500;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200 + 20;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      lines.push(new THREE.Vector3(x, y, z), new THREE.Vector3(x, y, z - (Math.random() * 50 + 10)));
    }
    return new Float32Array(lines.flatMap(v => [v.x, v.y, v.z]));
  }, []);

  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.position.z += 15;
      if (meshRef.current.position.z > 500) {
        meshRef.current.position.z = -500;
      }
    }
  });

  if (!active) return null;

  return (
    <group ref={meshRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={streakData.length / 3}
            array={streakData}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}
