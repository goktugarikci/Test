"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

interface Props {
  position: [number, number, number];
  color: string;
  type?: "octa" | "ico" | "tetra" | "box";
}

export default function IntegratedProjectSection({ position, color, type = "octa" }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const outerLineRef = useRef<THREE.LineSegments>(null!); 
  const innerLineRef = useRef<THREE.LineSegments>(null!);

  // 1. BENZERSİZ ŞEKİLLER (Dış Ağ, İç Çekirdek ve Dolgu)
  const geometries = useMemo(() => {
    let outer, inner, volume;
    
    switch (type) {
      case "ico": 
        // 1. Ağ Küresi (Network Sphere): Çok detaylı dış zırh, içinde elmas çekirdek
        outer = new THREE.IcosahedronGeometry(1.8, 1); // 1 parametresi detay seviyesini artırır
        inner = new THREE.OctahedronGeometry(1.2, 0);
        volume = new THREE.OctahedronGeometry(1.2, 0);
        break;
        
      case "tetra": 
        // 2. Kuantum Düğümü (Quantum Knot): Kendi içine geçen sonsuz sarmal
        outer = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 12);
        inner = new THREE.TetrahedronGeometry(1.0, 0);
        volume = new THREE.TetrahedronGeometry(1.0, 0);
        break;
        
      case "box": 
        // 3. Siber Matris (Cyber Matrix): 12 Yüzlü Dodecahedron içinde Kutu
        outer = new THREE.DodecahedronGeometry(1.6, 0);
        inner = new THREE.BoxGeometry(1.4, 1.4, 1.4);
        volume = new THREE.BoxGeometry(1.4, 1.4, 1.4);
        break;
        
      case "octa": 
      default: 
        // 4. Çift Katmanlı Prizma (Double Prism)
        outer = new THREE.OctahedronGeometry(1.8, 0);
        inner = new THREE.OctahedronGeometry(1.0, 0);
        // İçteki şekli dik tutmak için hafif çeviriyoruz
        inner.rotateX(Math.PI / 4); 
        volume = new THREE.OctahedronGeometry(1.0, 0);
        volume.rotateX(Math.PI / 4);
        break;
    }
    
    // Yüzeyleri silip sadece vektörel çizgileri alıyoruz
    return {
      outerEdges: new THREE.EdgesGeometry(outer),
      innerEdges: new THREE.EdgesGeometry(inner),
      volumeGeo: volume
    };
  }, [type]);

  // 2. PARLAKLIK (HDR MATERYALLER)
  const materials = useMemo(() => {
    const baseColor = new THREE.Color(color);
    
    return {
      // Dış zırh: Daha büyük ama biraz daha şeffaf (Kalkan hissi)
      outerLine: new THREE.LineBasicMaterial({
        color: baseColor.clone().multiplyScalar(2), 
        transparent: true,
        opacity: 0.4,
        toneMapped: false
      }),
      // İç çekirdek: Çok parlak, agresif neon (Enerji kaynağı)
      innerLine: new THREE.LineBasicMaterial({
        color: baseColor.clone().multiplyScalar(6), 
        transparent: true,
        opacity: 1.0,
        toneMapped: false
      }),
      // İç Hacim Sisi (Hologram efekti)
      volume: new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.05,
        flatShading: true,
        side: THREE.DoubleSide
      })
    };
  }, [color]);

  useFrame((state, delta) => {
    if (!groupRef.current || !outerLineRef.current || !innerLineRef.current) return;

    // A. KENDİ İÇİNDE TERS YÖNLÜ DÖNÜŞ (Çok Havalı Bir Efekt Verir)
    // Dış kafes yavaşça sağa döner
    outerLineRef.current.rotation.y += delta * 0.15;
    outerLineRef.current.rotation.x += delta * 0.05;
    
    // İç çekirdek daha hızlı ve TERS YÖNE döner
    innerLineRef.current.rotation.y -= delta * 0.4;
    innerLineRef.current.rotation.x -= delta * 0.2;

    // B. Fare ile 360 Derece Etkileşim
    const targetRotationX = state.mouse.y * Math.PI * 0.5;
    const targetRotationY = state.mouse.x * Math.PI;

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotationX, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotationY, 5, delta);
  });

  return (
    <Float position={position} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        
        {/* 1. Dış Kafes (Kalkan) */}
        <lineSegments 
          ref={outerLineRef} 
          geometry={geometries.outerEdges} 
          material={materials.outerLine} 
        />
        
        {/* 2. İç Çekirdek (Çok Parlak Enerji) */}
        <lineSegments 
          ref={innerLineRef} 
          geometry={geometries.innerEdges} 
          material={materials.innerLine} 
        />
        
        {/* 3. İç Sis (Hacim) */}
        <mesh 
          geometry={geometries.volumeGeo} 
          material={materials.volume} 
        />
        
      </group>
    </Float>
  );
}