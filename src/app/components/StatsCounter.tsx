// app/components/StatsCounter.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate, motion } from "framer-motion";
import { FaBullhorn } from "react-icons/fa";

function AnimatedNumber({ toValue }: { toValue: number }) {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, toValue, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString("bg-BG");
      },
    });

    return () => controls.stop();
  }, [toValue]);

  return <p ref={nodeRef} className="text-5xl md:text-6xl font-extrabold font-sofia tracking-tight text-foreground" />;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<{ total: number } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <section ref={ref} className="relative py-8 w-full bg-transparent">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[100px] bg-red-500/10 dark:bg-red-500/20 blur-[60px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            
            className="
              flex flex-col md:flex-row items-center gap-6 px-10 py-6
              bg-white/60 dark:bg-black/40 
              backdrop-blur-lg 
              border border-gray-200/50 dark:border-white/10 
              shadow-xl dark:shadow-2xl
              rounded-3xl
            "
          >
            <div className="
              flex items-center justify-center
              w-16 h-16 md:w-20 md:h-20
              rounded-2xl
              bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/10
              border border-red-100/50 dark:border-red-500/20
            ">
               <FaBullhorn className="text-red-600 dark:text-red-400 h-7 w-7 md:h-9 md:w-9" />
            </div>
            
            <div className="text-center md:text-left">
              {stats ? (
                <AnimatedNumber toValue={stats.total} />
              ) : (
                <p className="text-5xl md:text-6xl font-extrabold font-sofia text-foreground animate-pulse">...</p>
              )}
              
              <h3 className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-bold mt-1">
                Картографирани проблема
              </h3>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}