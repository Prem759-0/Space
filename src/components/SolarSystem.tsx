
import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
}

function Planet({ name, distance, size, color, speed }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (groupRef.current) {
      groupRef.current.position.set(Math.cos(t) * distance, 0, Math.sin(t) * distance);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <Suspense fallback={null}>
        <Text
          position={[0, size + 1, 0]}
          fontSize={size * 0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </Suspense>
    </group>
  );
}

export function SolarSystem() {
  const planets = [
    { name: 'Mercury', distance: 10, size: 0.4, color: '#A5A5A5', speed: 0.5 },
    { name: 'Venus', distance: 15, size: 0.9, color: '#E3BB76', speed: 0.35 },
    { name: 'Earth', distance: 22, size: 1.0, color: '#2233FF', speed: 0.25 },
    { name: 'Mars', distance: 30, size: 0.5, color: '#E27B58', speed: 0.2 },
    { name: 'Jupiter', distance: 50, size: 2.5, color: '#D39C7E', speed: 0.1 },
    { name: 'Saturn', distance: 75, size: 2.1, color: '#C5AB6E', speed: 0.07 },
    { name: 'Uranus', distance: 100, size: 1.5, color: '#B5E3E3', speed: 0.05 },
    { name: 'Neptune', distance: 125, size: 1.5, color: '#6081FF', speed: 0.04 },
  ];

  return (
    <group>
      {/* Orbit Rings */}
      {planets.map((p) => (
        <mesh key={`ring-${p.name}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.distance - 0.1, p.distance + 0.1, 128]} />
          <meshBasicMaterial color="white" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
      
      {planets.map((p) => (
        <Planet key={p.name} {...p} />
      ))}
    </group>
  );
}
