"use client";
import React from 'react';

export default function Navbar() {
  const navItems = [
    { name: "/HİZMETLER", link: "#" },
    { name: "/PROJELER", link: "#" },
    { name: "/REFERANSLAR", link: "#" },
    { name: "/İLETİŞİM", link: "#" },
    { name: "/BAŞVURU", link: "#" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Alanı */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-[#00ffcc] rounded flex items-center justify-center rotate-45 group-hover:rotate-180 transition-transform duration-500">
            <span className="text-black font-black -rotate-45 group-hover:rotate-[180deg] transition-transform duration-500">Q</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter ml-2">
            QodliX
          </span>
        </div>

        {/* Menü Linkleri */}
        <div className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-md px-8 py-3 rounded-full border border-white/5 shadow-2xl">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.link}
              className="text-xs font-mono text-gray-400 hover:text-[#00ffcc] transition-colors tracking-widest uppercase"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Sağ Taraf - Durum Göstergesi */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="h-[1px] w-12 bg-gray-800"></div>
          <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">
            System Online
          </span>
        </div>
      </div>
    </nav>
  );
}