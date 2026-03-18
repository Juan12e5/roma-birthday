"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Pointer = { x: number; y: number };

export function Lighthouse() {
  const [pointer, setPointer] = useState<Pointer>({ x: 50, y: 45 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const fgLayerRef = useRef<HTMLDivElement | null>(null);
  const lighthouseWrapRef = useRef<HTMLDivElement | null>(null);
  const beamOrbitRef = useRef<HTMLDivElement | null>(null);
  const beamCoreRef = useRef<HTMLDivElement | null>(null);
  const beamAuraRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const lanternGlowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(bgLayerRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(midLayerRef.current, {
        yPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(fgLayerRef.current, {
        yPercent: -36,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "power2.out",
          delay: 0.25,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        },
      );

      gsap.fromTo(
        lighthouseWrapRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        },
      );

      gsap.to(beamOrbitRef.current, {
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: "none",
        transformOrigin: "9% 50%",
      });

      gsap.to(beamCoreRef.current, {
        opacity: 0.72,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(beamAuraRef.current, {
        opacity: 0.42,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glowRef.current, {
        opacity: 0.58,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(lanternGlowRef.current, {
        scale: 1.12,
        opacity: 0.8,
        duration: 2.7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="snap-start relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b16] px-6"
      onPointerMove={(event) => {
        const target = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - target.left) / target.width) * 100;
        const y = ((event.clientY - target.top) / target.height) * 100;
        setPointer({ x, y });
      }}
      style={{
        backgroundImage: `
          radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(245, 189, 67, 0.34) 0%, rgba(245, 189, 67, 0.08) 22%, rgba(7, 11, 22, 0.85) 56%),
          linear-gradient(160deg, #070b16 0%, #0f1730 100%)
        `,
      }}
    >
      <div
        ref={bgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,219,148,0.16),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(102,146,255,0.12),transparent_48%)]" />
      </div>

      <div
        ref={midLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute -left-10 top-24 h-60 w-60 rounded-full bg-amber-200/8 blur-3xl" />
        <div className="absolute right-10 bottom-24 h-72 w-72 rounded-full bg-[#87a8ff]/10 blur-3xl" />
      </div>

      <div
        ref={fgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,220,153,0.16),transparent_58%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#070b16] to-transparent" />
      </div>

      <div
        ref={lighthouseWrapRef}
        className="pointer-events-none absolute bottom-16 right-[6%] z-20 h-72 w-48 md:right-[11%] md:h-80 md:w-52"
      >
        <div
          ref={glowRef}
          className="absolute -left-10 top-2 h-40 w-72 rounded-full bg-amber-200/25 blur-3xl"
        />
        <div
          ref={lanternGlowRef}
          className="absolute left-[39%] top-[14.5%] h-11 w-11 rounded-full bg-amber-200/60 blur-lg"
          style={{
            left: `calc(42% + ${(pointer.x - 50) * 0.04}px)`,
            top: `calc(18% + ${(pointer.y - 50) * 0.06}px)`,
          }}
        />
        <div
          ref={beamOrbitRef}
          className="absolute left-[42%] top-[18%] h-8 w-[21rem] origin-left will-change-transform"
          style={{
            left: `calc(42% + ${(pointer.x - 50) * 0.04}px)`,
            top: `calc(18% + ${(pointer.y - 50) * 0.06}px)`,
          }}
        >
          <div
            ref={beamAuraRef}
            className="absolute left-0 top-[-120%] h-[280%] w-full rounded-r-full bg-[linear-gradient(90deg,rgba(255,225,145,0.36)_0%,rgba(255,216,120,0.14)_42%,rgba(255,216,120,0)_100%)] blur-xl mix-blend-screen"
          />
          <div
            ref={beamCoreRef}
            className="absolute left-0 top-[14%] h-[72%] w-full rounded-r-full bg-[linear-gradient(90deg,rgba(255,242,190,0.82)_0%,rgba(255,222,137,0.34)_40%,rgba(255,222,137,0)_100%)] blur-[1.4px] mix-blend-screen"
          />
        </div>
        <svg
          viewBox="0 0 180 320"
          className="h-full w-full drop-shadow-[0_0_30px_rgba(252,211,77,0.18)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="towerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f9e7c1" />
              <stop offset="100%" stopColor="#c69764" />
            </linearGradient>
            <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9c5f33" />
              <stop offset="100%" stopColor="#5f3016" />
            </linearGradient>
          </defs>
          <ellipse cx="90" cy="292" rx="62" ry="16" fill="rgba(0,0,0,0.35)" />
          <rect x="54" y="65" width="72" height="225" rx="8" fill="url(#towerGradient)" />
          <rect x="46" y="42" width="88" height="35" rx="8" fill="#e8d6b2" />
          <rect x="50" y="44" width="80" height="15" rx="4" fill="#f5e9cd" />
          <polygon points="90,8 138,42 42,42" fill="url(#roofGradient)" />
          <rect x="80" y="15" width="20" height="20" rx="4" fill="#f6dd9a" opacity="0.85" />
          <rect x="83" y="96" width="14" height="34" rx="2" fill="#7f5d42" />
          <rect x="83" y="152" width="14" height="34" rx="2" fill="#7f5d42" />
          <rect x="83" y="208" width="14" height="34" rx="2" fill="#7f5d42" />
        </svg>
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-sm tracking-[0.32em] text-amber-100/75">TU LUZ</p>
        <h2 className="font-serif text-4xl leading-tight text-amber-50 md:text-6xl">
          Fuiste faro cuando todo era sombra.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-amber-100/85 md:text-xl">
          Cada paso conmigo tuvo direccion desde el instante en que apareciste.
          Donde antes habia ruido, contigo encontre calma.
        </p>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-[#03050b] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#10131d] to-transparent" />
    </section>
  );
}
