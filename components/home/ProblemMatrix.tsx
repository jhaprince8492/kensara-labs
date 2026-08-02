import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import { SectionRule } from '@/components/primitives/SectionRule';
import { home, type MatrixGroup, type MatrixRow } from '@/content/copy/home';
import { MatrixGlyph } from './MatrixGlyph';

/**
 * The problem matrix.
 *
 * Problem on the left, what we do about it on the right, one row each. The two
 * sides are separated by ground and elevation rather than by colour: the
 * problem sits flat on the page, the answer is raised onto a panel. Colour on
 * this site is data, so the only hue in a row is its mono readout, which is a
 * real verdict.
 *
 * Nothing is behind a hover. Every failure line and every readout is in the
 * markup at all times, because a screenshot or a PDF export is how most people
 * will see this section.
 */
export function ProblemMatrix() {
  const { matrix } = home;

  return (
    <div>
      {/* column headers, stated once */}
      <div className="mb-2 hidden lg:block">
        <div className="grid grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] items-end gap-0">
          <Eyebrow as="p">{matrix.columns.problem}</Eyebrow>
          <span aria-hidden="true" />
          <Eyebrow as="p">{matrix.columns.solution}</Eyebrow>
        </div>
      </div>

      {matrix.groups.map((group, groupIndex) => (
        <Group key={group.eyebrow} group={group} first={groupIndex === 0} />
      ))}

      <Reveal className="mt-12">
        <p className="border border-hairline bg-slate-900 px-6 py-6 text-21 text-ink-100 sm:px-8">
          {matrix.closing}
        </p>
      </Reveal>
    </div>
  );
}

function Group({ group, first }: { group: MatrixGroup; first: boolean }) {
  return (
    <section className={first ? '' : 'mt-16'} aria-label={group.eyebrow}>
      <SectionRule label={group.eyebrow} value={`${group.rows.length} problems`} />
      <dl className="mt-2">
        {group.rows.map((row, index) => (
          <Row key={row.problem.name} row={row} engine={group.engine} delay={index * 40} />
        ))}
      </dl>
    </section>
  );
}

function Row({
  row,
  engine,
  delay,
}: {
  row: MatrixRow;
  engine: MatrixGroup['engine'];
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="grid gap-6 border-t border-hairline py-8 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] lg:gap-0">
        {/* the problem, flat on the ground */}
        <dt className="flex gap-5 lg:pr-8">
          <MatrixGlyph name={row.glyph} variant="problem" />
          <div className="min-w-0">
            <h3 className="text-21 text-ink-100">{row.problem.name}</h3>
            <p className="mt-3 text-17 text-ink-400">{row.problem.body}</p>
            <p className="mono mt-4 text-12 text-ink-500">
              <span className="tracking-[0.14em] uppercase">real cost</span>
              <span> · </span>
              <span className="text-ink-400">{row.problem.cost}</span>
            </p>
          </div>
        </dt>

        {/* the arrow lives in the gutter, and is decoration only */}
        <span
          aria-hidden="true"
          className="mono hidden items-center justify-center text-14 text-ink-500 lg:flex"
        >
          →
        </span>

        {/* what we do, raised onto a panel */}
        <dd className="flex gap-5 border border-hairline bg-slate-800 p-5 sm:p-6">
          <MatrixGlyph name={row.glyph} variant="solution" />
          <div className="min-w-0">
            <p className="text-21 font-medium text-ink-100">{row.solution.name}</p>
            <p className="mt-3 text-17 text-ink-400">{row.solution.body}</p>
            <p
              className={`mono mt-4 text-12 ${
                engine === 'formus' ? 'text-proof-ink' : 'text-gate'
              }`}
            >
              {row.solution.readout}
            </p>
          </div>
        </dd>
      </div>
    </Reveal>
  );
}
