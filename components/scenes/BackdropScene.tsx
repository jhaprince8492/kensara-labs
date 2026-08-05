'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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

/**
 * The only element that persists across the whole page. It carries continuity
 * between the two acts, so it is held far enough back to never compete: this
 * is depth, not content.
 */
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
      <pointsMaterial color={INK} size={0.1} sizeAttenuation transparent opacity={0.26} depthWrite={false} />
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

    // The cloud owns the hero alone and is fully gone before the solid has any
    // presence. The two never share a frame at strength, which is the whole
    // point: one idea per viewport. The refuted points leave with it, so red
    // never persists as background decoration.
    const fade = 1 - easeInOutCubic(window01(progress.current ?? 0, 0.06, 0.17));
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

      // Held to a coherent constellation rather than debris thrown past the
      // lens. Anything beyond roughly 30 units clips the frame at this focal
      // length and reads as chaos instead of as a form waiting to resolve.
      const scatter = centre
        .clone()
        .normalize()
        .multiplyScalar(17 + next() * 12)
        .add(
          new THREE.Vector3(
            (next() - 0.5) * 7,
            (next() - 0.5) * 7,
            (next() - 0.5) * 7,
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

    // A metal reflects its surroundings, so at metalness near 1 with nothing to
    // reflect it renders black. The environment below is what makes this read
    // as machined metal; the roughness keeps it brushed rather than mirrored.
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#20293A'),
      metalness: 0.86,
      roughness: 0.26,
      envMapIntensity: 1.2,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
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
    const page = clamp01(progress.current ?? 0);

    // The solid does not exist while the hero is on screen. It is not drawn at
    // all below the threshold, which also keeps 80 draw calls out of the most
    // performance-sensitive viewport on the page.
    const presence = easeInOutCubic(window01(page, 0.11, 0.24));
    group.current.visible = presence > 0.002;
    material.opacity = presence;
    if (!group.current.visible) return;

    // Enters slightly under scale, so it arrives rather than appears.
    const scale = 0.94 + presence * 0.06;
    group.current.scale.setScalar(scale);

    // Assembly begins only after the handoff and resolves before the close.
    const assemble = easeInOutCubic(window01(page, 0.2, 0.9));

    // Rotation settles as the form resolves. Motion that comes to rest reads
    // as an object; motion that never stops reads as a screensaver.
    const t = clock.getElapsedTime();
    const spin = 1 - 0.72 * assemble;
    group.current.rotation.y = t * 0.085 * spin;
    group.current.rotation.x = t * 0.042 * spin;

    for (let i = 0; i < meshes.current.length; i += 1) {
      const mesh = meshes.current[i];
      const shard = shards[i];
      if (!mesh || !shard) continue;
      mesh.position.lerpVectors(shard.start, shard.end, assemble);
      mesh.quaternion.slerpQuaternions(shard.startQ, shard.endQ, assemble);
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

// ------------------------------------------------------- lighting environment

/**
 * A metallic surface is almost entirely reflection, so without something to
 * reflect it is black no matter how many lights you add. This builds a small
 * room, prefilters it, and hands it to the scene as an environment map. No
 * external asset is fetched, which matters for a statically exported site.
 */
function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.texture.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

// ------------------------------------------------------------------ the camera

/**
 * The hero push, restored.
 *
 * Across the first viewport the camera moves into the cloud, which is the
 * gesture that makes 128 of 14,412 land. Once the hero is behind you it eases
 * back out so the assembling solid has room to compose.
 */
function CameraRig({
  page,
  hero,
}: {
  page: React.RefObject<number>;
  hero: React.RefObject<number>;
}) {
  const camera = useThree((state) => state.camera);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const push = easeInOutCubic(clamp01(hero.current ?? 0));
    // Back out before the solid reaches strength, so the two acts hand over
    // rather than collide.
    const retreat = easeInOutCubic(window01(page.current ?? 0, 0.08, 0.24));

    camera.position.z = 40 - push * 22 + retreat * 24;
    camera.position.x = push * 2.2 - retreat * 1.4;
    camera.position.y = -push * 1.6 + retreat * 1.2;

    // During the push the camera drifts toward a refuted point deep in the
    // cloud rather than staying centred.
    look.set(push * 3.4 * (1 - retreat), -push * 4.2 * (1 - retreat), 0);
    camera.lookAt(look);
  });

  return null;
}

// ------------------------------------------------------------------ the scene

export default function BackdropScene({
  tier,
  scroll,
  hero,
}: {
  tier: Exclude<RenderTier, 3>;
  scroll: React.RefObject<number>;
  hero: React.RefObject<number>;
}) {
  const easedPage = useRef(0);
  const easedHero = useRef(0);

  return (
    <Canvas
      dpr={tier === 1 ? [1, 1.5] : 1}
      gl={{ antialias: tier === 1, powerPreference: 'low-power', alpha: true }}
      camera={{ fov: 45, position: [0, 0, 40], near: 0.1, far: 240 }}
      // Explicit, rather than relying on the container defaults being merged.
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
    >
      <StudioEnvironment />

      <ambientLight intensity={0.6} />
      <pointLight position={[16, 14, 18]} intensity={900} color={PROOF} distance={160} />
      <pointLight position={[-18, -10, 14]} intensity={500} color="#ffffff" distance={160} />
      <directionalLight position={[6, 10, 12]} intensity={1.1} color="#cfd8e6" />

      <Stars count={tier === 1 ? 1500 : 500} />
      <StateCloud count={tier === 1 ? 14412 : 3000} progress={easedPage} />

      {/* Offset right on desktop so the sculpture never sits under the measure. */}
      <group position={[tier === 1 ? 11 : 8, 0, 0]}>
        <Crystal detail={tier === 1 ? 1 : 0} progress={easedPage} />
      </group>

      <CameraRig page={easedPage} hero={easedHero} />
      <ScrollBridge from={scroll} to={easedPage} />
      <ScrollBridge from={hero} to={easedHero} />
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
