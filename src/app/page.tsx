"use client";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, ScrollControls, Scroll } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";

// Bileşenlerimiz
import PageLayout from "@/components/PageLayout";
import FloatingElements from "@/components/FloatingElements";
import IntegratedProjectSection from "@/components/IntegratedProjectSection";
import Navbar from "@/components/Navbar";

// 3D Çekirdekleri ekran yüksekliğine göre dizen yardımcı bileşen
function ProjectCores() {
  const { viewport } = useThree();
  return (
    <>
      <IntegratedProjectSection position={[4.5, 0, 0]} color="#00ffcc" />
      <IntegratedProjectSection position={[-4.5, -viewport.height, 0]} color="#ff5500" />
      <IntegratedProjectSection position={[4.5, -viewport.height * 2, 0]} color="#aa00ff" />
      <IntegratedProjectSection position={[-4.5, -viewport.height * 3, 0]} color="#ff0055" />
    </>
  );
}

export default function PortfolioHome() {
  return (
    

    <main className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      
      {/* Sabit UI Elemanları */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none">  
        <Navbar />  
      </div>

      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <div className="flex items-center justify-center w-12 h-12 bg-black border border-gray-800 rounded-lg text-white font-black text-2xl uppercase shadow-lg">N</div>
      </div>

      {/* 3D Sahne Katmanı (AAA Kalite AAA Ayarlar) */}
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
        <Canvas 
          style={{ width: '100vw', height: '100vh' }} 
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={[1, 2]} // AAA Kalite AAA Çözünürlük
          gl={{ 
            powerPreference: "high-performance", 
            antialias: true, 
            toneMapping: THREE.ACESFilmicToneMapping // AAA Kalite AAA Renk Skalası
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          <color attach="background" args={["#050505"]} /> 
          <Environment preset="night" />

          {/* Scroll Kontrolcüsü (4 sayfalık alan yaratır) */}
          <ScrollControls pages={4} damping={0.15}>
            
            {/* Arka Plan Ağı (30.000 Nokta!) ve Çekirdekler */}
            <Scroll>
              <FloatingElements count={30000} />
              <ProjectCores />
            </Scroll>

            {/* HTML Yazı Katmanı */}
            <Scroll html style={{ width: '100vw' }}>
              <PageLayout />
            </Scroll>

          </ScrollControls>
          
          {/* Canlılık Katan Parlama Efekti (AAA Kalite AAA Post-Processing) */}
          <EffectComposer>
            <ToneMapping mode={THREE.ACESFilmicToneMapping} />
            <Bloom 
              luminanceThreshold={0.5} // Daha düşük eşik
              mipmapBlur 
              intensity={2.5} // Şiddet artırıldı
            />
          </EffectComposer>
        </Canvas>
      </div>

    </main>
  );
}