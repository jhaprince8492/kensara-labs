'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GATE_SCENARIOS, SCENARIO_SECONDS } from '@/lib/scenes/gate';
import type { RenderTier } from '@/lib/useRenderTier';

/**
 * Scene B · The Gate, live.
 *
 * An intent packet enters from the left, meets the plane, is examined against
 * the orbiting policy tokens, and then either continues right or is deflected
 * into the hold lane. The corridor is drawn so that there is no path through it
 * that misses the plane, because that is the actual claim.
 */

const GATE = new THREE.Color('#22C39A');
const HOLD = new THREE.Color('#E0A22A');
const INK = new THREE.Color('#8A98AC');
const HAIRLINE = new THREE.Color('#1F2A38');

const HALF = 0.62;
const LENGTH = 2.35;

// Hoisted so the source geometries are created once rather than on every
// render of the scene graph.
const GATE_PLANE = new THREE.PlaneGeometry(HALF * 2, HALF * 2);
const HOLD_LANE = new THREE.BoxGeometry(LENGTH * 0.8, 0.02, HALF * 1.2);

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const window01 = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function corridorGeometry(): THREE.BufferGeometry {
  const points: number[] = [];
  const corners: [number, number][] = [
    [-HALF, -HALF],
    [HALF, -HALF],
    [HALF, HALF],
    [-HALF, HALF],
  ];

  // Four rails running the length of the corridor.
  for (const [y, z] of corners) {
    points.push(-LENGTH, y, z, LENGTH, y, z);
  }

  // Ribs, so depth reads without needing lights.
  for (let i = 0; i <= 8; i += 1) {
    const x = -LENGTH + (i / 8) * LENGTH * 2;
    for (let c = 0; c < corners.length; c += 1) {
      const a = corners[c]!;
      const b = corners[(c + 1) % corners.length]!;
      points.push(x, a[0], a[1], x, b[0], b[1]);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

function Corridor() {
  const geometry = useMemo(corridorGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={HAIRLINE} transparent opacity={0.85} />
    </lineSegments>
  );
}

function Gate({
  tier,
  onScenario,
}: {
  tier: Exclude<RenderTier, 3>;
  onScenario: (index: number) => void;
}) {
  const packet = useRef<THREE.Mesh>(null);
  const tokens = useRef<THREE.Group>(null);
  const plane = useRef<THREE.Mesh>(null);
  const current = useRef(-1);
  const throttle = useRef(0);

  useFrame(({ clock }, delta) => {
    if (tier === 2) {
      throttle.current += delta;
      if (throttle.current < 1 / 30) return;
      throttle.current = 0;
    }

    const elapsed = clock.getElapsedTime();
    const index = Math.floor(elapsed / SCENARIO_SECONDS) % GATE_SCENARIOS.length;
    const t = (elapsed % SCENARIO_SECONDS) / SCENARIO_SECONDS;

    if (index !== current.current) {
      current.current = index;
      onScenario(index);
    }

    const scenario = GATE_SCENARIOS[index] ?? GATE_SCENARIOS[0]!;
    const held = scenario.outcome === 'REVIEW';

    // approach 0 → 0.34 · examination 0.34 → 0.56 · resolution 0.56 → 0.94
    const approach = easeInOutCubic(window01(t, 0, 0.34));
    const examine = window01(t, 0.34, 0.56);
    const resolve = easeInOutCubic(window01(t, 0.56, 0.94));

    if (packet.current) {
      const x = -LENGTH + approach * LENGTH + resolve * LENGTH;
      packet.current.position.x = x;
      packet.current.position.y = held ? -resolve * 0.42 : 0;
      packet.current.rotation.y = elapsed * 0.6;

      const material = packet.current.material as THREE.MeshBasicMaterial;
      const target = held ? HOLD : GATE;
      material.color.copy(INK).lerp(target, resolve);
      // Fades as it parks in the hold lane; passes at full strength.
      material.opacity = held ? 1 - resolve * 0.25 : 1;
    }

    if (tokens.current) {
      tokens.current.rotation.x = tier === 1 ? elapsed * 0.5 : 0;
      const active = examine > 0 && examine < 1 ? 1 : 0.35;
      for (const child of tokens.current.children) {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.25 + active * 0.5;
      }
    }

    if (plane.current) {
      const material = plane.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.07 + (examine > 0 && examine < 1 ? 0.1 : 0);
    }
  });

  return (
    <group>
      <Corridor />

      {/* the gate plane, spanning the corridor */}
      <mesh ref={plane} rotation={[0, Math.PI / 2, 0]} geometry={GATE_PLANE}>
        <meshBasicMaterial
          color={GATE}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments rotation={[0, Math.PI / 2, 0]}>
        <edgesGeometry args={[GATE_PLANE]} />
        <lineBasicMaterial color={GATE} transparent opacity={0.55} />
      </lineSegments>

      {/* policy tokens, orbiting the plane */}
      <group ref={tokens}>
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[0, Math.cos(angle) * 0.42, Math.sin(angle) * 0.42]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <planeGeometry args={[0.17, 0.07]} />
              <meshBasicMaterial color={INK} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>

      {/* the hold lane */}
      <lineSegments position={[LENGTH * 0.55, -0.42, 0]}>
        <edgesGeometry args={[HOLD_LANE]} />
        <lineBasicMaterial color={HOLD} transparent opacity={0.35} />
      </lineSegments>

      {/* the intent packet */}
      <mesh ref={packet}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshBasicMaterial color={INK} transparent opacity={1} />
      </mesh>
    </group>
  );
}

export default function GateScene({
  tier,
  onScenario,
}: {
  tier: Exclude<RenderTier, 3>;
  onScenario: (index: number) => void;
}) {
  return (
    <Canvas
      dpr={tier === 1 ? [1, 1.5] : 1}
      gl={{ antialias: tier === 1, powerPreference: 'low-power', alpha: true }}
      camera={{ fov: 34, position: [3.1, 1.85, 3.4], near: 0.1, far: 24 }}
      onCreated={({ camera }) => camera.lookAt(0.15, -0.08, 0)}
      style={{ pointerEvents: 'none' }}
    >
      <Gate tier={tier} onScenario={onScenario} />
    </Canvas>
  );
}
