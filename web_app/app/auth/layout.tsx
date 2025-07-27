'use client'

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#f8faf8]">
      {/* Modern green abstract background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-[#f0f7eb] to-green-50/60"></div>
        
        {/* Geometric green shapes (inspired by reference) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-[10%] left-[15%] w-40 h-40 rounded-full bg-green-300/30 blur-[80px]"></div>
          <div className="absolute top-[60%] right-[10%] w-48 h-48 rotate-45 bg-green-400/20 blur-[80px]"></div>
          <div className="absolute bottom-[15%] left-[20%] w-56 h-56 rounded-lg bg-green-500/15 blur-[100px]"></div>
        </div>
        
        {/* Subtle grid texture (like reference but greener) */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, rgba(100, 221, 123, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 221, 123, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 hover:bg-green-100/50 text-green-700 border border-green-200/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-[500px] space-y-6 z-10">
        {children}
      </div>
      
      {/* <footer className="mt-12 text-center text-sm text-green-600/80 z-10">
        <p>© {new Date().getFullYear()} Farm Watch Uganda. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default AuthLayout;