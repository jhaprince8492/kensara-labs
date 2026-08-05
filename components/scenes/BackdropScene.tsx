'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { generateStates } from '@/lib/scenes/stateSpace';
import type { RenderTier } from '@/lib/useRenderTier';

/**
 * The page backdrop.
 *
 * One fixed scene carrying two ideas that belong together. At the top it is
 * Scene A: the reachable state space, most of it calm, a handful of refuted
 * states deep inside, and the thin ray that samples 128 of 14,412. As you
 * scroll, that cloud recedes and eighty shards converge into a single solid,
 * which is the artifact the whole page is about. Scattered at the premise,
 * assembled by the close.
 *
 * Everything here is decoration in the strict sense: no verdict, no number and
 * no argument lives on this canvas. The copy above it carries all of that, and
 * the scene is `aria-hidden` because its text equivalent is already in the DOM.
 */

const PROOF = new THREE.Color('#2F6BFF');
const REFUTE = new THREE.Color('#E2483F');
const INK = new THREE.Color('#8A98AC');

const CLOUD_SCALE = 26;
const CRYSTAL_RADIUS = 8;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const window01 = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
/** Slow at both ends so the assembly settles rather than snapping shut. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Deterministic. The backdrop is the same sculpture for every visitor. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --------------------------------------------------------------- the star bed

function Stars({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const next = rng(0x57a2);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 1) positions[i] = (next() - 0.5) * 150;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial color={INK} size={0.11} sizeAttenuation transparent opacity={0.42} depthWrite={false} />
    </points>
  );
}

// ------------------------------------------------------------ the state cloud

function StateCloud({
  count,
  progress,
}: {
  count: number;
  progress: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  const cloud = useMemo(() => {
    const points = generateStates(count);
    const dim: number[] = [];
    const lit: number[] = [];
    const red: number[] = [];
    for (const p of points) {
      const target = p.refuted ? red : p.sampled ? lit : dim;
      target.push(p.x * CLOUD_SCALE, p.y * CLOUD_SCALE, p.z * CLOUD_SCALE);
    }
    return {
      dim: new Float32Array(dim),
      lit: new Float32Array(lit),
      red: new Float32Array(red),
    };
  }, [count]);

  const geometries = useMemo(() => {
    const make = (arr: Float32Array) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      return g;
    };
    return { dim: make(cloud.dim), lit: make(cloud.lit), red: make(cloud.red) };
  }, [cloud]);

  useEffect(
    () => () => {
      geometries.dim.dispose();
      geometries.lit.dispose();
      geometries.red.dispose();
    },
    [geometries],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 0.018;

    // The cloud owns the hero and then gets out of the way. The refuted points
    // go with it, so red never persists as background decoration.
    const fade = 1 - easeInOutCubic(window01(progress.current ?? 0, 0.04, 0.26));
    const base = [0.3, 0.85, 1];
    group.current.children.forEach((child, i) => {
      const material = (child as THREE.Points).material as THREE.PointsMaterial;
      material.opacity = (base[i] ?? 0) * fade;
    });
  });

  return (
    <group ref={group}>
      <points geometry={geometries.dim} frustumCulled={false}>
        <pointsMaterial
          color={PROOF}
          size={0.24}
          sizeAttenuation
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={geometries.lit} frustumCulled={false}>
        <pointsMaterial
          color={PROOF}
          size={0.4}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={geometries.red} frustumCulled={false}>
        <pointsMaterial
          color={REFUTE}
          size={0.55}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ------------------------------------------------------------- the shard body

interface Shard {
  start: THREE.Vector3;
  end: THREE.Vector3;
  startQ: THREE.Quaternion;
  endQ: THREE.Quaternion;
}

function Crystal({
  detail,
  progress,
}: {
  detail: number;
  progress: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<THREE.Mesh[]>([]);

  const { geometries, shards, material } = useMemo(() => {
    const next = rng(0x2f6b1c);
    const base = new THREE.IcosahedronGeometry(CRYSTAL_RADIUS, detail).toNonIndexed();
    const positions = base.attributes.position!.array as Float32Array;

    const geometries: THREE.BufferGeometry[] = [];
    const shards: Shard[] = [];

    // One mesh per triangle, each centred on its own centroid so it can rotate
    // about itself on the way in.
    for (let i = 0; i < positions.length; i += 9) {
      const tri = new Float32Array(9);
      for (let j = 0; j < 9; j += 1) tri[j] = positions[i + j] ?? 0;

      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(tri, 3));
      g.computeBoundingBox();
      const centre = new THREE.Vector3();
      g.boundingBox!.getCenter(centre);
      g.translate(-centre.x, -centre.y, -centre.z);
      g.computeVertexNormals();
      geometries.push(g);

      const scatter = centre
        .clone()
        .normalize()
        .multiplyScalar(26 + next() * 30)
        .add(
          new THREE.Vector3(
            (next() - 0.5) * 12,
            (next() - 0.5) * 12,
            (next() - 0.5) * 12,
          ),
        );

      shards.push({
        start: scatter,
        end: centre.clone(),
        startQ: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            next() * Math.PI * 4,
            next() * Math.PI * 4,
            next() * Math.PI * 4,
          ),
        ),
        endQ: new THREE.Quaternion(),
      });
    }

    base.dispose();

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141B25'),
      metalness: 0.92,
      roughness: 0.16,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    return { geometries, shards, material };
  }, [detail]);

  useEffect(
    () => () => {
      for (const g of geometries) g.dispose();
      material.dispose();
    },
    [geometries, material],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.085;
    group.current.rotation.x = t * 0.042;

    const p = easeInOutCubic(clamp01(progress.current ?? 0));
    for (let i = 0; i < meshes.current.length; i += 1) {
      const mesh = meshes.current[i];
      const shard = shards[i];
      if (!mesh || !shard) continue;
      mesh.position.lerpVectors(shard.start, shard.end, p);
      mesh.quaternion.slerpQuaternions(shard.startQ, shard.endQ, p);
    }
  });

  return (
    <group ref={group}>
      {geometries.map((geometry, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          ref={(node) => {
            if (node) meshes.current[i] = node;
          }}
        />
      ))}
    </group>
  );
}

// ------------------------------------------------------------------ the scene

export default function BackdropScene({
  tier,
  scroll,
}: {
  tier: Exclude<RenderTier, 3>;
  scroll: React.RefObject<number>;
}) {
  const eased = useRef(0);

  return (
    <Canvas
      dpr={tier === 1 ? [1, 1.5] : 1}
      gl={{ antialias: tier === 1, powerPreference: 'low-power', alpha: true }}
      camera={{ fov: 45, position: [0, 0, 40], near: 0.1, far: 240 }}
      // Explicit, rather than relying on the container defaults being merged.
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[14, 12, 16]} intensity={420} color={PROOF} distance={140} />
      <pointLight position={[-16, -10, 12]} intensity={180} color="#ffffff" distance={140} />

      <Stars count={tier === 1 ? 1500 : 500} />
      <StateCloud count={tier === 1 ? 14412 : 3000} progress={eased} />

      {/* Offset right on desktop so the sculpture never sits under the measure. */}
      <group position={[tier === 1 ? 11 : 8, 0, 0]}>
        <Crystal detail={tier === 1 ? 1 : 0} progress={eased} />
      </group>

      <ScrollBridge from={scroll} to={eased} />
    </Canvas>
  );
}

/**
 * Copies the DOM scroll fraction into the scene's own ref once per frame,
 * damped. This stands in for a scrubbed timeline: the sculpture trails the
 * scroll slightly rather than tracking it rigidly, which is what makes the
 * assembly feel like mass moving rather than a slider being dragged.
 */
function ScrollBridge({
  from,
  to,
}: {
  from: React.RefObject<number>;
  to: React.RefObject<number>;
}) {
  const damped = useRef(0);
  useFrame((_, delta) => {
    const target = from.current ?? 0;
    damped.current += (target - damped.current) * Math.min(1, delta * 3.2);
    to.current = damped.current;
  });
  return null;
}
