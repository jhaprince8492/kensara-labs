/**
 * The Formus sandbox model.
 *
 * A deliberately tiny device controller, checked exhaustively in the browser.
 * Everything here is textbook: breadth-first enumeration of a twelve-state
 * transition system, reverse reachability for the recoverability property,
 * and a fixed set of mutation operators. None of it is how Formus scales that
 * to a real codebase, and none of it needs to be: the point of the sandbox is
 * to show what an answer looks like, not how the answer is produced.
 *
 * Pure and deterministic. Same design and property in, same verdict, same
 * counter-example, same mutation score, every time.
 */

export type Mode = 'NOMINAL' | 'DEGRADED' | 'LOCKOUT';

export interface SystemState {
  mode: Mode;
  /** Sensor A healthy. */
  a: boolean;
  /** Sensor B healthy. */
  b: boolean;
}

/** The three design decisions a visitor can flip. */
export interface Design {
  sensorsRecover: boolean;
  recoveryFromLockout: boolean;
  lockoutRequiresBoth: boolean;
}

export const DEFAULT_DESIGN: Design = {
  sensorsRecover: true,
  recoveryFromLockout: false,
  lockoutRequiresBoth: true,
};

export const INITIAL: SystemState = { mode: 'NOMINAL', a: true, b: true };

export type PropertyId = 'recoverable' | 'lockout_health' | 'maintenance';

export interface PropertySpec {
  id: PropertyId;
  /** As an engineer would write it in the requirements document. */
  requirement: string;
  /** The same statement, formally. Shown so the two can be compared. */
  formal: string;
  ref: string;
}

export const PROPERTIES: readonly PropertySpec[] = [
  {
    id: 'recoverable',
    requirement: 'From any state the system can reach, it must be able to return to nominal operation.',
    formal: 'AG EF (mode = NOMINAL)',
    ref: 'REQ-CTL-0031',
  },
  {
    id: 'lockout_health',
    requirement: 'The system must never sit in lockout while both sensors are healthy.',
    formal: 'AG (mode = LOCKOUT -> !(a & b))',
    ref: 'REQ-CTL-0044',
  },
  {
    id: 'maintenance',
    requirement: 'In maintenance mode, both sensors must be isolated.',
    formal: 'AG (mode = MAINTENANCE -> !a & !b)',
    ref: 'REQ-CTL-0052',
  },
];

/**
 * Mutation operators. Each one introduces a specific, plausible design fault.
 * A property that cannot tell the mutated system from the real one is a
 * property that was not constraining much.
 */
export const MUTATIONS = [
  'drop the recovery edge out of degraded',
  'enter degraded on no condition',
  'leave lockout regardless of sensor health',
  'enter lockout on a single sensor',
  'sensor A can never recover',
  'invert the lockout guard',
] as const;

export type MutationIndex = number | null;

const key = (s: SystemState) => `${s.mode}|${s.a ? 1 : 0}|${s.b ? 1 : 0}`;

function successors(s: SystemState, d: Design, mutation: MutationIndex): SystemState[] {
  const out: SystemState[] = [];

  const bothUp = s.a && s.b;
  const bothDown = !s.a && !s.b;
  const anyDown = !s.a || !s.b;

  // Sensor events.
  if (s.a) out.push({ ...s, a: false });
  if (s.b) out.push({ ...s, b: false });
  if (d.sensorsRecover && !s.a && mutation !== 4) out.push({ ...s, a: true });
  if (d.sensorsRecover && !s.b) out.push({ ...s, b: true });

  // Mode transitions.
  if (s.mode === 'NOMINAL' && (mutation === 1 ? true : anyDown)) {
    out.push({ ...s, mode: 'DEGRADED' });
  }
  if (s.mode === 'DEGRADED' && bothUp && mutation !== 0) {
    out.push({ ...s, mode: 'NOMINAL' });
  }

  const lockoutGuardBase = d.lockoutRequiresBoth ? bothDown : anyDown;
  const lockoutGuard =
    mutation === 3 ? anyDown : mutation === 5 ? !lockoutGuardBase : lockoutGuardBase;
  if (s.mode === 'DEGRADED' && lockoutGuard) {
    out.push({ ...s, mode: 'LOCKOUT' });
  }

  if (s.mode === 'LOCKOUT' && d.recoveryFromLockout && (mutation === 2 ? true : bothUp)) {
    out.push({ ...s, mode: 'NOMINAL' });
  }

  return out;
}

interface Graph {
  states: SystemState[];
  index: Map<string, number>;
  edges: number[][];
  transitions: number;
}

/** Breadth-first enumeration of everything the system can actually reach. */
function explore(d: Design, mutation: MutationIndex): Graph {
  const states: SystemState[] = [INITIAL];
  const index = new Map<string, number>([[key(INITIAL), 0]]);
  const edges: number[][] = [[]];
  let transitions = 0;

  for (let i = 0; i < states.length; i += 1) {
    const current = states[i]!;
    for (const next of successors(current, d, mutation)) {
      const k = key(next);
      let j = index.get(k);
      if (j === undefined) {
        j = states.length;
        index.set(k, j);
        states.push(next);
        edges.push([]);
      }
      edges[i]!.push(j);
      transitions += 1;
    }
  }

  return { states, index, edges, transitions };
}

/** Shortest path from the initial state to `target`, as a list of states. */
function traceTo(graph: Graph, target: number): SystemState[] {
  const previous = new Map<number, number>();
  const seen = new Set<number>([0]);
  const queue = [0];

  while (queue.length > 0) {
    const at = queue.shift()!;
    if (at === target) break;
    for (const next of graph.edges[at] ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      previous.set(next, at);
      queue.push(next);
    }
  }

  const path: SystemState[] = [];
  let cursor: number | undefined = target;
  while (cursor !== undefined) {
    path.unshift(graph.states[cursor]!);
    cursor = previous.get(cursor);
  }
  return path;
}

export type CheckStatus = 'IMPLEMENTED' | 'VIOLATED' | 'VACUOUS';

export interface CheckOutcome {
  status: CheckStatus;
  /** Why, in the vocabulary of the design rather than of the checker. */
  reason: string;
  trace: SystemState[];
  statesExplored: number;
  transitions: number;
}

function evaluate(property: PropertyId, d: Design, mutation: MutationIndex): CheckOutcome {
  const graph = explore(d, mutation);
  const base = {
    statesExplored: graph.states.length,
    transitions: graph.transitions,
  };

  if (property === 'maintenance') {
    // The antecedent names a mode this system never enters, so the property
    // holds without constraining anything. That is a finding, not a pass.
    return {
      ...base,
      status: 'VACUOUS',
      reason:
        'mode = MAINTENANCE is never true in the reachable space, so the property holds without constraining the design',
      trace: [],
    };
  }

  if (property === 'lockout_health') {
    const bad = graph.states.findIndex((s) => s.mode === 'LOCKOUT' && s.a && s.b);
    if (bad === -1) {
      return { ...base, status: 'IMPLEMENTED', reason: 'holds in every reachable state', trace: [] };
    }
    return {
      ...base,
      status: 'VIOLATED',
      reason: 'the system can sit in lockout after both sensors have come back healthy',
      trace: traceTo(graph, bad),
    };
  }

  // recoverable: from every reachable state, can nominal still be reached?
  const reverse: number[][] = graph.states.map(() => []);
  graph.edges.forEach((targets, from) => {
    for (const to of targets) reverse[to]!.push(from);
  });

  const canReachNominal = new Set<number>();
  const queue: number[] = [];
  graph.states.forEach((s, i) => {
    if (s.mode === 'NOMINAL') {
      canReachNominal.add(i);
      queue.push(i);
    }
  });
  while (queue.length > 0) {
    const at = queue.shift()!;
    for (const from of reverse[at] ?? []) {
      if (canReachNominal.has(from)) continue;
      canReachNominal.add(from);
      queue.push(from);
    }
  }

  const stuck = graph.states.findIndex((_, i) => !canReachNominal.has(i));
  if (stuck === -1) {
    return {
      ...base,
      status: 'IMPLEMENTED',
      reason: 'nominal remains reachable from every state the system can enter',
      trace: [],
    };
  }

  return {
    ...base,
    status: 'VIOLATED',
    reason: 'this state is reachable, and no sequence of events leads back to nominal',
    trace: traceTo(graph, stuck),
  };
}

export interface SandboxResult extends CheckOutcome {
  property: PropertySpec;
  mutation: {
    /**
     * Only meaningful for a property that passes. Asking how many faults a
     * already-failing property catches tells you nothing you did not know.
     */
    applicable: boolean;
    killed: number;
    total: number;
    survivors: string[];
  };
  elapsedMs: number;
}

/**
 * Check the property, then check it again against each seeded fault. A
 * property that gives the same verdict on a broken design as on the real one
 * has not been earning its place.
 */
export function check(property: PropertyId, design: Design): SandboxResult {
  const started = performance.now();

  const spec = PROPERTIES.find((p) => p.id === property) ?? PROPERTIES[0]!;
  const outcome = evaluate(property, design, null);

  const survivors: string[] = [];
  let killed = 0;
  MUTATIONS.forEach((label, i) => {
    const mutated = evaluate(property, design, i);
    if (mutated.status !== outcome.status) killed += 1;
    else survivors.push(label);
  });

  return {
    ...outcome,
    property: spec,
    mutation: {
      applicable: outcome.status === 'IMPLEMENTED',
      killed,
      total: MUTATIONS.length,
      survivors,
    },
    elapsedMs: Math.round((performance.now() - started) * 100) / 100,
  };
}

/** Renders a state the way the trace shows it. */
export function formatState(s: SystemState): string {
  return `mode=${s.mode.padEnd(8)} sensorA=${s.a ? 'ok  ' : 'fail'} sensorB=${s.b ? 'ok' : 'fail'}`;
}
