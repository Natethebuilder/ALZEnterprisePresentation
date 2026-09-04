import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, ArrowRight, MicrosoftLogo,
} from './components';
import type { Tone } from './components';
import {
  ClipboardList, Scale, CheckCircle2, AlertTriangle, Target, Sparkles, Server,
} from 'lucide-react';

/* ============================================================== 20 ====== */

const PHASES = [
  {
    n: '1',
    t: 'Discover & align',
    d: 'Agree the operating model, ownership, naming and taxonomy before anything is built.',
    icon: <ClipboardList className="w-6 h-6" />,
    out: 'A written answer to "who owns what" that both sides recognise.',
  },
  {
    n: '2',
    t: 'Platform foundation',
    d: 'Tenant, the management group tree, baseline policy, identity and PIM.',
    icon: <Scale className="w-6 h-6" />,
    out: 'A governed empty estate. Nothing runs here yet, and that is fine.',
  },
  {
    n: '3',
    t: 'Connectivity hub',
    d: 'Hub VNet, Azure Firewall, private DNS, the gateway, and the first spoke.',
    icon: <Server className="w-6 h-6" />,
    out: 'One real workload reaching production through the hub.',
  },
  {
    n: '4',
    t: 'Landing zones',
    d: 'Subscription vending: pre-wired, pre-governed environments per domain.',
    icon: <CheckCircle2 className="w-6 h-6" />,
    out: 'A team gets an environment without a ticket, and without a meeting.',
  },
  {
    n: '5',
    t: 'Operate & iterate',
    d: 'Self-service through IaC, cost and security baselines, policy as an ongoing product.',
    icon: <Sparkles className="w-6 h-6" />,
    out: 'Compliance drift is visible, and shrinking, without anyone auditing by hand.',
  },
];

const MATURITY = [
  { n: '0', t: 'Ad hoc', d: 'Each team fends for itself. No shared network, no shared rules.', tone: 'error' as Tone },
  { n: '1', t: 'Foundational', d: 'First policies, one hub, basic identity, still largely manual.', tone: 'warning' as Tone },
  { n: '2', t: 'Standardised', d: 'Repeatable landing zones, policy sets, an RBAC baseline.', tone: 'cloud' as Tone },
  { n: '3', t: 'Automated', d: 'Self-service provisioning through governed IaC pipelines.', tone: 'cloud' as Tone },
  { n: '4', t: 'Optimised', d: 'Continuous governance; cost and security managed as code.', tone: 'success' as Tone },
];

function toneBg(t: Tone) {
  return {
    error: 'bg-[hsl(var(--slide-error)/0.07)] border-[hsl(var(--slide-error)/0.45)]',
    warning: 'bg-[hsl(var(--slide-warning)/0.09)] border-[hsl(var(--slide-warning)/0.5)]',
    cloud: 'bg-slide-accent-muted border-slide-accent',
    success: 'bg-[hsl(var(--slide-success)/0.08)] border-[hsl(var(--slide-success)/0.45)]',
    navy: 'bg-slide-primary border-slide-primary',
    light: 'bg-white border-slide-gray-300',
    muted: 'bg-slide-gray-100 border-slide-gray-200',
  }[t];
}

export function S20Roadmap() {
  const [view, setView] = useState<'phases' | 'maturity'>('phases');
  const [phase, setPhase] = useState(0);

  return (
    <AZSlide index={20} kicker="Interactive">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>From here to a governed platform</Kicker>
            <Title>A phased path, and a way to say where you are.</Title>
          </div>
          <div className="flex gap-2 pb-2">
            {[
              { k: 'phases' as const, l: 'Delivery phases' },
              { k: 'maturity' as const, l: 'Maturity today' },
            ].map((o) => (
              <button
                key={o.k}
                type="button"
                onClick={() => setView(o.k)}
                className={`px-5 py-2.5 rounded-full border-2 text-lg font-semibold transition-colors ${
                  view === o.k
                    ? 'bg-slide-primary border-slide-primary text-white'
                    : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {view === 'phases' ? (
          <div className="mt-8 flex-1 flex flex-col">
            <div className="grid grid-cols-5 gap-3">
              {PHASES.map((p, i) => (
                <button
                  key={p.n}
                  type="button"
                  onClick={() => setPhase(i)}
                  className={`rounded border-2 p-5 flex flex-col gap-2.5 text-left h-full transition-all duration-200 ${
                    i === phase
                      ? 'bg-slide-primary border-slide-primary text-white shadow-md'
                      : 'bg-white border-slide-gray-300 hover:border-slide-accent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-sm grid place-items-center font-bold ${
                        i === phase ? 'bg-white text-slide-primary' : 'bg-slide-primary text-white'
                      }`}
                    >
                      {p.n}
                    </div>
                    <div className={i === phase ? 'text-white' : 'text-slide-accent'}>{p.icon}</div>
                  </div>
                  <div className="text-xl font-semibold leading-tight">{p.t}</div>
                  <div
                    className={`text-lg leading-snug ${
                      i === phase ? 'text-white/75' : 'text-slide-gray-600'
                    }`}
                  >
                    {p.d}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-7 rounded border-2 border-slide-accent bg-slide-accent-muted p-7">
              <div className="text-lg font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
                Phase {PHASES[phase].n} is done when
              </div>
              <p className="mt-2 text-3xl font-semibold text-slide-primary leading-tight">
                {PHASES[phase].out}
              </p>
            </div>

            <p className="mt-auto pt-6 text-xl text-slide-gray-600">
              Foundation before connectivity; connectivity before landing zones; landing zones
              before scale. Each phase is independently useful, which is what keeps funding alive.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-5 gap-4">
              {MATURITY.map((l) => (
                <div key={l.n} className="flex flex-col">
                  <div className="rounded-t-sm bg-slide-primary text-white text-center py-3">
                    <div className="text-lg font-semibold uppercase tracking-[0.12em]">
                      Level {l.n}
                    </div>
                  </div>
                  <div className={`rounded-b-sm border-2 border-t-0 p-5 flex flex-col gap-2 h-full ${toneBg(l.tone)}`}>
                    <div className="text-2xl font-semibold">{l.t}</div>
                    <div className="text-lg text-slide-gray-600 leading-snug">{l.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="rounded border-2 border-[hsl(var(--slide-success)/0.5)] p-6">
                <Chip tone="success" className="mb-3">
                  <CheckCircle2 className="w-5 h-5" /> Worth it because
                </Chip>
                <ul className="text-xl text-slide-gray-700 leading-snug space-y-2">
                  <li>Environments are consistent and governed</li>
                  <li>Security is a default, not a request</li>
                  <li>App teams move faster, not slower</li>
                  <li>Cost and drift are finally visible</li>
                </ul>
              </div>
              <div className="rounded border-2 border-[hsl(var(--slide-warning)/0.55)] p-6">
                <Chip tone="warning" className="mb-3">
                  <AlertTriangle className="w-5 h-5" /> Costs you
                </Chip>
                <ul className="text-xl text-slide-gray-700 leading-snug space-y-2">
                  <li>Real platform investment before any payback</li>
                  <li>A central team that can become a bottleneck</li>
                  <li>Policy sprawl, if nobody curates it</li>
                  <li>A cultural shift towards trust plus guardrails</li>
                </ul>
              </div>
              <div className="rounded border-2 border-[hsl(var(--slide-error)/0.45)] p-6">
                <Chip tone="error" className="mb-3">
                  <Target className="w-5 h-5" /> Watch for
                </Chip>
                <ul className="text-xl text-slide-gray-700 leading-snug space-y-2">
                  <li>Over-governance quietly killing adoption</li>
                  <li>Under-governance quietly creating shadow IT</li>
                  <li>A management group tree that is hard to undo</li>
                  <li>Peering cost growing faster than expected</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 21 ====== */

export function S21Discovery() {
  const questions = [
    { q: 'Who owns governance versus day-2 operations today, and where does the hand-off break?', r: 'Exposes whether an operating model exists at all.' },
    { q: 'How does a new workload get network, identity and budget today? How long does that take?', r: 'The number is usually the strongest argument for the whole programme.' },
    { q: 'Which regulations constrain where data and resources may live?', r: 'Decides region policy, and often the management group shape.' },
    { q: 'Can one team’s mistake affect another team today?', r: 'Tells you how urgently subscriptions need to become real boundaries.' },
    { q: 'Where is egress inspected and logged, and who actually reads it?', r: 'Separates a firewall that exists from a firewall that is doing something.' },
    { q: 'How do applications authenticate to data services? Are there secrets stored anywhere?', r: 'Managed identity adoption is usually the fastest visible win.' },
    { q: 'Can you attribute cloud spend to a cost centre right now?', r: 'If not, tagging policy pays for itself before anything else does.' },
  ];

  return (
    <AZSlide index={21} kicker="Discovery">
      <Body>
        <Kicker>Questions before architecture</Kicker>
        <Title>The right design depends entirely on the answers.</Title>
        <Lead className="mt-4">
          These seven expose ownership gaps, manual bottlenecks and real risk appetite.
        </Lead>

        <div className="mt-5 flex-1 grid grid-cols-2 gap-x-8 gap-y-2.5 content-center">
          {questions.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 rounded border-2 border-slide-gray-200 bg-white px-5 py-3"
            >
              <span className="shrink-0 w-8 h-8 rounded-sm bg-slide-accent text-white font-bold flex items-center justify-center text-lg">
                {i + 1}
              </span>
              <div>
                <div className="text-xl text-slide-gray-900 leading-snug">{item.q}</div>
                <div className="text-lg text-slide-gray-600 leading-snug mt-1 italic">
                  {item.r}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 22 ====== */

export function S22FiveThings() {
  const items = [
    {
      t: 'A landing zone is an operating model, not a diagram',
      d: 'It is how ownership, guardrails and self-service actually work. The architecture is downstream of that.',
    },
    {
      t: 'Management groups govern; subscriptions bound',
      d: 'Rules live on the tree above. Cost, limits and blast radius stop at the subscription fence.',
    },
    {
      t: 'RBAC is who; Policy is what',
      d: 'RBAC permits an identity to act. Policy decides what may exist, and it stops an Owner too.',
    },
    {
      t: 'Troubleshoot in a fixed order',
      d: 'DNS → route → security (NSG, then firewall) → destination → return path → identity. Almost every incident is one of those six.',
    },
    {
      t: 'Central guardrails, local autonomy',
      d: 'A hard floor plus real self-service. If teams route around the platform, the platform is the thing that needs fixing.',
    },
  ];

  return (
    <AZSlide index={22} kicker="Takeaways">
      <Body>
        <Kicker>If you remember nothing else</Kicker>
        <Title>Five things that survive any particular project.</Title>

        <div className="mt-6 flex-1 flex flex-col justify-center gap-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-start gap-5 rounded border-2 border-slide-gray-200 bg-white px-7 py-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-sm bg-slide-accent text-white text-2xl font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <div className="text-2xl font-semibold text-slide-primary leading-tight">{it.t}</div>
                <div className="text-xl text-slide-gray-600 leading-snug mt-1.5">{it.d}</div>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 23 ====== */

export function S23Closing() {
  return (
    <AZSlide index={23} tone="dark">
      <div className="absolute inset-0 px-20 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-9">
          <MicrosoftLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-[0.18em] uppercase text-slide-accent-light">
            Closing
          </span>
        </div>

        <h1 className="font-display text-7xl font-semibold tracking-tight leading-[1.02] max-w-5xl text-white">
          A landing zone that works is one nobody has to think about.
        </h1>

        <p className="mt-8 text-2xl text-white/70 font-light max-w-4xl leading-snug">
          Application teams should not need to hold every firewall rule, policy, route and
          DNS zone in their heads. They should be able to ask for a secure production
          environment, and get one.
        </p>

        <div className="mt-12 flex items-center gap-5">
          <div className="rounded border-2 border-white/30 px-6 py-4 text-white">
            <div className="text-xl font-semibold">Application team asks</div>
          </div>
          <ArrowRight />
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted px-6 py-4 text-slide-primary">
            <div className="text-xl font-semibold">The platform answers</div>
          </div>
          <ArrowRight />
          <div className="rounded border-2 border-white/30 px-6 py-4 text-white">
            <div className="text-xl font-semibold">Governed environment, same day</div>
          </div>
        </div>

        <p className="mt-12 text-2xl text-white/55 font-light italic max-w-5xl leading-snug">
          The goal was never to make every developer an expert in the platform. It was to
          make the platform expert on their behalf.
        </p>
      </div>
    </AZSlide>
  );
}
