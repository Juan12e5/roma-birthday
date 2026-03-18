"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const memories = [
  {
    title: "La primera sonrisa",
    text: "Ese instante donde todo comenzo a sentirse posible.",
    gradient: "from-[#8e5d2f] to-[#d9a35e]",
  },
  {
    title: "Una noche tranquila",
    text: "Tu voz bajita volviendo el mundo un lugar seguro.",
    gradient: "from-[#755547] to-[#c89f8a]",
  },
  {
    title: "Tu mano en la mia",
    text: "Simple, real, suficiente para apagar cualquier miedo.",
    gradient: "from-[#4f3a2e] to-[#b07959]",
  },
  {
    title: "Nuestro presente",
    text: "Aqui y ahora, agradeciendo cada minuto contigo.",
    gradient: "from-[#6a4638] to-[#dfa97a]",
  },
];

export function Memories() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".memory-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
          },
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="snap-start min-h-screen bg-[#1f1612] px-6 py-20 text-amber-50">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
        <h2 className="text-center font-serif text-4xl md:text-5xl">Nuestros recuerdos</h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-amber-100/75">
          Pasa el cursor sobre cada recuerdo y deja que vuelva a respirar.
        </p>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {memories.map((memory) => (
            <article
              key={memory.title}
              className={`memory-card group relative min-h-64 overflow-hidden rounded-2xl border border-amber-50/10 bg-gradient-to-br ${memory.gradient} p-7`}
            >
              <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/45" />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <h3 className="font-serif text-3xl">{memory.title}</h3>
                <p className="mt-4 max-w-md translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {memory.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
