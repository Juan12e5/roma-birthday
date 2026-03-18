"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

const introLines = [
  "Hoy es un dia especial...",
  "Porque naciste tu",
  "Y eso cambio mi mundo",
];

export function Intro() {
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => ({
        id: index,
        x: ((index * 37) % 100) + (index % 5),
        y: ((index * 23) % 72) + 2,
        size: 1 + (index % 3),
        delay: (index % 9) * 0.2,
      })),
    [],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRefs.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          stagger: 1.1,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        hintRef.current,
        { opacity: 0 },
        {
          opacity: 0.7,
          delay: 3.8,
          duration: 1.5,
          ease: "sine.out",
        },
      );

      starRefs.current.forEach((star, index) => {
        if (!star) return;
        gsap.fromTo(
          star,
          { opacity: 0.18, scale: 0.7 },
          {
            opacity: 0.95,
            scale: 1.2,
            duration: 2.5 + (index % 4) * 0.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: (index % 9) * 0.22,
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="snap-start relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03050b] px-6 text-center">
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star, index) => (
          <span
            key={star.id}
            ref={(element) => {
              starRefs.current[index] = element;
            }}
            className="absolute rounded-full bg-amber-100/80"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.3,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#17203d_0%,transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-3xl space-y-7">
        {introLines.map((line, index) => (
          <p
            key={line}
            ref={(element) => {
              lineRefs.current[index] = element;
            }}
            className="font-serif text-4xl leading-tight text-zinc-100 md:text-6xl"
          >
            {line}
          </p>
        ))}
        <p ref={hintRef} className="pt-12 text-sm tracking-[0.24em] text-zinc-400">
          DESLIZA SUAVEMENTE
        </p>
        <button
          type="button"
          className="mx-auto block text-xs tracking-[0.24em] text-zinc-500/70 transition hover:text-amber-100/80"
          onClick={() => setShowSecret((current) => !current)}
        >
          ☆
        </button>
        <p
          className={`mx-auto max-w-xl text-sm leading-relaxed text-amber-100/80 transition-all duration-700 ${
            showSecret ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          Mensaje oculto: en cada version de mi futuro, tu sigues siendo mi lugar favorito.
        </p>
      </div>
    </section>
  );
}
