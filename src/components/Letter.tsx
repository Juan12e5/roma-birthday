"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const fullLetter =
  "Si algun dia dudas de lo que significas para mi, vuelve a este momento. " +
  "Aqui esta mi verdad: te elijo, te cuido y te celebro. " +
  "Gracias por existir. Feliz vida, mi amor.";

export function Letter() {
  const [typedText, setTypedText] = useState("");
  const hasStarted = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const letterChars = useMemo(() => fullLetter.split(""), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (hasStarted.current) return;
          hasStarted.current = true;

          let current = 0;
          const interval = window.setInterval(() => {
            current += 1;
            setTypedText(letterChars.slice(0, current).join(""));
            if (current >= letterChars.length) window.clearInterval(interval);
          }, 34);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [letterChars]);

  return (
    <section
      ref={sectionRef}
      className="snap-start relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf3] px-6 text-center text-[#4a3122]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,217,173,0.33),transparent_52%)]" />

      <article className="relative z-10 mx-auto max-w-4xl">
        <p className="text-xs tracking-[0.36em] text-[#9f6c4b]">CARTA FINAL</p>
        <h2 className="mt-5 font-serif text-4xl md:text-6xl">Para ti, siempre</h2>
        <p className="mx-auto mt-8 min-h-36 max-w-3xl text-lg leading-relaxed md:text-2xl">
          {typedText}
          <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-[#8d5938] align-middle" />
        </p>
      </article>
    </section>
  );
}
