"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import roma1 from "@/assets/images/roma1.webp";
import roma2 from "@/assets/images/roma2.webp";
import roma3 from "@/assets/images/roma3.webp";

type HouseMemoriesModalProps = {
  open: boolean;
  onClose: () => void;
};

export function HouseMemoriesModal({ open, onClose }: HouseMemoriesModalProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-3 sm:px-4 md:px-8 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-3xl border border-[#b38aa0]/30 bg-[#11070d]/92 p-4 text-[#f2d7de] shadow-[0_24px_120px_rgba(0,0,0,0.45)] sm:p-6 md:p-8 xl:max-w-384"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl">Dentro de tu hogar</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#f2d7de]/30 px-4 py-1 text-xs tracking-[0.18em] hover:bg-[#f2d7de]/10"
          >
            CERRAR
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#f2d7de]/85">
          Aqui yacen fotos que celebrar tu día especial:
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { text: "Vestido que decora tu belleza", img: roma1 },
            { text: "Tu mirada en lo cotidiano", img: roma2 },
            { text: "Tu risa que me encanta", img: roma3 },
          ].map((item) => (
            <article
              key={item.text}
              className="rounded-2xl border border-[#f2d7de]/15 bg-[#2b0f1b]/55 p-4 text-base"
            >
              <div className="h-[36rem] rounded-xl overflow-hidden md:h-[40rem] lg:h-[44rem]">
                <Image
                  src={item.img}
                  alt={item.text}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <p className="mt-3 text-lg">{item.text}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

