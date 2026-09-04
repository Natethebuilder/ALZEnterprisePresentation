import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, Legend, SectionDivider,
} from './components';
import type { Tone } from './components';
import {
  Scale, Globe, Tag, Coins, Server, ShieldCheck, Building2, Users, Layers,
  CheckCircle2, XCircle, AlertTriangle, MapPin, Lock, Wrench,
} from 'lucide-react';

/* ============================================================== 16 ====== */

export function S16SectionGovernance() {
  return (
    <SectionDivider
      index={16}
      eyebrow="Section 4"
      title="How it is governed, and by whom."
      items={['Azure Policy', 'Ownership boundaries', 'Operating model', 'Roadmap', 'Discovery']}
    />
  );
}

/* ============================================================== 17 ====== */

interface PolicyEffect {
  key: string;
  label: string;
  tone: Tone;
  icon: React.ReactNode;
  what: string;
  example: string;
  rule: string;
  when: string;
}

const EFFECTS: PolicyEffect[] = [
  {
    key: 'deny',
    label: 'Deny',
    tone: 'error',
    icon: <XCircle className="w-6 h-6" />,
    what: 'The deployment fails. The resource never exists.',
    example: 'Nothing may be created outside North Europe or West Europe.',
    rule: 'allowedLocations · [northeurope, westeurope] · effect: Deny',
    when: 'For the rules that are genuinely non-negotiable: data residency, public exposure, unencrypted storage. Start narrow: an over-broad deny is how a platform team becomes the bottleneck.',
  },
  {
    key: 'audit',
    label: 'Audit',
    tone: 'warning',
    icon: <AlertTriangle className="w-6 h-6" />,
    what: 'The resource is created, and recorded as non-compliant.',
    example: 'Flag every resource missing a CostCentre tag.',
    rule: 'requiredTag · CostCentre · effect: Audit',
    when: 'Always the first step when rolling out a new rule. Audit for a month, see how much of the estate would have broken, then decide whether to promote it to Deny.',
  },
  {
    key: 'modify',
    label: 'Modify',
    tone: 'success',
    icon: <Wrench className="w-6 h-6" />,
    what: 'The resource is corrected on the way in.',
    example: 'Inherit the resource group’s CostCentre tag onto anything created in it.',
    rule: 'modify · addOrReplace tag from parent RG',
    when: 'For anything where the right answer is knowable without asking a human. Tag inheritance is the classic case, and it fixes most tagging compliance overnight.',
  },
  {
    key: 'dine',
    label: 'DeployIfNotExists',
    tone: 'cloud',
    icon: <Server className="w-6 h-6" />,
    what: 'A missing companion resource is deployed automatically.',
    example: 'Every new VM gets diagnostic settings pointed at the central workspace.',
    rule: 'deployIfNotExists · diagnosticSettings → Log Analytics',
    when: 'For platform obligations app teams should not have to remember. It is also the effect most likely to surprise people, so document what it will do before you switch it on.',
  },
];

export function S17Policy() {
  const [active, setActive] = useState(0);
  const effect = EFFECTS[active];

  return (
    <AZSlide index={17} kicker="Interactive">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>The by-laws of the city</Kicker>
            <Title>Policy decides what may exist.</Title>
          </div>
          <span className="text-lg font-medium text-slide-gray-500 pb-3">
            Click an effect
          </span>
        </div>

        <Lead className="mt-3">
          Applied to a scope and inherited all the way down. What separates a useful
          guardrail from an obstacle is which effect you choose.
        </Lead>

        <div className="mt-5 grid grid-cols-4 gap-4">
          {EFFECTS.map((e, i) => (
            <button
              key={e.key}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded border-2 px-5 py-3.5 text-left transition-all duration-200 ${
                i === active
                  ? 'bg-slide-primary border-slide-primary text-white scale-[1.02] shadow-md'
                  : 'bg-white border-slide-gray-300 text-slide-gray-800 hover:border-slide-accent'
              }`}
            >
              <div className={i === active ? 'text-white' : 'text-slide-accent'}>{e.icon}</div>
              <div className="mt-2 text-2xl font-semibold leading-tight">{e.label}</div>
              <div
                className={`text-lg leading-snug mt-1 ${
                  i === active ? 'text-white/75' : 'text-slide-gray-600'
                }`}
              >
                {e.what}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 flex-1 grid grid-cols-[1fr_1.1fr] gap-8">
          <div className={`rounded border-2 p-7 flex flex-col ${
            effect.tone === 'error'
              ? 'border-[hsl(var(--slide-error)/0.5)] bg-[hsl(var(--slide-error)/0.05)]'
              : effect.tone === 'warning'
              ? 'border-[hsl(var(--slide-warning)/0.6)] bg-[hsl(var(--slide-warning)/0.08)]'
              : effect.tone === 'success'
              ? 'border-[hsl(var(--slide-success)/0.5)] bg-[hsl(var(--slide-success)/0.06)]'
              : 'border-slide-accent bg-slide-accent-muted'
          }`}>
            <div className="text-lg font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
              In practice
            </div>
            <p className="mt-3 text-3xl font-semibold text-slide-gray-900 leading-tight">
              {effect.example}
            </p>
            <div className="mt-5 rounded-sm bg-white border-2 border-slide-gray-200 px-5 py-3 font-mono text-lg text-slide-primary">
              {effect.rule}
            </div>
          </div>

          <div className="rounded border-2 border-slide-gray-300 bg-white p-7 flex flex-col justify-center">
            <div className="text-lg font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
              When to reach for it
            </div>
            <p className="mt-3 text-2xl text-slide-gray-800 leading-snug">{effect.when}</p>
          </div>
        </div>

        <p className="mt-4 text-lg text-slide-gray-600">
          Policy is preventive rather than corrective: the misconfiguration you never
          created is the one you never have to explain.
        </p>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 18 ====== */

export function S18Ownership() {
  const rows = [
    { area: 'Management group structure', central: 'R', app: 'I' },
    { area: 'Policies and guardrails', central: 'R', app: 'C' },
    { area: 'Hub network, firewall, DNS', central: 'R', app: 'I' },
    { area: 'Identity, PIM, baseline roles', central: 'R', app: 'C' },
    { area: 'Workload resources', central: 'C', app: 'R' },
    { area: 'RBAC inside the workload', central: 'A', app: 'R' },
    { area: 'Subscription cost', central: 'A', app: 'R' },
  ];

  const legendItems: { tone: Tone; label: string }[] = [
    { tone: 'navy', label: 'R, Responsible' },
    { tone: 'cloud', label: 'C, Consulted' },
    { tone: 'light', label: 'A, Accountable' },
    { tone: 'muted', label: 'I, Informed' },
  ];

  const cellTone = (v: string): Tone =>
    ({ R: 'navy', C: 'cloud', A: 'light', I: 'muted' }[v] as Tone);

  return (
    <AZSlide index={18} kicker="Ownership">
      <Body>
        <Kicker>Central guardrails, local freedom</Kicker>
        <Title>The platform owns the city. Teams own their buildings.</Title>

        <div className="mt-5 flex-1 grid grid-cols-[1fr_1.15fr] gap-8">
          {/* Who owns what */}
          <div className="flex flex-col gap-4">
            <div className="rounded border-2 border-slide-accent bg-slide-accent-muted/40 p-4 flex-1">
              <Chip tone="navy" className="mb-3">
                <Building2 className="w-5 h-5" /> Central platform team
              </Chip>
              <div className="flex flex-col gap-2.5">
                <Box tone="cloud" compact icon={<Layers className="w-5 h-5" />} label="The management group tree" />
                <Box tone="cloud" compact icon={<Scale className="w-5 h-5" />} label="Policy, and the exception process" />
                <Box tone="cloud" compact icon={<MapPin className="w-5 h-5" />} label="Hub network, firewall, DNS, gateways" />
                <Box tone="cloud" compact icon={<Users className="w-5 h-5" />} label="Identity, PIM, and the baseline roles" />
              </div>
            </div>

            <div className="rounded border-2 border-slide-gray-300 bg-white p-4 flex-1">
              <Chip tone="light" className="mb-3">
                <Server className="w-5 h-5" /> Application teams
              </Chip>
              <div className="flex flex-col gap-2.5">
                <Box tone="light" compact icon={<Server className="w-5 h-5" />} label="Everything inside their own subscription" />
                <Box tone="light" compact icon={<Coins className="w-5 h-5" />} label="Their budget, and the spend against it" />
                <Box tone="light" compact icon={<CheckCircle2 className="w-5 h-5" />} label="Access to their own workload" />
                <Box tone="light" compact icon={<ShieldCheck className="w-5 h-5" />} label="Running and monitoring the app" />
              </div>
            </div>
          </div>

          {/* RACI */}
          <div className="flex flex-col">
            <div className="rounded border-2 border-slide-gray-200 overflow-hidden">
              <div className="grid grid-cols-[1.7fr_1fr_1fr] bg-slide-primary text-white">
                <div className="px-6 py-3 text-lg font-semibold">Area</div>
                <div className="px-6 py-3.5 text-lg font-semibold text-center">Platform</div>
                <div className="px-6 py-3.5 text-lg font-semibold text-center">App team</div>
              </div>
              {rows.map((r, i) => (
                <div
                  key={r.area}
                  className={`grid grid-cols-[1.7fr_1fr_1fr] items-center ${
                    i % 2 ? 'bg-slide-gray-100' : 'bg-white'
                  }`}
                >
                  <div className="px-6 py-2.5 text-xl text-slide-gray-800">{r.area}</div>
                  <div className="px-6 py-2.5 text-center">
                    <Chip tone={cellTone(r.central)} className="!px-4 !py-1 !text-lg">{r.central}</Chip>
                  </div>
                  <div className="px-6 py-2.5 text-center">
                    <Chip tone={cellTone(r.app)} className="!px-4 !py-1 !text-lg">{r.app}</Chip>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Legend items={legendItems} />
            </div>

            <p className="mt-auto pt-4 text-lg text-slide-gray-600 leading-snug">
              The line is not "central does the important things". The platform owns anything
              shared between teams; teams own everything that is only theirs.
            </p>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 19 ====== */

export function S19OperatingModel() {
  const [mode, setMode] = useState<'frozen' | 'lawless' | 'target'>('target');

  const modes = {
    frozen: {
      label: 'The frozen city',
      chip: 'error' as Tone,
      icon: <Lock className="w-5 h-5" />,
      heading: 'Central controls everything',
      points: [
        'Every change needs a ticket to central IT',
        'No self-service, so teams wait weeks',
        'Shadow IT grows precisely to escape the queue',
        'Security looks excellent right up until you count what is off the books',
      ],
    },
    lawless: {
      label: 'The lawless city',
      chip: 'warning' as Tone,
      icon: <AlertTriangle className="w-5 h-5" />,
      heading: 'Teams run free with no guardrails',
      points: [
        'Every team invents its own network and its own rules',
        'No consistent security posture, and no cost control',
        'Central has no visibility, so it cannot govern anything',
        'It works fine at three teams and falls apart at thirty',
      ],
    },
    target: {
      label: 'Guardrailed autonomy',
      chip: 'success' as Tone,
      icon: <CheckCircle2 className="w-5 h-5" />,
      heading: 'A platform team runs the city; app teams build on it',
      points: [
        'The platform team owns policy, network, identity and subscription vending',
        'App teams self-serve into an environment that is already governed',
        'Guardrails are a hard floor, not a review meeting',
        'Both safety and speed go up, which is the whole argument for doing this',
      ],
    },
  };

  const m = modes[mode];

  return (
    <AZSlide index={19} kicker="Operating model">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>The real problem is rarely technical</Kicker>
            <Title>Most estates pick one of two bad extremes.</Title>
          </div>
          <div className="flex gap-2 pb-2">
            {(['frozen', 'lawless', 'target'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setMode(k)}
                className={`px-5 py-2.5 rounded-full border-2 text-lg font-semibold transition-colors ${
                  mode === k
                    ? 'bg-slide-primary border-slide-primary text-white'
                    : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
                }`}
              >
                {modes[k].label}
              </button>
            ))}
          </div>
        </div>

        {/* The spectrum */}
        <div className="mt-8 relative h-14">
          <div className="absolute inset-x-0 top-6 h-2 rounded-full bg-gradient-to-r from-[hsl(var(--slide-error))] via-[hsl(var(--slide-warning))] to-[hsl(var(--slide-success))]" />
          <div
            className="absolute top-2 w-10 h-10 rounded-full border-4 border-white bg-slide-primary shadow-lg transition-all duration-500"
            style={{ left: mode === 'frozen' ? '0%' : mode === 'lawless' ? '48%' : 'calc(100% - 40px)' }}
          />
          <span className="absolute left-0 top-[52px] text-lg text-slide-gray-600">Total control</span>
          <span className="absolute left-[46%] top-[52px] text-lg text-slide-gray-600">No control</span>
          <span className="absolute right-0 top-[52px] text-lg text-slide-gray-600">Guardrails + self-service</span>
        </div>

        <div className="mt-12 flex-1 grid grid-cols-[1.1fr_1fr] gap-8">
          <div
            className={`rounded border-2 p-7 flex flex-col transition-colors duration-300 ${
              mode === 'target'
                ? 'border-[hsl(var(--slide-success)/0.5)] bg-[hsl(var(--slide-success)/0.05)]'
                : mode === 'lawless'
                ? 'border-[hsl(var(--slide-warning)/0.6)] bg-[hsl(var(--slide-warning)/0.07)]'
                : 'border-[hsl(var(--slide-error)/0.5)] bg-[hsl(var(--slide-error)/0.05)]'
            }`}
          >
            <Chip tone={m.chip} className="self-start mb-4">
              {m.icon} {m.label}
            </Chip>
            <p className="text-3xl font-semibold text-slide-gray-900 leading-tight mb-5">
              {m.heading}
            </p>
            <div className="flex flex-col gap-3">
              {m.points.map((p) => (
                <Box key={p} tone={m.chip} compact label={p} />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <Box
              tone="navy"
              icon={<Building2 className="w-6 h-6" />}
              label="Platform team"
              sub="Builds and runs the landing zone"
            />
            <Box
              tone="cloud"
              icon={<Layers className="w-6 h-6" />}
              label="Azure Landing Zone"
              sub="Governed, connected, pre-wired environments, available on request"
            />
            <div className="grid grid-cols-2 gap-3">
              {['Payments', 'SAP', 'HR', 'Ecommerce'].map((a) => (
                <Box key={a} tone="light" compact icon={<Users className="w-5 h-5" />} label={`${a} team`} />
              ))}
            </div>
            <p className="text-xl text-slide-gray-600 leading-snug mt-1">
              The platform is a product, and the application teams are its customers. If they
              route around it, that is a product problem, not a compliance problem.
            </p>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}
