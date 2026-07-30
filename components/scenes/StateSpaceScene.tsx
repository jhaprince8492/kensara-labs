'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { generateStates } from '@/lib/scenes/stateSpace';
import type { RenderTier } from '@/lib/useRenderTier';

/**
 * Scene A · The State Space, live.
 *
 * Tier 1 draws the full cloud at 60fps with DPR capped at 1.5. Tier 2 draws the
 * same composition at reduced density with drift disabled and the frame rate
 * capped at 30. Tier 3 never reaches this module: it is not imported at all,
 * which is also why `three` stays out of the initial bundle.
 */

const PROOF = new THREE.Color('#2F6BFF');
const REFUTE = new THREE.Color('#E2483F');

const DENSITY: Record<Exclude<RenderTier, 3>, number> = {
  1: 14412,
  2: 3000,
};

function buildCloud(count: number) {
  const points = generateStates(count);

  const dim: number[] = [];
  const lit: number[] = [];
  const red: number[] = [];

  for (const p of points) {
    const target = p.refuted ? red : p.sampled ? lit : dim;
    target.push(p.x, p.y, p.z);
  }

  return {
    dim: new Float32Array(dim),
    lit: new Float32Array(lit),
    red: new Float32Array(red),
  };
}

function Points({
  positions,
  color,
  size,
  opacity,
}: {
  positions: Float32Array;
  color: THREE.Color;
  size: number;
  opacity: number;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** The test suite: a thin ray sweeping through the cloud. */
function ScanRay({ tier }: { tier: Exclude<RenderTier, 3> }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * (tier === 1 ? 0.24 : 0.16);
    ref.current.position.x = Math.sin(t) * 1.15;
    ref.current.rotation.y = Math.sin(t) * 0.18;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[0.012, 2.6]} />
      <meshBasicMaterial
        color={PROOF}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Camera drift, plus the scroll push: as the hero leaves, the camera moves into
 * the cloud toward one refuted point until it fills the frame.
 */
function Rig({
  tier,
  progress,
}: {
  tier: Exclude<RenderTier, 3>;
  progress: React.RefObject<number>;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0.08, -0.14, 0.1), []);
  const last = useRef(0);

  useFrame(({ clock }, delta) => {
    // 30fps cap on tier 2.
    if (tier === 2) {
      last.current += delta;
      if (last.current < 1 / 30) return;
      last.current = 0;
    }

    const p = progress.current ?? 0;
    const drift = tier === 1 ? clock.getElapsedTime() * 0.045 : 0;

    const radius = THREE.MathUtils.lerp(2.55, 0.34, p);
    camera.position.set(
      Math.sin(drift) * 0.22 + target.x * p,
      Math.cos(drift * 0.8) * 0.12 + target.y * p,
      radius,
    );
    camera.lookAt(target.x * p, target.y * p, target.z * p - 0.2);
  });

  return null;
}

export default function StateSpaceScene({
  tier,
  progress,
}: {
  tier: Exclude<RenderTier, 3>;
  progress: React.RefObject<number>;
}) {
  const cloud = useMemo(() => buildCloud(DENSITY[tier]), [tier]);

  return (
    <Canvas
      dpr={tier === 1 ? [1, 1.5] : 1}
      gl={{ antialias: tier === 1, powerPreference: 'low-power', alpha: true }}
      camera={{ fov: 46, position: [0, 0, 2.55], near: 0.01, far: 12 }}
      style={{ pointerEvents: 'none' }}
    >
      <Points positions={cloud.dim} color={PROOF} size={0.0095} opacity={0.24} />
      <Points positions={cloud.lit} color={PROOF} size={0.015} opacity={0.8} />
      <Points positions={cloud.red} color={REFUTE} size={0.021} opacity={1} />
      <ScanRay tier={tier} />
      <Rig tier={tier} progress={progress} />
    </Canvas>
  );
}
