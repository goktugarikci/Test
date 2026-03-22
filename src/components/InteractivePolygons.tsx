"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function InteractivePolygons({ count = 30000 }) {
  const meshRef = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  // 1. Veri Hazırlama (Tüm scroll alanına yayıyoruz)
  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 100; // X Genişliği
      pos[i * 3 + 1] = (Math.random() - 0.5) * 150; // Y Yüksekliği (Tüm sayfayı kaplar)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;  // Z Derinliği
      rnd[i] = Math.random();
    }
    return { positions: pos, randoms: rnd };
  }, [count]);

  // 2. Özel Shader (Tazelenme ve Shading Efekti)
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color("#00ffcc") }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying float vAlpha;
      varying vec3 vColor;
      
      void main() {
        vec3 pos = position;
        
        // Refresh/Shading Efekti: Soldan sağa dalgalanma
        pos.x += sin(uTime * 0.2 + pos.y) * 0.2;
        pos.y += cos(uTime * 0.2 + pos.x) * 0.2;
        
        // Fare etkileşimi: Yakındaki parçacıklar parlar
        float dist = distance(pos.xy, uMouse * 40.0);
        float force = 1.0 - smoothstep(0.0, 10.0, dist);
        
        vAlpha = clamp(0.1 + force * 0.8, 0.0, 1.0);
        vColor = mix(vec3(0.1, 0.2, 0.2), vec3(0.0, 1.0, 0.8), force);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (20.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        if (r > 0.5) discard; // Kareleri yuvarlağa çevir
        gl_FragColor = vec4(vColor, vAlpha * (1.0 - r * 2.0));
      }
    `
  }), []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.lerp(mouse, 0.1);
  });

  return (
    <points ref={meshRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}