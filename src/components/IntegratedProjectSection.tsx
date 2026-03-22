"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

interface IntegratedProjectSectionProps {
  position: [number, number, number];
  color: string;
}

export default function IntegratedProjectSection({ position, color }: IntegratedProjectSectionProps) {
  const coreRef = useRef<THREE.Mesh>(null!);

  // AAA Kalite AAA Işıklandırma (Emissive & Wireframe)
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color, 
    emissive: color, 
    emissiveIntensity: 3, 
    roughness: 0.1, // Metalik ve pürüzsüz
    metalness: 1.0,
    wireframe: true, // image_6.png'daki gibi Tel Çerçeve
    flatShading: true,
  }), [color]);

  useFrame(() => {
    if (!coreRef.current) return;

    // 1. Otomatik Dönüş Animasyonu
    coreRef.current.rotation.y += 0.005;
    coreRef.current.rotation.x += 0.002;
    // 2. Etkileşim: Fare takibi (lerp) kaldırıldı, sadece kendi etrafında dönüyor
  });

  return (
    <Float 
      position={position} 
      speed={1.5} 
      rotationIntensity={1} 
      floatIntensity={0.8}
    >
      <mesh 
        ref={coreRef}
        material={material}
        scale={1.2}
      >
        {/* image_6.png'daki gibi Dört Yüzlü Piramit (Octahedron) */}
        <octahedronGeometry args={[1.5, 0]} /> 
      </mesh>
    </Float>
  );
}