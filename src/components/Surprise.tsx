"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Surprise() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const giftRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 78%",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isOpen || !audioRef.current) return;

    audioRef.current
      .play()
      .catch(() => {
        // Ignore autoplay errors when browser policies block immediate playback.
      });
  }, [isOpen]);

  useEffect(() => {
    if (!ambientRef.current) return;

    ambientRef.current.volume = 0.35;
    if (musicOn) {
      ambientRef.current.play().catch(() => {
        setMusicOn(false);
      });
      return;
    }

    ambientRef.current.pause();
  }, [musicOn]);

  const handleOpenGift = () => {
    if (giftOpened) return;
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => setGiftOpened(true),
    });
    tl.to(lidRef.current, { y: -44, rotate: -8, duration: 0.9 })
      .to(ribbonRef.current, { opacity: 0.25, duration: 0.45 }, "<")
      .to(giftRef.current, { scale: 1.04, duration: 0.4 }, "<")
      .to(giftRef.current, { scale: 1, duration: 0.4 });
  };

  return (
    <section className="snap-start flex min-h-screen items-center justify-center bg-[#f5e6d3] px-6 text-center text-[#3b2416]">
      <div
        ref={panelRef}
        className="w-full max-w-3xl rounded-3xl border border-[#a4693d]/25 bg-[#fff6ea]/80 p-8 shadow-[0_20px_100px_rgba(103,58,30,0.18)] backdrop-blur-sm md:p-14"
      >
        <p className="text-xs tracking-[0.28em] text-[#8d5a37]">SORPRESA</p>
        <h2 className="mt-5 font-serif text-4xl md:text-5xl">
          Hay algo para acompanar este momento.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6a3f27] md:text-lg">
          Presiona el boton y deja que la musica abrace esta parte de nuestra
          historia.
        </p>

        <div className="mx-auto mt-7 flex max-w-sm flex-col items-center rounded-2xl border border-[#a4693d]/20 bg-[#fff0dc] p-5">
          <div ref={giftRef} className="relative h-28 w-28">
            <div className="absolute inset-x-4 bottom-0 h-20 rounded-lg bg-[#b76c3e]" />
            <div className="absolute bottom-0 left-1/2 h-20 w-3 -translate-x-1/2 bg-[#f3d39d]" />
            <div
              ref={lidRef}
              className="absolute inset-x-2 top-0 h-10 rounded-md bg-[#c27845]"
            />
            <div
              ref={ribbonRef}
              className="absolute left-1/2 top-2 h-5 w-9 -translate-x-1/2 rounded-full border-2 border-[#f3d39d]"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenGift}
            className="mt-4 rounded-full border border-[#8f4f2b]/50 px-5 py-2 text-xs font-semibold tracking-[0.16em] text-[#8f4f2b] transition hover:bg-[#f7ddba]"
          >
            {giftOpened ? "REGALO ABIERTO" : "ABRIR REGALO"}
          </button>
        </div>

        <button
          type="button"
          className="mt-8 rounded-full bg-[#8f4f2b] px-8 py-3 text-sm font-semibold tracking-[0.14em] text-amber-50 transition hover:bg-[#784122] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setIsOpen(true)}
          disabled={!giftOpened}
        >
          REVELAR
        </button>

        <div
          className={`mx-auto mt-6 max-w-md overflow-hidden transition-all duration-700 ${
            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <audio
            ref={audioRef}
            controls
            preload="none"
            className="w-full"
            src="/audio/cancion.mp3"
          >
            Tu navegador no puede reproducir audio.
          </audio>
          <p className="mt-3 text-sm text-[#825138]">
            Si aun no anadiste tu archivo, crea `public/audio/cancion.mp3`.
          </p>

          <button
            type="button"
            onClick={() => setMusicOn((current) => !current)}
            className="mt-4 rounded-full border border-[#8f4f2b]/40 px-5 py-2 text-xs font-semibold tracking-[0.14em] text-[#8f4f2b] transition hover:bg-[#f5e1c6]"
          >
            {musicOn ? "PAUSAR AMBIENTE" : "ACTIVAR AMBIENTE"}
          </button>
          <p className="mt-2 text-xs text-[#8d5a37]">
            Opcional: agrega `public/audio/ambiente.mp3` para musica suave en loop.
          </p>

          <button
            type="button"
            onClick={() => setShowHidden((current) => !current)}
            className="mt-4 text-xs tracking-[0.18em] text-[#8d5a37]/70 transition hover:text-[#8d5a37]"
          >
            ...
          </button>
          <p
            className={`mx-auto mt-2 max-w-sm text-sm text-[#7b4c31] transition-all duration-700 ${
              showHidden ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            Easter egg: gracias por ensenarme que el amor tambien puede ser paz.
          </p>
        </div>
      </div>
      <audio ref={ambientRef} loop preload="none" src="/audio/ambiente.mp3" />
    </section>
  );
}
