"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Howl } from "howler";

type UseAmbientAudioReturn = {
  enabled: boolean;
  toggle: () => void;
  ready: boolean;
  setVolume: (volume: number) => void;
};

export function useAmbientAudio(src: string): UseAmbientAudioReturn {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const unlockedRef = useRef(false);

  const sound = useMemo(
    () =>
      new Howl({
        src: [src],
        loop: true,
        volume: 0.36,
        html5: true,
        preload: true,
        onload: () => setReady(true),
      }),
    [src],
  );

  const playSafely = useCallback(() => {
    if (!enabled) return;
    const id = sound.play();
    if (id) {
      unlockedRef.current = true;
    }
  }, [enabled, sound]);

  useEffect(() => {
    if (enabled) {
      playSafely();
    } else {
      sound.pause();
    }
  }, [enabled, playSafely, sound]);

  useEffect(() => {
    if (!enabled || unlockedRef.current) return;

    const unlockAudio = () => {
      if (!enabled || unlockedRef.current) return;
      playSafely();
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("wheel", unlockAudio, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("wheel", unlockAudio);
    };
  }, [enabled, playSafely]);

  useEffect(() => {
    return () => {
      sound.stop();
      sound.unload();
    };
  }, [sound]);

  return {
    enabled,
    ready,
    toggle: () => setEnabled((current) => !current),
    setVolume: (volume: number) => {
      sound.volume(volume);
    },
  };
}

