import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, SectionDivider,
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
    when: 'For validated, non-negotiable controls such as approved regions or prohibited public access. Roll out safely, because a broad deny can block legitimate delivery.',
  },
  {
    key: 'audit',
    label: 'Audit',
    tone: 'warning',
    icon: <AlertTriangle className="w-6 h-6" />,
    what: 'The resource is created, and recorded as non-compliant.',
    example: 'Flag every resource missing a CostCentre tag.',
    rule: 'requiredTag · CostCentre · effect: Audit',
    when: 'A common first step for a new rule. Measure impact, resolve false positives and agree exceptions before increasing enforcement.',
  },
  {
    key: 'modify',
    label: 'Modify',
    tone: 'success',
    icon: <Wrench className="w-6 h-6" />,
    what: 'The resource is corrected on the way in.',
    example: 'Inherit the resource group’s CostCentre tag onto anything created in it.',
    rule: 'modify · addOrReplace tag from parent RG',
    when: 'For supported properties or tags where the correct value is deterministic. Existing resources need a remediation task.',
  },
  {
    key: 'dine',
    label: 'DeployIfNotExists',
    tone: 'cloud',
    icon: <Server className="w-6 h-6" />,
    what: 'A related resource can be deployed when the condition is not met.',
    example: 'Every new VM gets diagnostic settings pointed at the central workspace.',
    rule: 'deployIfNotExists · diagnosticSettings → Log Analytics',
    when: 'For repeatable platform obligations such as diagnostics. The assignment needs a managed identity and existing resources need remediation.',
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
          Policy can prevent, audit, modify or deploy. Deny is immediate; Modify and
          DeployIfNotExists can also correct existing resources through remediation tasks.
        </p>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 18 ====== */

export function S18Ownership() {
  const rows = [
    { area: 'Management groups and policy', central: 'Own', app: 'Consult', centralTone: 'navy', appTone: 'cloud' },
    { area: 'Shared connectivity and DNS', central: 'Own', app: 'Consume', centralTone: 'navy', appTone: 'muted' },
    { area: 'Subscription product and vending', central: 'Own', app: 'Request', centralTone: 'navy', appTone: 'light' },
    { area: 'Workload resources and data', central: 'Guardrail', app: 'Own', centralTone: 'cloud', appTone: 'navy' },
    { area: 'Workload access', central: 'Baseline', app: 'Own', centralTone: 'cloud', appTone: 'navy' },
    { area: 'Workload cost and operations', central: 'Enable', app: 'Own', centralTone: 'light', appTone: 'navy' },
    { area: 'Incident response', central: 'Shared', app: 'Shared', centralTone: 'warning', appTone: 'warning' },
  ];

  return (
    <AZSlide index={18} kicker="Ownership">
      <Body>
        <Kicker>Central guardrails, local freedom</Kicker>
        <Title>A clear service contract makes autonomy safe.</Title>

        <div className="mt-5 flex-1 grid grid-cols-[1fr_1.15fr] gap-8">
          {/* Who owns what */}
          <div className="flex flex-col gap-4">
            <div className="rounded border-2 border-slide-accent bg-slide-accent-muted/40 p-4 flex-1">
              <Chip tone="navy" className="mb-3">
                <Building2 className="w-5 h-5" /> Central platform team
              </Chip>
              <div className="flex flex-col gap-2.5">
                <Box tone="cloud" compact icon={<Layers className="w-5 h-5" />} label="The management group tree" />
                <Box tone="cloud" compact icon={<Scale className="w-5 h-5" />} label="Policy and the exception lifecycle" />
                <Box tone="cloud" compact icon={<MapPin className="w-5 h-5" />} label="Shared network, DNS and gateways" />
                <Box tone="cloud" compact icon={<Users className="w-5 h-5" />} label="Identity standards and platform roles" />
              </div>
            </div>

            <div className="rounded border-2 border-slide-gray-300 bg-white p-4 flex-1">
              <Chip tone="light" className="mb-3">
                <Server className="w-5 h-5" /> Application teams
              </Chip>
              <div className="flex flex-col gap-2.5">
                <Box tone="light" compact icon={<Server className="w-5 h-5" />} label="End-to-end workload lifecycle" />
                <Box tone="light" compact icon={<Coins className="w-5 h-5" />} label="Workload budget and cost decisions" />
                <Box tone="light" compact icon={<CheckCircle2 className="w-5 h-5" />} label="Workload access and data ownership" />
                <Box tone="light" compact icon={<ShieldCheck className="w-5 h-5" />} label="Application security, monitoring and recovery" />
              </div>
            </div>
          </div>

          {/* Decision-rights contract */}
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
                    <Chip tone={r.centralTone as Tone} className="!px-4 !py-1 !text-lg">{r.central}</Chip>
                  </div>
                  <div className="px-6 py-2.5 text-center">
                    <Chip tone={r.appTone as Tone} className="!px-4 !py-1 !text-lg">{r.app}</Chip>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-lg text-slide-gray-600 leading-snug">
              This is a starting contract, not a universal RACI. Name one accountable owner,
              the supported interface and the escalation path for every shared capability.
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
        'Central visibility is fragmented, so governance becomes reactive',
        'It works fine at three teams and falls apart at thirty',
      ],
    },
    target: {
      label: 'Guardrailed autonomy',
      chip: 'success' as Tone,
      icon: <CheckCircle2 className="w-5 h-5" />,
      heading: 'A platform team runs the city; app teams build on it',
      points: [
        'The platform team owns guardrails, shared services and subscription vending',
        'App teams self-serve into an environment that is already governed',
        'Guardrails are a hard floor, not a review meeting',
        'The goal is safe autonomy without a manual gate for routine delivery',
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
        <div className="mt-6">
          <div className="flex items-center justify-between text-base text-slide-gray-600">
            <span>Total control</span>
            <span>No control</span>
            <span>Guardrails + self-service</span>
          </div>
          <div className="relative h-8 mt-1">
          <div className="absolute inset-x-0 top-3 h-2 rounded-full bg-gradient-to-r from-[hsl(var(--slide-error))] via-[hsl(var(--slide-warning))] to-[hsl(var(--slide-success))]" />
          <div
            className="absolute top-0 w-8 h-8 rounded-full border-4 border-white bg-slide-primary shadow-lg transition-all duration-500"
            style={{ left: mode === 'frozen' ? '0%' : mode === 'lawless' ? '48%' : 'calc(100% - 32px)' }}
          />
          </div>
        </div>

        <div className="mt-4 flex-1 grid grid-cols-[1.1fr_1fr] gap-8">
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
            <Box
              tone="light"
              icon={<Users className="w-6 h-6" />}
              label="Enabling teams"
              sub="Close specialist skill gaps without taking workload ownership"
            />
            <div className="grid grid-cols-2 gap-3">
              {['Payments', 'SAP', 'HR', 'Ecommerce'].map((a) => (
                <Box key={a} tone="light" compact icon={<Users className="w-5 h-5" />} label={`${a} team`} />
              ))}
            </div>
            <p className="text-xl text-slide-gray-600 leading-snug mt-1">
              Treat the platform as a product and workload teams as customers. Workarounds
              are a signal to investigate usability, lead time or a missing product line.
            </p>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}
