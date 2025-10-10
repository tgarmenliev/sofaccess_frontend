// app/components/StatsCounter.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate, motion } from "framer-motion";
import { FaBullhorn, FaCheckDouble } from "react-icons/fa";

// A reusable component for the animated number
function AnimatedNumber({ toValue }: { toValue: number }) {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, toValue, {
      duration: 2,
      onUpdate(value) {
        // Use toLocaleString for nice formatting of large numbers
        node.textContent = Math.round(value).toLocaleString("bg-BG");
      },
    });

    return () => controls.stop();
  }, [toValue]);

  return <p ref={nodeRef} className="text-4xl md:text-5xl font-bold font-sofia" />;
}


export default function StatsCounter() {
  const [stats, setStats] = useState<{ total: number; resolved: number } | null>(null);
  const ref = useRef(null);
  // This hook returns true when the component is in the viewport
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
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Total Submitted Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-6 p-8 bg-muted/50 rounded-2xl border border-border"
          >
            <FaBullhorn className="text-red-500 h-12 w-12 flex-shrink-0" />
            <div>
              {stats && <AnimatedNumber toValue={stats.total} />}
              <h3 className="text-muted-foreground mt-1">Подадени сигнали</h3>
            </div>
          </motion.div>

          {/* Total Resolved Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-6 p-8 bg-muted/50 rounded-2xl border border-border"
          >
            <FaCheckDouble className="text-green-500 h-12 w-12 flex-shrink-0" />
            <div>
              {stats && <AnimatedNumber toValue={stats.resolved} />}
              <h3 className="text-muted-foreground mt-1">Разрешени сигнали</h3>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}