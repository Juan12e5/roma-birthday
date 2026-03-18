"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useRef, useState } from "react";

type UseCandleBlowOptions = {
  enabled: boolean;
  totalCandles: number;
};

type UseCandleBlowReturn = {
  candlesOff: number;
  completed: boolean;
  isListening: boolean;
  micAvailable: boolean;
  triggerClickBlow: () => void;
  reset: () => void;
};

export function useCandleBlow({
  enabled,
  totalCandles,
}: UseCandleBlowOptions): UseCandleBlowReturn {
  const [candlesOff, setCandlesOff] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const cooldownRef = useRef(0);

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    sourceRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
  }, []);

  const triggerBlow = useCallback(() => {
    setCandlesOff((current) => Math.min(totalCandles, current + 1));
  }, [totalCandles]);

  const startListening = useCallback(async () => {
    if (!enabled || isListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new window.AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      setMicAvailable(true);
      setIsListening(true);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const average = data.reduce((acc, val) => acc + val, 0) / data.length;
        if (average > 60 && Date.now() - cooldownRef.current > 900) {
          cooldownRef.current = Date.now();
          triggerBlow();
        }
        rafRef.current = window.requestAnimationFrame(tick);
      };
      rafRef.current = window.requestAnimationFrame(tick);
    } catch {
      setMicAvailable(false);
    }
  }, [enabled, isListening, triggerBlow]);

  useEffect(() => {
    if (!enabled) {
      stopListening();
      return;
    }
    startListening();
    return () => stopListening();
  }, [enabled, startListening, stopListening]);

  const triggerClickBlow = useCallback(() => {
    if (!enabled) return;
    if (Date.now() - cooldownRef.current < 380) return;
    cooldownRef.current = Date.now();
    triggerBlow();
  }, [enabled, triggerBlow]);

  const reset = useCallback(() => {
    setCandlesOff(0);
  }, []);

  return {
    candlesOff,
    completed: candlesOff >= totalCandles,
    isListening,
    micAvailable,
    triggerClickBlow,
    reset,
  };
}

