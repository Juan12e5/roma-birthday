"use client";

import { AUDIO_PATHS } from "@/assets/paths";
import { useAmbientAudio } from "@/hooks/use-ambient-audio";
import { useCandleBlow } from "@/hooks/use-candle-blow";
import { useLenis } from "@/hooks/use-lenis";
import { FLOWER_MESSAGES, STORY_PHASES } from "@/lib/story-phases";
import { FinalBook } from "@/components/FinalLetter";
import { HouseMemoriesModal } from "@/components/HouseMemoriesModal";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

const NightTunnelScene = dynamic(
  () => import("@/scenes/NightTunnelScene").then((mod) => mod.NightTunnelScene),
  { ssr: false },
);

const seeded = (seed: number) => {
  const value = Math.sin(seed * 9999.91) * 10000;
  return value - Math.floor(value);
};

export function ImmersiveExperience() {
  useLenis();
  const [houseOpen, setHouseOpen] = useState(false);
  const [enteringHouse, setEnteringHouse] = useState(false);
  const [flowerMessage, setFlowerMessage] = useState("");
  const [flowerInteractions, setFlowerInteractions] = useState(0);
  const [beamInteractions, setBeamInteractions] = useState(0);
  const [memoryUnlocked, setMemoryUnlocked] = useState(false);
  const [whisper, setWhisper] = useState("");
  const [progress, setProgress] = useState(0);
  const [anticipation, setAnticipation] = useState(false);
  const [wishMessageVisible, setWishMessageVisible] = useState(false);
  const [canBlow, setCanBlow] = useState(false);
  const [ruptureActive, setRuptureActive] = useState(false);
  const [ruptureDone, setRuptureDone] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const progressRafRef = useRef<number | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const seaAudioRef = useRef<HTMLAudioElement | null>(null);
  const windAudioRef = useRef<HTMLAudioElement | null>(null);
  const houseTransitionTimeoutRef = useRef<number | null>(null);
  const blowPauseTimeoutRef = useRef<number | null>(null);
  const whisperTimeoutRef = useRef<number | null>(null);
  const whisperIntervalRef = useRef<number | null>(null);
  const confettiRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const confettiPlayedRef = useRef(false);
  const confettiTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const { enabled, ready, toggle, setVolume } = useAmbientAudio(AUDIO_PATHS.ambient);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const updateProgress = () => {
      progressRafRef.current = null;
      const next = progressRef.current;
      setProgress((current) => (Math.abs(current - next) > 0.0008 ? next : current));
    };

    const unsubscribe = scrollYProgress.on("change", (value) => {
      progressRef.current = value;
      if (progressRafRef.current !== null) return;
      progressRafRef.current = window.requestAnimationFrame(updateProgress);
    });

    setProgress(scrollYProgress.get());

    return () => {
      unsubscribe();
      if (progressRafRef.current !== null) {
        window.cancelAnimationFrame(progressRafRef.current);
      }
    };
  }, [scrollYProgress]);

  const coldOverlay = useTransform(scrollYProgress, [0, 0.7, 1], [0.72, 0.32, 0]);
  const warmOverlay = useTransform(scrollYProgress, [0.55, 1], [0, 0.8]);
  const tunnelBlur = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0.2, 0]);
  const finalProgress = useMemo(() => Math.max(0, (progress - 0.76) / 0.24), [progress]);
  const tunnelFilter = useMotionTemplate`blur(${tunnelBlur}px)`;
  const cinematicPause = ruptureActive || (progress > 0.84 && !canBlow) || (progress > 0.46 && progress < 0.52);
  const finaleFocusActive = progress > 0.84;
  // const whispers = useMemo(
  //   () => [
  //     "Las nubes se apiñan para oir tu risa.",
  //     "Los vientos se entorpecen para oir tu nombre.",
  //     "Las olas se aquietan para admirarte..",
  //   ],
  //   [],
  // );
  const {
    candlesOff,
    completed,
    isListening,
    micAvailable,
    triggerClickBlow,
  } = useCandleBlow({
    enabled: progress > 0.84 && canBlow,
    totalCandles: 2,
  });
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 58 }, (_, index) => ({
        id: index,
        originX: ((seeded(index + 1) - 0.5) * 18).toFixed(2),
        originY: (58 + seeded(index + 3) * 12).toFixed(2),
        hue: Math.round(16 + seeded(index + 7) * 55),
        width: Math.round(4 + seeded(index + 11) * 5),
        height: Math.round(8 + seeded(index + 13) * 9),
        radius: seeded(index + 17) > 0.62 ? "999px" : "3px",
        driftX: (seeded(index + 19) - 0.5) * 480,
        riseY: -70 - seeded(index + 23) * 130,
        fallY: 220 + seeded(index + 29) * 340,
        spin: (seeded(index + 31) - 0.5) * 1350,
        duration: 1.9 + seeded(index + 37) * 1.6,
        delay: seeded(index + 41) * 0.36,
        sway: (seeded(index + 43) - 0.5) * 120,
        scaleStart: 0.68 + seeded(index + 47) * 0.48,
        scaleEnd: 0.84 + seeded(index + 53) * 0.62,
      })),
    [],
  );

  useEffect(() => {
    if (!enabled) return;
    if (ruptureActive) {
      setVolume(0.12);
      return;
    }
    if (progress > 0.86 && !completed) {
      setAnticipation(true);
      setVolume(0.2);
      return;
    }
    setAnticipation(false);
    setVolume(completed ? 0.42 : 0.3);
  }, [completed, enabled, progress, ruptureActive, setVolume]);

  useEffect(() => {
    if (!enabled) {
      seaAudioRef.current?.pause();
      windAudioRef.current?.pause();
      return;
    }

    const sea = seaAudioRef.current;
    const wind = windAudioRef.current;
    if (!sea || !wind) return;

    if (ruptureActive) {
      sea.volume = 0.05;
      wind.volume = 0.04;
      return;
    }

    sea.volume = 0.08 + finalProgress * 0.16;
    wind.volume = 0.06 + (1 - finalProgress) * 0.05;
    sea.play().catch(() => { });
    wind.play().catch(() => { });
  }, [enabled, finalProgress, ruptureActive]);

  useEffect(() => {
    if (!completed) return;
    setWishMessageVisible(true);
    voiceRef.current?.play().catch(() => { });
    if (confettiPlayedRef.current) return;
    confettiPlayedRef.current = true;
    confettiTimelineRef.current?.kill();
    gsap.set(confettiRefs.current, {
      display: "block",
      autoAlpha: 0,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 0.9,
    });

    confettiTimelineRef.current = gsap
      .timeline({
        onComplete: () => {
          gsap.set(confettiRefs.current, { autoAlpha: 0, display: "none" });
        },
      })
      .add(() => {
        confettiPieces.forEach((piece, index) => {
          const element = confettiRefs.current[index];
          if (!element) return;
          confettiTimelineRef.current?.to(
            element,
            {
              delay: piece.delay,
              keyframes: [
                { autoAlpha: 1, duration: 0.12, ease: "power1.out" },
                {
                  x: piece.driftX * 0.45,
                  y: piece.riseY,
                  rotate: piece.spin * 0.35,
                  scale: piece.scaleStart,
                  duration: piece.duration * 0.35,
                  ease: "power2.out",
                },
                {
                  x: piece.driftX + piece.sway,
                  y: piece.fallY,
                  rotate: piece.spin,
                  scale: piece.scaleEnd,
                  autoAlpha: 0,
                  duration: piece.duration * 0.65,
                  ease: "power2.in",
                },
              ],
            },
            0,
          );
        });
      })
      .to(
        {},
        {
          duration: 0.01,
        },
      );
  }, [completed, confettiPieces]);

  const blowStageActive = progress > 0.84;

  useEffect(() => {
    if (!blowStageActive) {
      if (blowPauseTimeoutRef.current) {
        window.clearTimeout(blowPauseTimeoutRef.current);
        blowPauseTimeoutRef.current = null;
      }
      setCanBlow(false);
      return;
    }

    if (canBlow || blowPauseTimeoutRef.current) return;
    blowPauseTimeoutRef.current = window.setTimeout(() => {
      setCanBlow(true);
      blowPauseTimeoutRef.current = null;
    }, 1700);
  }, [blowStageActive, canBlow]);

  useEffect(() => {
    if (ruptureDone || progress < 0.72) return;
    setRuptureActive(true);
    setRuptureDone(true);
    const id = window.setTimeout(() => setRuptureActive(false), 760);
    return () => window.clearTimeout(id);
  }, [progress, ruptureDone]);

  const whisperEnabled = progress > 0.12 && progress < 0.82;

  // useEffect(() => {
  //   if (!whisperEnabled) {
  //     setWhisper("");
  //     return;
  //   }
  //   if (whisperIntervalRef.current) window.clearInterval(whisperIntervalRef.current);
  //   whisperIntervalRef.current = window.setInterval(() => {
  //     const message = whispers[Math.floor(Math.random() * whispers.length)];
  //     setWhisper(message);
  //     if (whisperTimeoutRef.current) window.clearTimeout(whisperTimeoutRef.current);
  //     whisperTimeoutRef.current = window.setTimeout(() => setWhisper(""), 2400);
  //   }, 5300);
  //   return () => {
  //     if (whisperIntervalRef.current) window.clearInterval(whisperIntervalRef.current);
  //     if (whisperTimeoutRef.current) window.clearTimeout(whisperTimeoutRef.current);
  //   };
  // }, [whisperEnabled, whispers]);

  useEffect(() => {
    if (memoryUnlocked) return;
    if (flowerInteractions >= 3 && beamInteractions >= 2 && houseOpen) {
      setMemoryUnlocked(true);
    }
  }, [beamInteractions, flowerInteractions, houseOpen, memoryUnlocked]);

  useEffect(() => {
    return () => {
      if (houseTransitionTimeoutRef.current) {
        window.clearTimeout(houseTransitionTimeoutRef.current);
      }
      if (blowPauseTimeoutRef.current) {
        window.clearTimeout(blowPauseTimeoutRef.current);
      }
      if (whisperTimeoutRef.current) {
        window.clearTimeout(whisperTimeoutRef.current);
      }
      if (whisperIntervalRef.current) {
        window.clearInterval(whisperIntervalRef.current);
      }
      confettiTimelineRef.current?.kill();
    };
  }, []);

  const handleHouseOpen = () => {
    if (enteringHouse || houseOpen) return;
    setEnteringHouse(true);
    houseTransitionTimeoutRef.current = window.setTimeout(() => {
      setHouseOpen(true);
      setEnteringHouse(false);
    }, 1400);
  };

  const activePhase = useMemo(
    () =>
      STORY_PHASES.find((phase) => progress >= phase.start && progress <= phase.end) ??
      STORY_PHASES[STORY_PHASES.length - 1],
    [progress],
  );

  return (
    <main ref={containerRef} className="relative h-[650vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ filter: tunnelFilter }}>
          <NightTunnelScene
            progress={progress}
            finalProgress={finalProgress}
            candlesOff={candlesOff}
            cinematicPause={cinematicPause}
            onHouseOpen={handleHouseOpen}
            onCakePress={() => {
              if (!canBlow) {
                setWhisper("Pide un deseo...");
                if (whisperTimeoutRef.current) window.clearTimeout(whisperTimeoutRef.current);
                whisperTimeoutRef.current = window.setTimeout(() => setWhisper(""), 1800);
                return;
              }
              triggerClickBlow();
            }}
            onFlowerMessage={(message) => {
              setFlowerMessage(message);
              setFlowerInteractions((current) => current + 1);
              window.setTimeout(() => setFlowerMessage(""), 2600);
            }}
            onBeamSweep={() => {
              setBeamInteractions((current) => current + 1);
            }}
            flowerMessages={FLOWER_MESSAGES}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,#0b1f3a_0%,#050505_68%)]"
          style={{ opacity: coldOverlay }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_bottom,#7a1e2c_0%,#5a0f1c_45%,transparent_78%)]"
          style={{ opacity: warmOverlay }}
        />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-12 z-30 w-full max-w-2xl -translate-x-1/2 px-6 text-center"
          initial={false}
          animate={{
            opacity: finaleFocusActive ? 0 : 1,
            y: finaleFocusActive ? -20 : 0,
          }}
          transition={{ duration: 0.55 }}
        >
          <motion.p
            key={activePhase.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.32em] text-[#f0d8df]/75"
          >
            {activePhase.title.toUpperCase()}
          </motion.p>
          <motion.p
            key={`${activePhase.id}-text`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-4 font-serif text-2xl leading-relaxed text-[#fff0f4] md:text-4xl"
          >
            {activePhase.text}
          </motion.p>
        </motion.div>

        {finaleFocusActive && (
          <motion.div
            className="pointer-events-none absolute left-3 top-[7%] z-45 w-[min(92vw,30rem)] text-left sm:left-6 sm:top-[8%] md:left-8 md:top-[9%]"
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] tracking-[0.32em] text-[#f0d8df]/75">{activePhase.title.toUpperCase()}</p>
            <p className="mt-2 font-serif text-lg leading-relaxed text-[#fff0f4] sm:mt-3 sm:text-xl md:text-2xl lg:text-3xl">
              {activePhase.text}
            </p>
          </motion.div>
        )}

        <div className="absolute right-3 top-3 z-40 flex items-center gap-2 sm:right-6 sm:top-6 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-[#f2d8df]/35 bg-[#140a12]/55 px-3 py-1.5 text-[10px] tracking-[0.14em] text-[#ffeef3] backdrop-blur hover:bg-[#140a12]/80 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.16em]"
          >
            {enabled ? "MUTE" : "SONIDO"}
          </button>
          <span className="hidden text-[11px] tracking-[0.14em] text-[#f2d8df]/65 sm:inline">
            {ready ? "AMBIENT LISTO" : "CARGANDO AUDIO"}
          </span>
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-12 left-1/2 z-40 -translate-x-1/2 rounded-full border border-[#f3dce3]/20 bg-[#120b10]/65 px-5 py-2 text-sm text-[#f9e7ec]"
          initial={false}
          animate={{
            opacity: flowerMessage && !finaleFocusActive ? 1 : 0,
            y: flowerMessage ? 0 : 10,
          }}
        >
          {flowerMessage}
        </motion.div>

        {/* <motion.p
          className="pointer-events-none absolute right-8 top-32 z-40 max-w-xs rounded-2xl border border-[#f5e6bc]/35 bg-[#1a1420]/55 px-4 py-3 text-sm text-[#f8efcf] shadow-[0_0_40px_rgba(244,206,119,0.18)]"
          initial={false}
          animate={{
            opacity: beamMessageVisible ? 1 : 0,
            x: beamMessageVisible ? 0 : 20,
          }}
          transition={{ duration: 0.35 }}
        >
          Tu luz convierte la noche en hogar.
        </motion.p> */}

        <motion.p
          className="pointer-events-none absolute left-8 top-1/3 z-40 max-w-xs font-serif text-lg text-[#f2dce4]/80"
          initial={false}
          animate={{ opacity: whisper ? 1 : 0, y: whisper ? 0 : 10 }}
          transition={{ duration: 0.6 }}
        >
          {whisper}
        </motion.p>

        {finaleFocusActive && (
          <motion.div
            className="absolute bottom-3 z-50 w-[min(92vw,30rem)] px-3 text-left sm:bottom-6 sm:left-6 sm:px-4 md:bottom-8 md:left-8"
            initial={{ opacity: 0, y: 24, x: -24 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-[#ffd4c7]/36 bg-[#140a12]/74 p-3 shadow-[0_0_40px_rgba(255,171,128,0.28)] backdrop-blur-md sm:p-4">
              <p className="text-xs text-[#ffeef3] sm:text-sm">
                {completed
                  ? "Las velas se apagaron... espero que hayas pedido tu deseo!."
                  : canBlow
                    ? "Apaga las velas de 21 soplando al microfono o con un click."
                    : "Pide un deseo... respira este momento."}
              </p>
              <p className="mt-2 text-xs tracking-[0.16em] text-[#f4dbe1]/70">
                {micAvailable && isListening ? "MICROFONO ACTIVO" : "MODO CLICK DISPONIBLE"}
              </p>
              {!completed && canBlow && (
                <button
                  type="button"
                  data-audio-ignore="true"
                  onClick={triggerClickBlow}
                  className="mt-3 rounded-full border border-[#ffd4c7]/45 bg-[#ffd4c7]/12 px-5 py-2 text-xs tracking-[0.14em] text-[#fff1f5] shadow-[0_0_24px_rgba(255,185,138,0.24)] hover:bg-[#ffd4c7]/18"
                >
                  APAGAR VELA (DOS CLICKS)
                </button>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,rgba(255,226,198,0.24),transparent_55%)]"
          animate={{ opacity: completed ? 0.72 : 0 }}
          transition={{ duration: 1.1 }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-34 bg-[radial-gradient(circle_at_50%_68%,rgba(255,199,146,0.26),rgba(255,124,170,0.08),transparent_54%)]"
          animate={{ opacity: finaleFocusActive ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        />

        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
          {confettiPieces.map((piece, index) => (
            <span
              key={piece.id}
              ref={(element) => {
                confettiRefs.current[index] = element;
              }}
              className="absolute h-3 w-2 rounded-sm opacity-0"
              style={{
                display: "none",
                left: `calc(50% + ${piece.originX}vw)`,
                top: `${piece.originY}%`,
                backgroundColor: `hsl(${piece.hue} 88% 72%)`,
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                borderRadius: piece.radius,
              }}
            />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-20 z-40 text-center"
          initial={false}
          animate={{ opacity: wishMessageVisible ? 1 : 0, y: wishMessageVisible ? 0 : 16 }}
          transition={{ duration: 1.2 }}
        >
          <p className="font-serif text-2xl text-[#fff1f4] md:text-4xl">
            Feliz cumpleaños.
            <br />
            Te quiero mucho preciosa :).
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-35 bg-black/25"
          animate={{ opacity: ruptureActive ? 0.9 : anticipation ? 0.35 : 0 }}
          transition={{ duration: 0.9 }}
        />

        {/* <motion.div
          className="pointer-events-none absolute left-1/2 top-24 z-40 w-full max-w-md -translate-x-1/2 px-6"
          initial={false}
          animate={{ opacity: memoryUnlocked ? 1 : 0, y: memoryUnlocked ? 0 : 14 }}
          transition={{ duration: 0.8 }}
        >
          <div className="rounded-2xl border border-[#f2d8df]/25 bg-[#1a0e17]/65 p-4 text-center text-sm text-[#f2d8df] backdrop-blur">
            Recuerdo desbloqueado: &quot;Eres maravillosa, mi amor.&quot;
          </div>
        </motion.div> */}

        <motion.div
          className="pointer-events-none absolute inset-0 z-70 bg-[radial-gradient(circle_at_center,rgba(255,223,192,0.34),rgba(35,14,22,0.96)_62%)]"
          initial={false}
          animate={{
            opacity: enteringHouse ? 1 : 0,
            scale: enteringHouse ? 1 : 1.16,
          }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
        >
          <div className="flex h-full items-center justify-center">
            <motion.p
              className="font-serif text-3xl text-[#fff2f6] md:text-5xl"
              initial={false}
              animate={{
                opacity: enteringHouse ? 1 : 0,
                y: enteringHouse ? 0 : 12,
              }}
              transition={{ duration: 0.8 }}
            >
              Entrando a tu hogar...
            </motion.p>
          </div>
        </motion.div>

        <FinalBook visible={finaleFocusActive} />
        <HouseMemoriesModal open={houseOpen} onClose={() => setHouseOpen(false)} />
        {/* <audio ref={voiceRef} preload="none" src={AUDIO_PATHS.voice} />
        <audio ref={seaAudioRef} preload="none" loop src={AUDIO_PATHS.sea} />
        <audio ref={windAudioRef} preload="none" loop src={AUDIO_PATHS.wind} /> */}
      </div>
    </main>
  );
}

