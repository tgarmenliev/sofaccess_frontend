"use client";
import { useEffect, useState } from "react";

export default function ChristmasHero() {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: string; duration: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 5 + 8}s`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3 + 2}px`,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-screen">

      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-10px] bg-white rounded-full opacity-70 animate-snow"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            filter: "blur(0.8px)",
          }}
        />
      ))}

    </div>
  );
}