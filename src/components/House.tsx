"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function House() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const fgLayerRef = useRef<HTMLDivElement | null>(null);
  const houseRef = useRef<HTMLDivElement | null>(null);
  const windowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const windowGlowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const smokeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const warmthRef = useRef<HTMLDivElement | null>(null);

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
          scrub: 1.3,
        },
      });

      gsap.to(midLayerRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(fgLayerRef.current, {
        yPercent: -32,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        houseRef.current,
        { opacity: 0.5, y: 18, filter: "drop-shadow(0 0 0 rgba(255,190,120,0.1))" },
        {
          opacity: 1,
          y: 0,
          filter: "drop-shadow(0 0 38px rgba(255,190,120,0.24))",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 35%",
            scrub: 1.4,
          },
        },
      );

      gsap.to(houseRef.current, {
        scale: 1.02,
        duration: 4.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        transformOrigin: "50% 100%",
      });

      gsap.fromTo(
        windowRefs.current,
        { opacity: 0.25, boxShadow: "0 0 0 rgba(255, 191, 88, 0)" },
        {
          opacity: 0.95,
          boxShadow: "0 0 26px rgba(255, 191, 88, 0.74)",
          stagger: 0.24,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
            end: "bottom 40%",
            scrub: 1.2,
          },
        },
      );

      gsap.fromTo(
        warmthRef.current,
        { opacity: 0.16, scale: 0.9 },
        {
          opacity: 0.58,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "bottom 34%",
            scrub: 1.2,
          },
        },
      );

      gsap.to([windowRefs.current, windowGlowRefs.current], {
        opacity: 0.82,
        boxShadow: "0 0 32px rgba(255, 206, 122, 0.88)",
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.7,
      });

      smokeRefs.current.forEach((smoke, index) => {
        gsap.fromTo(
          smoke,
          { y: 0, opacity: 0, scale: 0.8, x: 0 },
          {
            y: -30 - index * 8,
            x: index % 2 === 0 ? -8 : 8,
            opacity: 0.24,
            scale: 1.25,
            duration: 3.8 + index * 0.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.7,
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="snap-start relative flex min-h-screen items-center justify-center overflow-hidden bg-[#26150b] px-6 text-amber-50"
    >
      <div
        ref={bgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,194,112,0.22),transparent_52%)]" />
        <div className="absolute -left-24 bottom-6 h-72 w-72 rounded-full bg-amber-100/10 blur-3xl" />
      </div>

      <div
        ref={midLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute left-0 right-0 bottom-0 h-44 bg-gradient-to-t from-[#180d08] to-transparent" />
        <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-[#ffb76d]/10 blur-3xl" />
      </div>

      <div
        ref={fgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute left-[10%] top-24 h-44 w-44 rounded-full bg-amber-200/10 blur-3xl" />
      </div>

      <div
        ref={houseRef}

        className="absolute bottom-14 left-[8%] z-20 h-64 w-64 md:left-[12%] md:h-72 md:w-72"
      >
        <div
          ref={warmthRef}
          className="absolute left-[20%] top-[44%] h-36 w-36 rounded-full bg-amber-200/55 blur-3xl"
        />
        <div
          ref={(el) => {
            smokeRefs.current[0] = el;
          }}
          className="absolute right-[33%] top-0 h-7 w-7 rounded-full bg-amber-100/25 blur-md"
        />
        <div
          ref={(el) => {
            smokeRefs.current[1] = el;
          }}
          className="absolute right-[30%] top-1 h-5 w-5 rounded-full bg-amber-100/20 blur-md"
        />
        <div
          ref={(el) => {
            smokeRefs.current[2] = el;
          }}
          className="absolute right-[36%] top-4 h-4 w-4 rounded-full bg-amber-100/18 blur-md"
        />

        <svg viewBox="0 0 280 260" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="roofHouse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8d4a2a" />
              <stop offset="100%" stopColor="#4f2412" />
            </linearGradient>
            <linearGradient id="wallHouse" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0c08f" />
              <stop offset="100%" stopColor="#b57445" />
            </linearGradient>
          </defs>
          <ellipse cx="140" cy="240" rx="106" ry="16" fill="rgba(0,0,0,0.35)" />
          <polygon points="140,30 250,110 30,110" fill="url(#roofHouse)" />
          <rect x="45" y="110" width="190" height="116" rx="12" fill="url(#wallHouse)" />
          <rect x="180" y="56" width="24" height="58" rx="4" fill="#6d3a21" />
          <rect x="120" y="150" width="40" height="76" rx="6" fill="#6d3a21" />
        </svg>

        <div
          ref={(el) => {
            windowRefs.current[0] = el;
          }}
          className="absolute left-[31%] top-[53%] h-9 w-9 rounded-sm border border-amber-50/35 bg-amber-200/45"
        />
        <div
          ref={(el) => {
            windowGlowRefs.current[0] = el;
          }}
          className="absolute left-[27%] top-[49%] h-16 w-16 rounded-full bg-amber-200/30 blur-xl"
        />
        <div
          ref={(el) => {
            windowRefs.current[1] = el;
          }}
          className="absolute right-[31%] top-[53%] h-9 w-9 rounded-sm border border-amber-50/35 bg-amber-200/45"
        />
        <div
          ref={(el) => {
            windowGlowRefs.current[1] = el;
          }}
          className="absolute right-[27%] top-[49%] h-16 w-16 rounded-full bg-amber-200/30 blur-xl"
        />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-sm tracking-[0.28em] text-amber-200/70">HOGAR</p>
        <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
          Contigo aprendi que un hogar no es un lugar.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-amber-100/85 md:text-xl">
          Es esa sensacion de poder ser yo, sin miedo. Tu me diste refugio cuando
          no sabia donde descansar el corazon.
        </p>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-[#10131d] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#4b2308] to-transparent" />
    </section>
  );
}
