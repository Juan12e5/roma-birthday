"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Birthday() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const happyMomentRef = useRef<HTMLParagraphElement | null>(null);
  const confettiRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const flameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasConfettiPlayed = useRef(false);
  const [litCandles, setLitCandles] = useState([true, true, true]);

  const counters = useMemo(
    () => [
      { label: "dias celebrando que existes", value: 365 },
      { label: "instantes que guardo contigo", value: 1087 },
      { label: "motivos para elegirte hoy", value: 100 },
    ],
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: ((index * 17) % 100) + "%",
        hue: 32 + (index % 4) * 8,
        delay: index * 0.03,
      })),
    [],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [titleRef.current, textRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        },
      );

      gsap.to(titleRef.current, {
        textShadow: "0 0 35px rgba(255, 237, 169, 0.6)",
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        happyMomentRef.current,
        { opacity: 0, y: 18, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
            once: true,
            onEnter: () => {
              if (hasConfettiPlayed.current) return;
              hasConfettiPlayed.current = true;
              gsap.fromTo(
                confettiRefs.current,
                { y: -180, opacity: 0, rotate: 0 },
                {
                  y: 190,
                  opacity: 0.9,
                  rotate: 180,
                  duration: 2.6,
                  stagger: 0.03,
                  ease: "power1.out",
                  onComplete: () => {
                    gsap.to(confettiRefs.current, { opacity: 0, duration: 1.2 });
                  },
                },
              );
            },
          },
        },
      );

      counters.forEach((counter, index) => {
        const target = counterRefs.current[index];
        if (!target) return;
        const valueHolder = { value: 0 };
        gsap.to(valueHolder, {
          value: counter.value,
          duration: 2.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
          onUpdate: () => {
            target.textContent = `${Math.round(valueHolder.value)}`;
          },
        });
      });
    });

    return () => ctx.revert();
  }, [counters]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      flameRefs.current.forEach((flame, index) => {
        if (!flame) return;
        const isLit = litCandles[index];
        gsap.to(flame, {
          autoAlpha: isLit ? 1 : 0,
          scale: isLit ? 1 : 0.45,
          duration: 0.45,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [litCandles]);

  return (
    <section
      ref={sectionRef}
      className="snap-start relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center text-amber-50"
    >
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#4b2308_0%,#b35f18_48%,#f0a54a_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,244,190,0.22),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#26150b] to-transparent" />

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {confetti.map((piece, index) => (
          <span
            key={piece.id}
            ref={(element) => {
              confettiRefs.current[index] = element;
            }}
            className="absolute h-3 w-2 rounded-sm opacity-0"
            style={{
              left: piece.left,
              top: "16%",
              backgroundColor: `hsl(${piece.hue} 92% 72%)`,
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="text-sm tracking-[0.32em] text-amber-100/80">HOY ES TU DIA</p>
        <h2
          ref={titleRef}
          className="mt-6 font-serif text-5xl leading-tight md:text-8xl"
        >
          Feliz cumpleanos, mi amor.
        </h2>
        <p
          ref={textRef}
          className="mx-auto mt-10 max-w-3xl text-lg leading-relaxed text-amber-100/90 md:text-2xl"
        >
          Hoy el mundo celebra tu nacimiento. Yo celebro algo mas profundo:
          el dia en que mi vida encontro hogar en ti.
        </p>

        <p
          ref={happyMomentRef}
          className="mx-auto mt-8 max-w-3xl font-serif text-3xl text-amber-100/95 md:text-5xl"
        >
          Happy Birthday, mi lugar favorito en este mundo.
        </p>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {counters.map((counter, index) => (
            <article
              key={counter.label}
              className="rounded-2xl border border-amber-50/20 bg-amber-50/10 px-4 py-5 backdrop-blur-sm"
            >
              <span
                ref={(element) => {
                  counterRefs.current[index] = element;
                }}
                className="font-serif text-3xl md:text-4xl"
              >
                0
              </span>
              <p className="mt-2 text-sm tracking-[0.08em] text-amber-100/85">{counter.label}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 w-full max-w-sm rounded-2xl border border-amber-50/25 bg-amber-900/20 p-5">
          <p className="text-xs tracking-[0.25em] text-amber-100/80">VELAS</p>
          <p className="mt-2 text-sm text-amber-100/85">
            Haz click en cada llama para pedir un deseo.
          </p>
          <div className="mt-4 flex items-end justify-center gap-6">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                aria-label={`Vela ${index + 1}`}
                onClick={() =>
                  setLitCandles((current) =>
                    current.map((value, idx) => (idx === index ? false : value)),
                  )
                }
                className="group relative h-16 w-6 rounded-sm bg-amber-100/70"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-amber-50/80" />
                <div
                  ref={(element) => {
                    flameRefs.current[index] = element;
                  }}
                  className="absolute -top-5 left-1/2 h-5 w-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_40%_35%,#fff8d8_0%,#ffd787_35%,#ff9f45_78%)] shadow-[0_0_22px_rgba(255,188,100,0.85)]"
                />
              </button>
            ))}
          </div>
          {!litCandles.some(Boolean) && (
            <p className="mt-4 text-sm text-amber-100/95">
              Deseo concedido: seguir construyendo una vida bonita contigo.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
