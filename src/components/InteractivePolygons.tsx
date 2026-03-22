"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function InteractivePolygons({ count = 30000 }) {
  const meshRef = useRef<THREE.Points>(null!);
  const { mouse, gl } = useThree(); // gl objesi pixel ratio için eklendi

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return { positions: pos };
  }, [count]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      // 1. EKRAN PİKSEL YOĞUNLUĞU: Vektörel netlik için şarttır.
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) } 
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      precision highp float;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uPixelRatio; // Piksel oranı uniform'u eklendi
      varying float vAlpha;
      varying vec3 vColor;
      
      void main() {
        vec3 pos = position;
        
        pos.x += sin(uTime * 0.2 + pos.y * 0.1) * 0.2;
        pos.y += cos(uTime * 0.2 + pos.x * 0.1) * 0.2;
        
        vec2 targetMouse = vec2(uMouse.x * 50.0, uMouse.y * 75.0); 
        float dist = distance(pos.xy, targetMouse);
        
        float force = 1.0 - smoothstep(0.0, 15.0, dist); 
        
        vAlpha = clamp(0.05 + force * 0.8, 0.0, 1.0);
        vColor = mix(vec3(0.02, 0.05, 0.1), vec3(0.0, 1.0, 0.8), force);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // 2. RETİNA NETLİĞİ: Çıkan boyutu ekranın piksel yoğunluğu ile çarpıyoruz.
        float pointSize = clamp(25.0 / -mvPosition.z, 1.0, 12.0);
        gl_PointSize = pointSize * uPixelRatio;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        // Noktanın merkezinden uzaklık (0.0 ile 0.5 arası)
        float r = distance(gl_PointCoord, vec2(0.5));
        
        // 3. VEKTÖREL KENAR YUMUŞATMA (SVG Kalitesi)
        // discard yerine smoothstep kullanıyoruz. 0.45 ile 0.5 arasında yumuşak bir anti-aliasing geçişi yapar.
        // Bu sayede kenarlar tırtıklı değil, jilet gibi pürüzsüz olur.
        float alphaShape = smoothstep(0.5, 0.45, r);
        
        if (alphaShape < 0.01) discard; // Sadece tamamen görünmez olanları GPU'dan at
        
        // Şeklin dolgunluğunu vAlpha ile çarpıp ekrana basıyoruz
        gl_FragColor = vec4(vColor, vAlpha * alphaShape);
      }
    `
  }), []);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    material.uniforms.uMouse.value.x = THREE.MathUtils.damp(material.uniforms.uMouse.value.x, state.mouse.x, 5, delta);
    material.uniforms.uMouse.value.y = THREE.MathUtils.damp(material.uniforms.uMouse.value.y, state.mouse.y, 5, delta);
  });

  return (
    <points ref={meshRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}