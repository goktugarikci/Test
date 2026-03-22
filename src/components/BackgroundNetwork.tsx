"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

export default function BackgroundNetwork({ count = 200 }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const scroll = useScroll();

  // 1. Nokta Koordinatları ve Çizgi Buffer'larını Hazırlama (Bellek Tahsisi)
  const { particles, linePositions } = useMemo(() => {
    const particles = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      particles[i] = (Math.random() - 0.5) * 40; // Geniş bir alana yayıyoruz
    }
    // Olası maksimum çizgi sayısı için bellek ayırıyoruz
    const maxLines = (count * (count - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6); 
    
    return { particles, linePositions };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    let vertexpos = 0;

    // 2. Noktaları Yavaşça Hareket Ettir (Brownian Motion)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] += Math.sin(time * 0.2 + i) * 0.01;
      positions[i * 3 + 1] += Math.cos(time * 0.3 + i) * 0.01;
    }

    // 3. Yakınlık Kontrolü (Nodlar arası mesafe 15 birimden kısaysa çizgi çek)
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3 + 0] - positions[j * 3 + 0];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 15) {
          linePositions[vertexpos++] = positions[i * 3 + 0];
          linePositions[vertexpos++] = positions[i * 3 + 1];
          linePositions[vertexpos++] = positions[i * 3 + 2];
          linePositions[vertexpos++] = positions[j * 3 + 0];
          linePositions[vertexpos++] = positions[j * 3 + 1];
          linePositions[vertexpos++] = positions[j * 3 + 2];
        }
      }
    }

    // Geometrileri GPU'ya güncelle
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesRef.current.geometry.setDrawRange(0, vertexpos / 3); // Sadece var olan çizgileri çiz (Performans Sırrı)

    // 4. Parallax Efekti (Scroll ile zıt yönde yavaşça hareket)
    const parallaxY = scroll.offset * 15;
    pointsRef.current.position.y = parallaxY;
    linesRef.current.position.y = parallaxY;
  });

  return (
    <group position={[0, 0, -10]}> {/* Ana sahnenin arkasına yerleştir */}  
      <points ref={pointsRef}>
        <bufferGeometry>
            <bufferAttribute 
            attach="attributes-position" 
            args={[particles, 3]} // args: [Veri Dizisi, Item Boyutu (X,Y,Z = 3)]
            />
        </bufferGeometry>
        {/* Voxel hissi veren kare parçacıklar */}
        <pointsMaterial color="#444" size={0.1} transparent opacity={0.6} sizeAttenuation />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        {/* Teknolojik bir görünüm için sönük mavi/gri bağlantılar */}
        <lineBasicMaterial color="#2a4b6e" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>
    </group>
  );
}