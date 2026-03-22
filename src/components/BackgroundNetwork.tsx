"use client";
import * as THREE from "three";
import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

// Arka planda kullanılacak 4 temel şekil
const shapes = [
  new THREE.IcosahedronGeometry(0.6, 0),
  new THREE.OctahedronGeometry(0.6, 0),
  new THREE.TetrahedronGeometry(0.6, 0),
  new THREE.BoxGeometry(0.8, 0.8, 0.8)
];

export default function BackgroundNetwork({ count = 200 }) {
  const groupRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  // Her şekil tipinden eşit sayıda oluşturacağız
  const itemsPerShape = Math.floor(count / shapes.length);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 1. Poligonların Rastgele Konum, Dönüş ve Renk Verilerini Hazırlama
  const particlesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80; // Geniş X ekseni
      const y = (Math.random() - 0.5) * 80; // Geniş Y ekseni
      const z = (Math.random() - 0.5) * 50 - 15; // Derinlik (Kameradan uzak)
      
      // Ekranda bulundukları bölgeye göre renk ataması (Görseldeki gibi)
      let colorStr = "#00ffcc"; // Sol taraf Turkuaz
      if (x > 0 && y > 0) colorStr = "#ff5500"; // Sağ Üst Turuncu
      else if (x < 0 && y < 0) colorStr = "#aa00ff"; // Sol Alt Mor
      else if (x > 0 && y < 0) colorStr = "#ff0055"; // Sağ Alt Kırmızı

      data.push({
        x, y, z,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        // Kendi etrafında dönüş hızı
        speed: (Math.random() - 0.5) * 0.015, 
        // Uzaktakiler küçük, yakındakiler büyük görünsün diye rastgele ölçek
        scale: Math.random() * 0.6 + 0.4, 
        color: new THREE.Color(colorStr)
      });
    }
    return data;
  }, [count]);

  // InstancedMesh Referansları
  const meshRefs = [
    useRef<THREE.InstancedMesh>(null!),
    useRef<THREE.InstancedMesh>(null!),
    useRef<THREE.InstancedMesh>(null!),
    useRef<THREE.InstancedMesh>(null!)
  ];

  // 2. Renkleri InstancedMesh'e Yükleme (Performans Sırrı)
  useLayoutEffect(() => {
    meshRefs.forEach((meshRef, shapeIndex) => {
      if (!meshRef.current) return;
      for (let i = 0; i < itemsPerShape; i++) {
        const dataIndex = shapeIndex * itemsPerShape + i;
        meshRef.current.setColorAt(i, particlesData[dataIndex].color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    });
  }, [particlesData]);

  // 3. Her Karede (Frame) Poligonları Döndürme ve Scroll Takibi
  useFrame(() => {
    meshRefs.forEach((meshRef, shapeIndex) => {
      if (!meshRef.current) return;
      
      for (let i = 0; i < itemsPerShape; i++) {
        const dataIndex = shapeIndex * itemsPerShape + i;
        const data = particlesData[dataIndex];
        
        // Rotasyonları güncelle
        data.rx += data.speed;
        data.ry += data.speed * 0.8;
        data.rz += data.speed * 1.2;

        // Pozisyon ve rotasyonu sanal objeye aktar
        dummy.position.set(data.x, data.y, data.z);
        dummy.rotation.set(data.rx, data.ry, data.rz);
        dummy.scale.set(data.scale, data.scale, data.scale);
        dummy.updateMatrix();

        // Sanal objenin matrisini gerçek GPU kopyasına gönder
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Parallax Efekti (Kullanıcı aşağı kaydırdıkça poligonlar yavaşça yukarı çıkar)
    if (scroll && groupRef.current) {
      const parallaxY = scroll.offset * 20;
      groupRef.current.position.y = parallaxY;
    }
  });

  // Ortak Sönük Tel Çerçeve Materyali
  const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.15, // Çok parlamaması ve arka planda kalması için düşük opaklık
    depthWrite: false
  }), []);

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {shapes.map((geometry, index) => (
        <instancedMesh 
          key={index}
          ref={meshRefs[index]} 
          args={[geometry, wireframeMaterial, itemsPerShape]} 
        />
      ))}
    </group>
  );
}