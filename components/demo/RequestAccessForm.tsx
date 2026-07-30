'use client';

import { useId, useState } from 'react';
import { demo } from '@/content/copy/demo';

type Status = 'idle' | 'sending' | 'sent' | 'copied' | 'failed';

interface RequestValues {
  name: string;
  email: string;
  organisation: string;
  sector: string;
  workflow: string;
}

const EMPTY: RequestValues = {
  name: '',
  email: '',
  organisation: '',
  sector: demo.form.sectors[0],
  workflow: '',
};

export function RequestAccessForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const ids = {
    name: useId(),
    email: useId(),
    organisation: useId(),
    sector: useId(),
    workflow: useId(),
  };

  const composed = [
    `name: ${values.name}`,
    `email: ${values.email}`,
    `organisation: ${values.organisation}`,
    `sector: ${values.sector}`,
    '',
    'workflow:',
    values.workflow,
  ].join('\n');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');

    const { formEndpoint, contactEmail } = demo.delivery;

    if (formEndpoint) {
      try {
        const response = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(values),
        });
        setStatus(response.ok ? 'sent' : 'failed');
      } catch {
        setStatus('failed');
      }
      return;
    }

    if (contactEmail) {
      const subject = encodeURIComponent(`Scoping call: ${values.organisation || 'request'}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${encodeURIComponent(composed)}`;
      setStatus('sent');
      return;
    }

    try {
      await navigator.clipboard.writeText(composed);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  const message =
    status === 'sent'
      ? demo.form.sent
      : status === 'copied'
        ? demo.form.copied
        : status === 'failed'
          ? demo.form.failed
          : '';

  return (
    <form onSubmit={submit} className="border border-hairline bg-slate-900 p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Text
          id={ids.name}
          label={demo.form.fields.name}
          value={values.name}
          onChange={(name) => setValues((v) => ({ ...v, name }))}
          autoComplete="name"
          required
        />
        <Text
          id={ids.email}
          label={demo.form.fields.email}
          type="email"
          value={values.email}
          onChange={(email) => setValues((v) => ({ ...v, email }))}
          autoComplete="email"
          required
        />
        <Text
          id={ids.organisation}
          label={demo.form.fields.organisation}
          value={values.organisation}
          onChange={(organisation) => setValues((v) => ({ ...v, organisation }))}
          autoComplete="organization"
          required
        />

        <div>
          <label htmlFor={ids.sector} className="eyebrow mb-2 block">
            {demo.form.fields.sector}
          </label>
          <select
            id={ids.sector}
            value={values.sector}
            onChange={(event) => setValues((v) => ({ ...v, sector: event.target.value }))}
            className="mono w-full border border-hairline bg-slate-800 px-3 py-2.5 text-14 text-ink-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-proof"
          >
            {demo.form.sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor={ids.workflow} className="eyebrow mb-2 block">
          {demo.form.fields.workflow}
        </label>
        <p className="mb-2 text-14 text-ink-500">{demo.form.fields.workflowHint}</p>
        <textarea
          id={ids.workflow}
          rows={6}
          required
          value={values.workflow}
          onChange={(event) => setValues((v) => ({ ...v, workflow: event.target.value }))}
          className="w-full border border-hairline bg-slate-800 px-3 py-2.5 text-17 text-ink-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-proof"
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="mono border border-proof/50 bg-proof/10 px-4 py-2.5 text-14 text-proof-ink transition-colors duration-[120ms] hover:border-proof hover:bg-proof/15 disabled:opacity-50"
        >
          {status === 'sending' ? demo.form.sending : demo.form.submit}
        </button>

        <p
          className={`mono text-14 ${status === 'failed' ? 'text-hold' : 'text-proof-ink'}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>

      {status === 'failed' || status === 'copied' ? (
        <pre className="mono mt-6 overflow-x-auto border border-hairline bg-void px-4 py-4 text-12 text-ink-400">
          {composed}
        </pre>
      ) : null}
    </form>
  );
}

function Text({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-hairline bg-slate-800 px-3 py-2.5 text-17 text-ink-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-proof"
      />
    </div>
  );
}
