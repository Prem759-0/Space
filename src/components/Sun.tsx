
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float dotProduct = dot(vNormal, vec3(0.0, 0.0, 1.0));
    float intensity = pow(max(0.7 - dotProduct, 0.0), 3.5);
    vec3 glow = vec3(1.0, 0.4, 0.1) * intensity * 2.0;
    
    // Core color oscillation with noise-like patterns
    float noise = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 - uTime) * 0.05;
    float pulse = sin(uTime * 1.5) * 0.1 + 0.9 + noise;
    vec3 core = vec3(1.0, 0.8, 0.3) * pulse;
    
    gl_FragColor = vec4(core + glow, 1.0);
  }
`;

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      
      {/* Glow / Corona */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide} 
        />
      </mesh>

      <pointLight intensity={5} distance={100} color="#ffcc33" />
    </group>
  );
}
