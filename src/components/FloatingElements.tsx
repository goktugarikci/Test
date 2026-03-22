"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function FloatingElements({ count = 30000 }) { // 30.000 Nokta!
  const pointsRef = useRef<THREE.Points>(null!);

  // 1. Rastgele Nokta Koordinatlarını (Nodları) Hazırlama
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 20; // Z
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Noktaları Brownian motion benzeri yavaşça hareket ettir
      positions[i * 3 + 0] += Math.sin(time * 0.2 + positions[i * 3 + 1]) * 0.01; // X
      positions[i * 3 + 2] += Math.cos(time * 0.2 + positions[i * 3 + 0]) * 0.009; // Z
    }

    // Geometrileri Güncelle (Çok hızlıdır)
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        color="#333" // Arka planda sönük kalsın
        size={0.15} // Voxel boyutu
        sizeAttenuation={true} // Uzaklaştıkça küçülsün
        transparent={true}
        opacity={0.5}
      />
    </points>
  );
}