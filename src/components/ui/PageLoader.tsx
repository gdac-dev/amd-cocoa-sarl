"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load smoothly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <Image src="/logo.png" alt="AMD Logo" width={80} height={80} className="object-contain" />
            <h1 className="text-3xl font-bold text-accent font-['var(--font-dancing-script)']">AMD Cocoa</h1>
          </motion.div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
        transition={{ duration: 0.8, delay: loading ? 0.3 : 0 }}
        className="flex-1 w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
