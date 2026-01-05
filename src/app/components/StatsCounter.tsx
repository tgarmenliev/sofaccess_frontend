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
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString("bg-BG");
      },
    });

    return () => controls.stop();
  }, [toValue]);

  return <p ref={nodeRef} className="text-4xl md:text-5xl font-bold font-sofia text-foreground" />;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<{ total: number; resolved: number } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <section ref={ref} className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="flex justify-center w-full">
          
          {/* Total Submitted Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-5 px-8 py-6 bg-white dark:bg-muted/30 rounded-2xl border border-border shadow-lg backdrop-blur-sm"
          >
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
               <FaBullhorn className="text-red-600 dark:text-red-500 h-8 w-8 md:h-9 md:w-9" />
            </div>
            
            <div className="text-center md:text-left">
              {stats ? (
                <AnimatedNumber toValue={stats.total} />
              ) : (
                <p className="text-4xl md:text-5xl font-bold font-sofia text-foreground">...</p>
              )}
              <h3 className="text-base md:text-lg text-muted-foreground font-medium">
                Картографирани проблема
              </h3>
            </div>
          </motion.div>

          {/* <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-6 p-8 bg-muted/50 rounded-2xl border border-border"
          >
            <FaCheckDouble className="text-green-500 h-12 w-12 flex-shrink-0" />
            <div>
              {stats && <AnimatedNumber toValue={stats.resolved} />}
              <h3 className="text-muted-foreground mt-1">Разрешени сигнала</h3>
            </div>
          </motion.div> 
          */}

        </div>
      </div>
    </section>
  );
}