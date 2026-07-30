'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { buildGraph } from '@/lib/scenes/proofGraph';
import type { RenderTier } from '@/lib/useRenderTier';

/**
 * Scene C · The Proof Graph, live.
 *
 * 412 rule and fact nodes. On prove, the graph dims to hairline, the four-node
 * unsat core illuminates, and everything else collapses away, leaving the
 * minimal proof. The minimisation is a reduction in dimensionality, so the
 * motion has to read as a reduction and not as a fade.
 *
 * Choreography over 2.4s, all driven from one progress value:
 *   0.00 → 0.30  dim      everything drops to hairline
 *   0.15 → 0.55  ignite   the core comes up in --proof
 *   0.35 → 1.00  collapse the rest falls inward, outermost first
 */

const PROOF = new THREE.Color('#2F6BFF');
const HAIRLINE = new THREE.Color('#1F2A38');
const INK = new THREE.Color('#4E5B6E');

const DURATION = 2.4;
const SCALE = 280;

/** Decisive on the way out. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
/** Slow to leave, fast through the middle, settles rather than stops. */
const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const window01 = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));

function buildScene(density: number) {
  const { nodes, edges } = buildGraph(900, 560);

  const centre = new THREE.Vector3(450, 280, 0);
  const toLocal = (n: (typeof nodes)[number]) =>
    new THREE.Vector3(n.x - centre.x, -(n.y - centre.y), n.z) .divideScalar(SCALE);

  const coreNodes = nodes.filter((n) => n.core);
  const bulk = nodes.filter((n) => !n.core);
  // Tier 2 draws the same graph at lower density by taking a stride through the
  // same seeded order, so the shape is the shape, just sparser.
  const stride = Math.max(1, Math.round(bulk.length / density));
  const kept = bulk.filter((_, i) => i % stride === 0);
  const keptSet = new Set(kept);

  const bulkPositions = new Float32Array(kept.length * 3);
  const bulkRadius = new Float32Array(kept.length);
  kept.forEach((node, i) => {
    const v = toLocal(node);
    bulkPositions.set([v.x, v.y, v.z], i * 3);
    bulkRadius[i] = v.length();
  });

  const bulkEdges = edges.filter((e) => {
    const a = nodes[e.a];
    const b = nodes[e.b];
    return !e.core && a && b && keptSet.has(a) && keptSet.has(b);
  });

  const edgePositions = new Float32Array(bulkEdges.length * 6);
  const edgeRadius = new Float32Array(bulkEdges.length * 2);
  bulkEdges.forEach((edge, i) => {
    const a = nodes[edge.a];
    const b = nodes[edge.b];
    if (!a || !b) return;
    const va = toLocal(a);
    const vb = toLocal(b);
    edgePositions.set([va.x, va.y, va.z, vb.x, vb.y, vb.z], i * 6);
    edgeRadius[i * 2] = va.length();
    edgeRadius[i * 2 + 1] = vb.length();
  });

  const corePositions = coreNodes.map(toLocal);
  const coreEdgePositions: number[] = [];
  for (let i = 0; i < corePositions.length; i += 1) {
    for (let j = i + 1; j < corePositions.length; j += 1) {
      const a = corePositions[i];
      const b = corePositions[j];
      if (!a || !b) continue;
      coreEdgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  return {
    bulkPositions,
    bulkRadius,
    edgePositions,
    edgeRadius,
    corePositions,
    coreEdges: new Float32Array(coreEdgePositions),
    maxRadius: Math.max(...Array.from(bulkRadius), 1),
  };
}

function Graph({
  tier,
  progress,
}: {
  tier: Exclude<RenderTier, 3>;
  progress: React.RefObject<number>;
}) {
  const scene = useMemo(() => buildScene(tier === 1 ? 408 : 140), [tier]);

  const bulkRef = useRef<THREE.Points>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const coreRef = useRef<THREE.Group>(null);
  const coreEdgeRef = useRef<THREE.LineSegments>(null);
  const rootRef = useRef<THREE.Group>(null);
  const throttle = useRef(0);

  const bulkGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(scene.bulkPositions.slice(), 3));
    return g;
  }, [scene]);

  const edgeGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(scene.edgePositions.slice(), 3));
    return g;
  }, [scene]);

  const coreEdgeGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(scene.coreEdges.slice(), 3));
    return g;
  }, [scene]);

  useEffect(
    () => () => {
      bulkGeometry.dispose();
      edgeGeometry.dispose();
      coreEdgeGeometry.dispose();
    },
    [bulkGeometry, edgeGeometry, coreEdgeGeometry],
  );

  useFrame(({ clock }, delta) => {
    if (tier === 2) {
      throttle.current += delta;
      if (throttle.current < 1 / 30) return;
      throttle.current = 0;
    }

    const p = clamp01(progress.current ?? 0);
    const dim = easeOutQuart(window01(p, 0, 0.3));
    const ignite = easeOutQuart(window01(p, 0.15, 0.55));

    if (rootRef.current && tier === 1) {
      rootRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }

    // The bulk falls inward, outermost first, so the collapse reads as a wave
    // rather than as everything vanishing at once.
    const collapseAt = (radius: number) => {
      const lead = 1 - clamp01(radius / scene.maxRadius);
      return easeInOutQuint(window01(p, 0.35 + lead * 0.22, 0.9 + lead * 0.1));
    };

    if (bulkRef.current) {
      const attr = bulkRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = attr.array as Float32Array;
      for (let i = 0; i < scene.bulkRadius.length; i += 1) {
        const c = collapseAt(scene.bulkRadius[i] ?? 0);
        const k = 1 - c;
        array[i * 3] = (scene.bulkPositions[i * 3] ?? 0) * k;
        array[i * 3 + 1] = (scene.bulkPositions[i * 3 + 1] ?? 0) * k;
        array[i * 3 + 2] = (scene.bulkPositions[i * 3 + 2] ?? 0) * k;
      }
      attr.needsUpdate = true;

      const material = bulkRef.current.material as THREE.PointsMaterial;
      material.color.copy(INK).lerp(HAIRLINE, dim);
      material.opacity = 0.75 * (1 - dim * 0.45) * (1 - easeInOutQuint(window01(p, 0.4, 0.95)));
    }

    if (edgeRef.current) {
      const attr = edgeRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = attr.array as Float32Array;
      for (let i = 0; i < scene.edgeRadius.length; i += 1) {
        const k = 1 - collapseAt(scene.edgeRadius[i] ?? 0);
        array[i * 3] = (scene.edgePositions[i * 3] ?? 0) * k;
        array[i * 3 + 1] = (scene.edgePositions[i * 3 + 1] ?? 0) * k;
        array[i * 3 + 2] = (scene.edgePositions[i * 3 + 2] ?? 0) * k;
      }
      attr.needsUpdate = true;

      const material = edgeRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 * (1 - dim * 0.5) * (1 - easeInOutQuint(window01(p, 0.4, 0.95)));
    }

    if (coreRef.current) {
      const lift = 1 + ignite * 0.55;
      coreRef.current.scale.setScalar(lift);
      for (const child of coreRef.current.children) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.color.copy(INK).lerp(PROOF, ignite);
        material.opacity = 0.55 + ignite * 0.45;
      }
    }

    if (coreEdgeRef.current) {
      const material = coreEdgeRef.current.material as THREE.LineBasicMaterial;
      material.color.copy(HAIRLINE).lerp(PROOF, ignite);
      material.opacity = 0.15 + ignite * 0.8;
    }
  });

  return (
    <group ref={rootRef}>
      <points ref={bulkRef} geometry={bulkGeometry} frustumCulled={false}>
        <pointsMaterial
          color={INK}
          size={0.016}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={edgeRef} geometry={edgeGeometry} frustumCulled={false}>
        <lineBasicMaterial color={HAIRLINE} transparent opacity={0.5} depthWrite={false} />
      </lineSegments>

      <lineSegments ref={coreEdgeRef} geometry={coreEdgeGeometry} frustumCulled={false}>
        <lineBasicMaterial color={HAIRLINE} transparent opacity={0.15} depthWrite={false} />
      </lineSegments>

      <group ref={coreRef}>
        {scene.corePositions.map((position, index) => (
          <mesh key={index} position={position}>
            <icosahedronGeometry args={[0.026, 1]} />
            <meshBasicMaterial color={INK} transparent opacity={0.55} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function ProofGraphScene({
  tier,
  progress,
}: {
  tier: Exclude<RenderTier, 3>;
  progress: React.RefObject<number>;
}) {
  return (
    <Canvas
      dpr={tier === 1 ? [1, 1.5] : 1}
      gl={{ antialias: tier === 1, powerPreference: 'low-power', alpha: true }}
      camera={{ fov: 42, position: [0, 0, 3.1], near: 0.05, far: 24 }}
      style={{ pointerEvents: 'none' }}
    >
      <Graph tier={tier} progress={progress} />
    </Canvas>
  );
}

export { DURATION as PROOF_SEQUENCE_SECONDS };
