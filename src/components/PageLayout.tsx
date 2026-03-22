import React from 'react';

export default function PageLayout() {
  return (
    <>
      {/* Konu 1: Essential (Sola dayalı ama merkeze daha yakın) */}
      <div className="h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-6xl px-8 md:px-12 flex justify-start">
          <div className="flex flex-col gap-3">
            <h1 className="text-6xl text-white font-black uppercase tracking-tighter leading-none">
              Essential
            </h1>
            <p className="text-[#00ffcc] font-mono text-xl tracking-tight leading-snug">
              Modern Desktop App <span className='opacity-50'>(Tauri / Rust)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Konu 2: Game Dev (Sağa dayalı ama merkeze daha yakın) */}
      <div className="h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-6xl px-8 md:px-12 flex justify-end text-right">
          <div className="flex flex-col gap-3 items-end">
            <h1 className="text-6xl text-white font-black uppercase tracking-tighter leading-none">
              Hearth & Steel
            </h1>
            <p className="text-[#ff5500] font-mono text-xl tracking-tight leading-snug">
              Hybrid-RPG / Server Infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* Konu 3: Oracle Cloud (Sola dayalı ama merkeze daha yakın) */}
      <div className="h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-6xl px-8 md:px-12 flex justify-start">
          <div className="flex flex-col gap-3">
            <h1 className="text-6xl text-white font-black uppercase tracking-tighter leading-none">
              Oracle Cloud
            </h1>
            <p className="text-[#aa00ff] font-mono text-xl tracking-tight leading-snug">
              VDS Routing / Docker Architecture
            </p>
          </div>
        </div>
      </div>

      {/* Konu 4: Micro-SaaS (Sağa dayalı ama merkeze daha yakın) */}
      <div className="h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-6xl px-8 md:px-12 flex justify-end text-right">
          <div className="flex flex-col gap-3 items-end">
            <h1 className="text-6xl text-white font-black uppercase tracking-tighter leading-none">
              Micro-SaaS
            </h1>
            <p className="text-[#ff0055] font-mono text-xl tracking-tight leading-snug">
              High Performance C++ Backend
            </p>
          </div>
        </div>
      </div>
    </>
  );
}