"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const emotionalMoments = [
  {
    title: "Cuando llegaste",
    text: "No sabia que una presencia podia cambiar la forma de mirar el mundo.",
  },
  {
    title: "Cuando me escuchaste",
    text: "Senti que mis silencios ya no estaban solos, que por fin tenian hogar.",
  },
  {
    title: "Cuando me elegiste",
    text: "Entendi que el amor verdadero no grita: abraza y permanece.",
  },
  {
    title: "Hoy, tu cumpleanos",
    text: "No celebro una fecha. Celebro que existas y que tu vida toque la mia.",
  },
];

export function Timeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const fgLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(bgLayerRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(midLayerRef.current, {
        yPercent: -24,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(fgLayerRef.current, {
        yPercent: -34,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".timeline-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.28,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="snap-start relative min-h-screen overflow-hidden bg-[#10131d] px-6 py-24 text-zinc-100"
    >
      <div
        ref={bgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,155,255,0.15),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_74%,rgba(251,191,36,0.1),transparent_45%)]" />
      </div>

      <div
        ref={midLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute left-[20%] top-14 h-32 w-px bg-gradient-to-b from-transparent via-zinc-200/20 to-transparent" />
        <div className="absolute right-[18%] top-48 h-40 w-px bg-gradient-to-b from-transparent via-zinc-200/20 to-transparent" />
        <div className="absolute left-[35%] bottom-20 h-24 w-px bg-gradient-to-b from-transparent via-amber-200/25 to-transparent" />
      </div>

      <div
        ref={fgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div className="absolute -left-20 bottom-8 h-56 w-56 rounded-full bg-zinc-200/5 blur-3xl" />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-amber-200/7 blur-3xl" />
      </div>

      <div ref={containerRef} className="mx-auto grid h-full w-full max-w-5xl content-center gap-12">
        <h2 className="font-serif text-center text-4xl md:text-5xl">Nuestra linea del alma</h2>

        <div className="relative mx-auto w-full max-w-3xl pl-8 md:pl-14">
          <div className="absolute left-2 top-1 h-[calc(100%-0.5rem)] w-px bg-zinc-500/40 md:left-5" />

          <div className="space-y-10">
            {emotionalMoments.map((item) => (
              <article key={item.title} className="timeline-item relative">
                <span className="absolute -left-[1.95rem] top-2 h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.7)] md:-left-[2.65rem]" />
                <h3 className="font-serif text-2xl text-zinc-50 md:text-3xl">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-300 md:text-lg">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-[#070b16] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#26150b] to-transparent" />
    </section>
  );
}
