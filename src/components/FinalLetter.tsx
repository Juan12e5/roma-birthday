"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type FinalBookProps = {
  visible: boolean;
};

type BookPage = {
  title: string;
  text: string;
};

export function FinalBook({ visible }: FinalBookProps) {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);

  const pages = useMemo<BookPage[]>(
    () => [
      {
        title: "Página I",
        text: "Lo mejor viene adelante, no hay tiempo para perder. Sigue avanzando para ver lo que hay más allá.",
      },
      {
        title: "Página II",
        text: "¿Todo listo para el siguiente capítulo? " +
          "¿Lista para continuar? "
      },
      {
        title: "Página III",
        text: "I’m not perfect, yet I’ve found my reason. " +
          "That reason is you. " +
          "I just wanna be yours. " + "\n " + "\n "
          + "Feliz cumpleaños, mi amor."
      },
    ],
    [],
  );
  return (
    <motion.section
      className="pointer-events-none absolute inset-0 z-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="pointer-events-auto absolute right-3 top-[45%] w-[min(88vw,22rem)] sm:top-[30%] md:top-[18%] lg:top-[10%] sm:right-4 md:right-8"
        initial={false}
        animate={{
          opacity: visible && !opened ? 1 : 0,
          x: visible && !opened ? 0 : 24,
          y: visible && !opened ? 0 : 12,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex h-24 sm:h-32 items-center justify-center translate-y-4 sm:translate-y-6">
          {/* Botón */}
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#ffd5c6]/70 bg-[#ffd5c6]/30 text-sm sm:text-base text-[#fff1f4] shadow-[0_0_25px_rgba(255,191,156,0.45)] hover:bg-[#ffd5c6]/45 transition"
            aria-label="Abrir"
          >
            +
          </button>

          {/* Mensaje */}
          <p className="absolute bottom-1 text-[10px] sm:text-xs tracking-[0.12em] text-[#f4dbe1]/70">
            toca aquí…
          </p>
        </div>
      </motion.div>

      <motion.div
        className={`absolute inset-0 z-100 flex items-center justify-center px-3 sm:px-6 ${opened ? "pointer-events-auto" : "pointer-events-none"}`}
        initial={false}
        animate={{ opacity: visible && opened ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/65 backdrop-blur-lg"
          initial={false}
          animate={{ opacity: visible && opened ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
        <motion.div
          className="relative z-10 w-full max-w-4xl rounded-3xl border border-[#ffd7cc]/30 bg-[#08080b]/88 p-4 shadow-[0_0_60px_rgba(255,158,186,0.24)] backdrop-blur-md sm:p-6 md:p-8"
          initial={false}
          animate={{
            opacity: visible && opened ? 1 : 0,
            y: visible && opened ? 0 : 24,
            scale: visible && opened ? 1 : 0.97,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={() => setOpened(false)}
            className="absolute right-4 top-4 rounded-full border border-[#f5d4db]/35 px-3 py-1 text-xs tracking-[0.12em] text-[#f3dde2] hover:bg-[#f5d4db]/10"
            aria-label="Cerrar libro"
          >
            CERRAR
          </button>

          <p className="text-xs tracking-[0.28em] text-[#f5d4db]/75">Libro</p>
          <h3 className="mt-2 pr-20 font-serif text-2xl text-[#fff1f4] sm:text-3xl md:text-4xl">Para ella, siempre</h3>
          <p className="mt-2 text-sm text-[#f5d4db]/70 sm:text-base">
            Explora estas paginas y toca las flechas para avanzar.
          </p>

          <div className="mt-5 max-h-[45vh] overflow-y-auto rounded-2xl border border-[#f5d4db]/16 bg-[#120d14]/70 p-4 sm:max-h-[50vh] sm:p-5">
            <p className="text-xs tracking-[0.18em] text-[#f5d4db]/68">{pages[page].title.toUpperCase()}</p>
            <p className="mt-2 min-h-24 text-base leading-relaxed text-[#f3dde2] sm:text-lg">
              {pages[page].text}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
              className="rounded-full border border-[#f5d4db]/35 px-3 py-2 text-[11px] tracking-[0.12em] text-[#f3dde2] disabled:opacity-35 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
            >
              ANTERIOR
            </button>
            <span className="text-xs tracking-[0.16em] text-[#f5d4db]/70">
              {page + 1} / {pages.length}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pages.length - 1, current + 1))}
              disabled={page === pages.length - 1}
              className="rounded-full border border-[#f5d4db]/35 px-3 py-2 text-[11px] tracking-[0.12em] text-[#f3dde2] disabled:opacity-35 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
            >
              SIGUIENTE
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

