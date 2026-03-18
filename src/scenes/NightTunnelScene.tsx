"use client";
/* eslint-disable react-hooks/immutability */

import { Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type SceneProps = {
  progress: number;
  finalProgress: number;
  candlesOff: number;
  cinematicPause: boolean;
  onHouseOpen: () => void;
  onCakePress: () => void;
  onFlowerMessage: (message: string) => void;
  onBeamSweep: () => void;
  flowerMessages: string[];
};

type WorldProps = SceneProps;

function World({
  progress,
  finalProgress,
  candlesOff,
  cinematicPause,
  onHouseOpen,
  onCakePress,
  onFlowerMessage,
  onBeamSweep,
  flowerMessages,
}: WorldProps) {
  const { camera, scene } = useThree();
  const lighthouseRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Object3D>(null);
  const houseRef = useRef<THREE.Group>(null);
  const finalBeachRef = useRef<THREE.Group>(null);
  const finalSunRef = useRef<THREE.Mesh>(null);
  const finalSunGlowRef = useRef<THREE.Mesh>(null);
  const seaRef = useRef<THREE.Mesh>(null);
  const valleyRef = useRef<THREE.Mesh>(null);
  const cakeRef = useRef<THREE.Group>(null);
  const flameRefs = useRef<(THREE.Mesh | null)[]>([]);
  const flameLightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const smokeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lighthouseBeamCoreRef = useRef<THREE.Mesh>(null);
  const lighthouseBeamAuraRef = useRef<THREE.Mesh>(null);
  const lighthouseLampRef = useRef<THREE.PointLight>(null);
  const lighthouseHouseWashRef = useRef<THREE.PointLight>(null);
  const houseWarmRef = useRef<THREE.PointLight>(null);
  const houseGlowRef = useRef<THREE.Mesh>(null);
  const houseWindowRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const finalSunLightRef = useRef<THREE.PointLight>(null);
  const cakeKeyLightRef = useRef<THREE.PointLight>(null);
  const cakeFillLightRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const flowersFocusRef = useRef<THREE.PointLight>(null);
  const lighthouseFocusRef = useRef<THREE.PointLight>(null);
  const beamSweepCooldownRef = useRef(0);
  const seaBaseRef = useRef<Float32Array | null>(null);
  const valleyBaseRef = useRef<Float32Array | null>(null);
  const fogColor = useMemo(() => new THREE.Color("#050505"), []);
  const ringZ = useMemo(() => Array.from({ length: 18 }, (_, i) => -8 - i * 8), []);
  const candleSlots = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const angle = (index / 21) * Math.PI * 2;
        const radius = index % 2 === 0 ? 0.75 : 0.6;
        return {
          index,
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius * 0.72,
          stemHeight: 0.22 + (index % 3) * 0.03,
        };
      }),
    [],
  );
  const flowerSeeds = useMemo(() => {
    const entries: { x: number; z: number; s: number }[] = [];
    for (let i = 0; i < 120; i += 1) {
      const angle = (i * 0.43) % (Math.PI * 2);
      const radius = 2.1 + (i % 17) * 0.35;
      const x = Math.cos(angle) * radius + ((i % 5) - 2) * 0.12;
      const z = -8 - Math.sin(angle) * (radius * 0.9) - (i % 9) * 0.28;
      entries.push({ x, z, s: 0.82 + (i % 3) * 0.16 });
    }
    return entries;
  }, []);

  useFrame((state, delta) => {
    const rhythmFactor = cinematicPause
      ? 0.08
      : progress > 0.84 && candlesOff === 0
        ? 0.35
        : progress > 0.46 && progress < 0.52
          ? 0.55
          : 1;
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    const t = state.clock.elapsedTime;
    const endFade = THREE.MathUtils.smoothstep(finalProgress, 0.8, 1);
    const cakeFocus = THREE.MathUtils.smoothstep(progress, 0.84, 0.96);
    const wishDoneBoost = candlesOff >= 2 ? 1 : 0;

    const baseCameraZ = 12 - progress * 14.5 + finalProgress * 1.8;
    const cameraTargetZ = baseCameraZ - cakeFocus * (2.8 + wishDoneBoost * 0.8);
    const cameraTargetY = 1.35 + progress * 0.28 - finalProgress * 0.22 - cakeFocus * 0.18;
    const cameraTargetX = pointerX * 0.22;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraTargetZ, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraTargetY, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTargetX, 0.06);
    const lookZ = -22 + finalProgress * 14 + cakeFocus * 1.8;
    const lookY = 0.35 - finalProgress * 0.12 + pointerY * 0.12 - cakeFocus * 0.06;
    camera.lookAt(pointerX * (0.45 - cakeFocus * 0.1), lookY, lookZ);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 55 - cakeFocus * 9 - wishDoneBoost * 2, 0.08);
      camera.updateProjectionMatrix();
    }

    const dark = new THREE.Color("#050505");
    const warm = new THREE.Color("#3b1118");
    const sunset = new THREE.Color("#7a1e2c");
    fogColor.lerpColors(
      dark,
      warm,
      THREE.MathUtils.smoothstep(progress, 0.75, 1 - finalProgress * 0.15),
    );
    fogColor.lerp(sunset, finalProgress * 0.62);
    scene.fog = new THREE.Fog(
      fogColor,
      THREE.MathUtils.lerp(18, 28, cakeFocus),
      THREE.MathUtils.lerp(110, 145, cakeFocus),
    );
    scene.background = fogColor;

    if (ambientRef.current) {
      ambientRef.current.intensity = (0.72 + Math.sin(t * 0.35) * 0.05) * (1 - endFade * 0.78);
    }
    if (directionalRef.current) {
      directionalRef.current.intensity = (0.48 + Math.sin(t * 0.25) * 0.04) * (1 - endFade * 0.82);
    }
    if (flowersFocusRef.current) {
      flowersFocusRef.current.intensity =
        (progress > 0.34 && progress < 0.62 ? 0.55 : 0.12) + Math.sin(t * 1.4) * 0.05;
    }
    if (lighthouseFocusRef.current) {
      lighthouseFocusRef.current.intensity =
        (progress > 0.18 && progress < 0.42 ? 0.7 : 0.2) + Math.sin(t * 1.1) * 0.08;
    }

    if (lighthouseRef.current && beaconRef.current) {
      // Keep lighthouse beam fixed to the lighthouse (no sweep rotation).
      beaconRef.current.rotation.y = 0.28;
      lighthouseRef.current.position.z = -28 + progress * 10;
      lighthouseRef.current.position.y = -0.75 + progress * 0.28;
      lighthouseRef.current.position.x = -3.2 + finalProgress * 2.5;
      lighthouseRef.current.scale.setScalar(1 - finalProgress * 0.28);

      if (lighthouseBeamCoreRef.current) {
        lighthouseBeamCoreRef.current.scale.y = 0.88 + Math.sin(t * 2.2 * rhythmFactor) * 0.09;
        (lighthouseBeamCoreRef.current.material as THREE.MeshBasicMaterial).opacity =
          (0.22 + Math.sin(t * 1.8 * rhythmFactor) * 0.04) * (1 - endFade);
      }
      if (lighthouseBeamAuraRef.current) {
        (lighthouseBeamAuraRef.current.material as THREE.MeshBasicMaterial).opacity =
          (0.08 + Math.sin(t * 1.3 * rhythmFactor) * 0.03) * (1 - endFade);
      }
      if (lighthouseLampRef.current) {
        lighthouseLampRef.current.intensity =
          (2.5 - finalProgress * 1.4 + Math.sin(t * 3 * rhythmFactor) * 0.15) * (1 - endFade);
      }
      if (lighthouseHouseWashRef.current) {
        lighthouseHouseWashRef.current.intensity = (0.22 + finalProgress * 1.25) * (1 - endFade);
      }

      if (progress > 0.24 && progress < 0.7 && Date.now() - beamSweepCooldownRef.current > 1800) {
        beamSweepCooldownRef.current = Date.now();
        onBeamSweep();
      }
    }

    if (houseRef.current) {
      houseRef.current.position.z = -12 + progress * 6 - finalProgress * 8.2;
      houseRef.current.scale.setScalar(0.8 + progress * 0.55 - finalProgress * 0.25);
      houseRef.current.position.x = 2.8 - progress * 0.9 + finalProgress * 1.4;
    }
    if (houseWarmRef.current) {
      houseWarmRef.current.intensity = (2.2 + finalProgress * 2.8) * (1 - endFade);
    }
    if (houseGlowRef.current) {
      (houseGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        (0.12 + finalProgress * 0.35) * (1 - endFade);
    }
    houseWindowRefs.current.forEach((windowMaterial) => {
      if (!windowMaterial) return;
      windowMaterial.opacity = 1 - endFade * 0.96;
    });

    flowerSeeds.forEach((seed, index) => {
      const obj = scene.getObjectByName(`flower-${index}`);
      if (!obj) return;
      obj.rotation.z = Math.sin(state.clock.elapsedTime * 0.65 + index * 0.45) * 0.08;
      const valleyLift =
        Math.exp(-((seed.x * seed.x) / 42)) * 0.38 -
        Math.exp(-((seed.z + 11.5) * (seed.z + 11.5)) / 30) * 0.2;
      obj.position.y = -1.78 + valleyLift + Math.sin(t * 0.8 * rhythmFactor + index) * 0.03;
    });

    ringZ.forEach((z, index) => {
      const ring = scene.getObjectByName(`ring-${index}`) as THREE.Mesh | null;
      if (!ring) return;
      ring.position.z = z + progress * 34;
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.clamp(0.28 - progress * 0.12, 0.08, 0.35);
    });

    const fogPlane = scene.getObjectByName("fog-plane");
    if (fogPlane) {
      fogPlane.position.z = -18 + progress * 10;
      fogPlane.rotation.z += delta * 0.02 * rhythmFactor;
    }

    if (finalBeachRef.current) {
      finalBeachRef.current.position.z = -26 + finalProgress * 18;
      finalBeachRef.current.position.y = -4 + finalProgress * 3.2;
      finalBeachRef.current.position.x = finalProgress * 0.4;
    }

    if (finalSunRef.current) {
      finalSunRef.current.position.y = -1 + finalProgress * 2.3;
      (finalSunRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + finalProgress * 0.55;
    }
    if (finalSunGlowRef.current) {
      finalSunGlowRef.current.position.y = -1 + finalProgress * 2.3;
      finalSunGlowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.06);
      (finalSunGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + finalProgress * 0.5;
    }
    if (finalSunLightRef.current) {
      finalSunLightRef.current.intensity = 2.1 + finalProgress * 4.1 + endFade * 3;
    }
    if (cakeKeyLightRef.current) {
      cakeKeyLightRef.current.intensity =
        0.6 + cakeFocus * 2.8 + wishDoneBoost * 0.85 + Math.sin(t * 1.8) * 0.12;
    }
    if (cakeFillLightRef.current) {
      cakeFillLightRef.current.intensity = 0.35 + cakeFocus * 1.4 + wishDoneBoost * 0.4;
    }

    if (seaRef.current) {
      const geometry = seaRef.current.geometry as THREE.PlaneGeometry;
      const positionAttr = geometry.attributes.position;
      if (!seaBaseRef.current) {
        seaBaseRef.current = new Float32Array(positionAttr.array as Float32Array);
      }
      const base = seaBaseRef.current;
      const arr = positionAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i];
        const y = base[i + 1];
        const wave =
          Math.sin(x * 0.7 + t * 0.7 * rhythmFactor) * 0.07 +
          Math.cos(y * 0.6 + t * 0.55 * rhythmFactor) * 0.04;
        arr[i + 2] = wave;
      }
      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    if (valleyRef.current) {
      const geometry = valleyRef.current.geometry as THREE.PlaneGeometry;
      const positionAttr = geometry.attributes.position;
      if (!valleyBaseRef.current) {
        valleyBaseRef.current = new Float32Array(positionAttr.array as Float32Array);
      }
      const base = valleyBaseRef.current;
      const arr = positionAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i];
        const y = base[i + 1];
        const ridge = Math.sin(x * 0.32) * 0.44 + Math.cos(y * 0.24) * 0.28;
        const wind = Math.sin(t * 0.55 * rhythmFactor + x * 0.3 + y * 0.18) * 0.04;
        arr[i + 2] = ridge + wind;
      }
      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    flameRefs.current.forEach((flame, index) => {
      if (!flame) return;
      const slot = candleSlots[index];
      if (!slot) return;
      const baseY = slot.stemHeight + 0.06;
      const visible =
        candlesOff === 0 ||
        (candlesOff === 1 && index >= Math.ceil(flameRefs.current.length / 2));
      flame.visible = visible;
      const light = flameLightRefs.current[index];
      if (light) light.visible = visible;
      if (visible) {
        const flicker = Math.sin(t * 9.2 + index * 1.53);
        const swayX = Math.sin(t * 5.1 + index * 0.8) * 0.005 + pointerX * 0.008;
        const swayZ = Math.cos(t * 4.6 + index * 1.1) * 0.0035;
        flame.position.set(
          swayX,
          baseY + Math.max(0, flicker) * 0.01,
          swayZ,
        );
        flame.scale.set(
          0.78 + Math.abs(flicker) * 0.12,
          0.95 + Math.abs(Math.cos(t * 7.4 + index)) * 0.32,
          0.78 + Math.abs(flicker) * 0.1,
        );
        flame.rotation.z = swayX * 14;
        if (light) {
          light.position.set(swayX, baseY + 0.01, swayZ);
          light.intensity = 0.52 + Math.abs(flicker) * 0.42;
          light.distance = 2.2 + Math.abs(flicker) * 0.5;
        }
      }
    });

    smokeRefs.current.forEach((smoke, index) => {
      if (!smoke) return;
      const slot = candleSlots[index];
      if (!slot) return;
      const baseY = slot.stemHeight + 0.09;
      const shouldShow =
        candlesOff >= 2 ||
        (candlesOff === 1 && index < Math.ceil(smokeRefs.current.length / 2));
      smoke.visible = shouldShow;
      if (shouldShow) {
        smoke.position.x = Math.sin(t * 1.15 + index * 0.7) * 0.01;
        smoke.position.z = Math.cos(t * 1.05 + index * 0.6) * 0.008;
        smoke.position.y = baseY + Math.sin(t * 1.7 + index) * 0.06;
        (smoke.material as THREE.MeshBasicMaterial).opacity = 0.28 + Math.sin(t * 1.1) * 0.08;
      }
    });
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.78} color="#8498c4" />
      <directionalLight ref={directionalRef} position={[4, 6, 3]} intensity={0.52} color="#9db2df" />
      <pointLight
        ref={flowersFocusRef}
        position={[-0.6, -1.1, -10]}
        color="#b7d1ff"
        intensity={0.24}
        distance={26}
      />
      <pointLight
        ref={lighthouseFocusRef}
        position={[-2.8, 3.6, -20]}
        color="#ffd18d"
        intensity={0.3}
        distance={24}
      />

      <Stars radius={120} depth={90} count={2200} factor={5} saturation={0} speed={0.18} />
      <Stars radius={220} depth={180} count={5800} factor={7} saturation={0} speed={0.08} />

      {ringZ.map((z, index) => (
        <mesh key={z} name={`ring-${index}`} position={[0, 0.4, z]}>
          <torusGeometry args={[8.5, 0.07, 20, 120]} />
          <meshBasicMaterial color="#6880b0" transparent opacity={0.2} />
        </mesh>
      ))}

      <mesh name="fog-plane" position={[0, -1.4, -18]}>
        <planeGeometry args={[26, 7]} />
        <meshBasicMaterial color="#c9d3f5" transparent opacity={0.06} />
      </mesh>

      <group ref={lighthouseRef} position={[-3.2, -0.9, -34]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.62, 1.08, 4.9, 16]} />
          <meshStandardMaterial color="#c7b18f" roughness={0.45} metalness={0.08} />
        </mesh>
        <mesh position={[0, 4.9, 0]}>
          <cylinderGeometry args={[0.92, 0.92, 0.9, 18]} />
          <meshStandardMaterial color="#e2d3b8" />
        </mesh>
        <mesh position={[0, 5.55, 0]}>
          <coneGeometry args={[1.1, 0.95, 18]} />
          <meshStandardMaterial color="#5c2a22" />
        </mesh>

        <group ref={beaconRef} position={[0, 4.9, 0]}>
          <mesh ref={lighthouseBeamAuraRef} position={[0, 0, 3.3]}>
            <coneGeometry args={[3.3, 16.5, 40, 1, true]} />
            <meshBasicMaterial
              color="#ffdca3"
              transparent
              opacity={0.09 - finalProgress * 0.04}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={lighthouseBeamCoreRef} position={[0, 0, 2.4]}>
            <coneGeometry args={[1.55, 12.5, 34, 1, true]} />
            <meshBasicMaterial
              color="#ffdf98"
              transparent
              opacity={0.22 - finalProgress * 0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <pointLight
            ref={lighthouseLampRef}
            color="#ffd588"
            intensity={2.8 - finalProgress * 1.4}
            distance={22}
          />
          <pointLight
            ref={lighthouseHouseWashRef}
            position={[0, -0.15, 0.45]}
            color="#ffbd76"
            intensity={0.22}
            distance={20}
          />
        </group>
      </group>

      <group
        ref={houseRef}
        position={[2.7, -1.45, -14]}
        onClick={(event) => {
          event.stopPropagation();
          onHouseOpen();
        }}
      >
        <mesh
          position={[0, 1.2, 0.2]}
          onClick={(event) => {
            event.stopPropagation();
            onHouseOpen();
          }}
        >
          <boxGeometry args={[3.2, 2.8, 2.6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[2.2, 1.6, 1.7]} />
          <meshStandardMaterial color="#8a4d37" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.95, 1.05, 4]} />
          <meshStandardMaterial color="#5a0f1c" roughness={0.6} />
        </mesh>
        <mesh position={[-0.5, 1.1, 0.87]}>
          <planeGeometry args={[0.38, 0.42]} />
          <meshBasicMaterial
            ref={(element) => {
              houseWindowRefs.current[0] = element;
            }}
            color="#f4bf72"
            transparent
            opacity={1}
          />
        </mesh>
        <mesh position={[0.52, 1.1, 0.87]}>
          <planeGeometry args={[0.38, 0.42]} />
          <meshBasicMaterial
            ref={(element) => {
              houseWindowRefs.current[1] = element;
            }}
            color="#f3c67d"
            transparent
            opacity={1}
          />
        </mesh>
        <mesh ref={houseGlowRef} position={[0, 1.2, 0.72]}>
          <sphereGeometry args={[0.95, 18, 18]} />
          <meshBasicMaterial color="#ffcc8a" transparent opacity={0.12} />
        </mesh>
        <pointLight ref={houseWarmRef} position={[0, 1.2, 1]} color="#ffcc86" intensity={2.2} distance={10} />
      </group>

      <mesh ref={valleyRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, -11.5]}>
        <planeGeometry args={[30, 22, 72, 72]} />
        <meshStandardMaterial color="#2f3b38" roughness={0.96} metalness={0.05} />
      </mesh>

      {flowerSeeds.map((seed, index) => (
        <group
          key={`${seed.x}-${seed.z}`}
          name={`flower-${index}`}
          position={[seed.x, -1.8, seed.z]}
          scale={seed.s}
          onPointerDown={() => onFlowerMessage(flowerMessages[index % flowerMessages.length])}
        >
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
            <meshStandardMaterial color="#5f8b5f" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#d58da3" />
          </mesh>
        </group>
      ))}

      <group ref={finalBeachRef} position={[0, -4, -40]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -2]}>
          <planeGeometry args={[24, 20, 32, 32]} />
          <meshStandardMaterial color="#4a3a39" roughness={0.95} />
        </mesh>

        <mesh ref={seaRef} rotation={[-Math.PI / 2.05, 0, 0]} position={[0, -0.65, -8]}>
          <planeGeometry args={[30, 24, 56, 56]} />
          <meshStandardMaterial color="#1a3a5f" roughness={0.35} metalness={0.2} transparent opacity={0.84} />
        </mesh>

        <mesh ref={finalSunRef} position={[0, -1.1, -16]}>
          <sphereGeometry args={[3.6, 34, 34]} />
          <meshBasicMaterial color="#cf4c63" transparent opacity={0.34} />
        </mesh>
        <mesh ref={finalSunGlowRef} position={[0, -1.1, -16]}>
          <sphereGeometry args={[5.8, 34, 34]} />
          <meshBasicMaterial color="#ff8f6f" transparent opacity={0.28} depthWrite={false} />
        </mesh>

        <pointLight
          ref={finalSunLightRef}
          position={[0, 0.3, -13]}
          intensity={2.1}
          color="#cf4c63"
          distance={72}
        />

        <group ref={cakeRef} position={[0, -0.26, -1.2]} onPointerDown={onCakePress}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.1, 1.2, 0.42, 24]} />
            <meshStandardMaterial color="#f1dde0" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[1, 1.04, 0.22, 24]} />
            <meshStandardMaterial color="#7a1e2c" roughness={0.42} />
          </mesh>

          <group position={[0, 0.48, 0]}>
            {candleSlots.map((slot) => (
              <group key={slot.index} position={[slot.x, 0, slot.z]}>
                <mesh position={[0, slot.stemHeight / 2, 0]}>
                  <boxGeometry args={[0.045, slot.stemHeight, 0.045]} />
                  <meshStandardMaterial color="#f6efe9" />
                </mesh>
                <mesh
                  position={[0, slot.stemHeight + 0.06, 0]}
                  ref={(element) => {
                    flameRefs.current[slot.index] = element;
                  }}
                  scale={[0.84, 1.06, 0.84]}
                >
                  <coneGeometry args={[0.032, 0.11, 10]} />
                  <meshBasicMaterial color="#ffbf6e" transparent opacity={0.92} />
                </mesh>
                <pointLight
                  ref={(element) => {
                    flameLightRefs.current[slot.index] = element;
                  }}
                  position={[0, slot.stemHeight + 0.07, 0]}
                  color="#ffcc87"
                  intensity={0.52}
                  distance={2.3}
                />
                <mesh
                  position={[0, slot.stemHeight + 0.03, 0]}
                  ref={(element) => {
                    smokeRefs.current[slot.index] = element;
                  }}
                  visible={false}
                >
                  <sphereGeometry args={[0.048, 10, 10]} />
                  <meshBasicMaterial color="#d9d9d9" transparent opacity={0.24} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
        <pointLight
          ref={cakeKeyLightRef}
          position={[0, 1.3, -1.1]}
          intensity={0.7}
          color="#ffd9a6"
          distance={10}
        />
        <pointLight
          ref={cakeFillLightRef}
          position={[0, 0.35, 0.4]}
          intensity={0.4}
          color="#ff9eb4"
          distance={8}
        />

        <Sparkles
          count={finalProgress > 0.72 ? 90 : 30}
          scale={[16, 5, 12]}
          position={[0, 0.6, -8]}
          speed={0.22}
          color={candlesOff >= 2 ? "#f4d8ff" : "#f7e3c8"}
          size={1.8}
        />
        <Sparkles
          count={120}
          scale={[26, 8, 20]}
          position={[0, 2.4, -12]}
          speed={0.08}
          color="#d6e2ff"
          size={1.2}
        />
        <Sparkles
          count={180}
          scale={[46, 14, 42]}
          position={[0, 4.8, -26]}
          speed={0.05}
          color="#c4d4ff"
          size={1.45}
        />
      </group>
    </>
  );
}

export function NightTunnelScene(props: SceneProps) {
  return (
    <Canvas camera={{ fov: 55, near: 0.1, far: 220, position: [0, 1.2, 14] }} dpr={[1, 1.5]}>
      <World {...props} />
    </Canvas>
  );
}

