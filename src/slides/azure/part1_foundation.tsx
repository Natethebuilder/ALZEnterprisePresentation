import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, ArrowRight,
  SectionDivider, MicrosoftLogo,
} from './components';
import type { Tone } from './components';
import {
  Layers, Landmark, Receipt, FolderTree, Server, Cpu, Database, Cloud, Users, Building2,
  ShieldCheck, Network, Map, Compass, Flame, BookOpen, Lock,
} from 'lucide-react';

/* ============================================================== 01 ====== */

export function S01Title() {
  return (
    <AZSlide index={1} tone="dark">
      {/* Skyline silhouette, echoing the city metaphor the deck runs on */}
      <div className="absolute bottom-[6px] left-0 right-0 flex items-end justify-center gap-1.5 opacity-[0.14] pointer-events-none">
        {[60, 90, 50, 120, 80, 150, 70, 110, 95, 140, 65, 100, 85, 130].map((h, i) => (
          <div key={i} className="rounded-t-sm bg-white" style={{ width: 64, height: h }} />
        ))}
      </div>

      <div className="absolute inset-0 px-20 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-10">
          <MicrosoftLogo className="h-9 w-9" />
          <span className="text-2xl font-semibold text-white tracking-tight">Microsoft Azure</span>
        </div>

        <h1 className="font-display text-8xl font-semibold tracking-tight leading-[1.0] max-w-6xl text-white">
          Azure Landing Zones
          <br />
          <span className="text-slide-accent-light">for the enterprise</span>
        </h1>

        <p className="mt-8 text-3xl text-white/70 font-light max-w-4xl leading-snug">
          Hierarchy, connectivity, identity and governance, explained as a city
          you already know how to read.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          {['Where things live', 'How they communicate', 'Who controls what', 'How it is governed'].map((t) => (
            <span
              key={t}
              className="px-5 py-2.5 rounded-full border-2 border-white/25 text-white/85 text-xl font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </AZSlide>
  );
}

/* ============================================================== 02 ====== */

export function S02HowToRead() {
  const designAreas = [
    { t: 'Billing and tenant', d: 'Commercial and directory alignment' },
    { t: 'Identity and access', d: 'Authentication and authorization' },
    { t: 'Resource organization', d: 'Management groups and subscriptions' },
    { t: 'Network connectivity', d: 'Topology, routing, DNS and ingress' },
    { t: 'Security', d: 'Protection, posture and response' },
    { t: 'Management', d: 'Observability, operations and recovery' },
    { t: 'Governance', d: 'Policy, cost and compliance' },
    { t: 'Automation and DevOps', d: 'Platform lifecycle through code' },
  ];

  return (
    <AZSlide index={2} kicker="The operating model">
      <Body>
        <Kicker>Start with the definition</Kicker>
        <Title>One platform foundation. Many workload landing zones.</Title>
        <Lead className="mt-4">
          An Azure landing zone is a proven, flexible architecture for governing, securing
          and scaling a multi-subscription environment. It joins technology with ownership,
          guardrails and a repeatable way to give teams an Azure environment.
        </Lead>

        <div className="mt-7 grid grid-cols-2 gap-8">
          <div className="rounded border-2 border-slide-primary bg-slide-primary p-7 text-white">
            <div className="flex items-center gap-3">
              <Landmark className="w-8 h-8 text-slide-accent-light" />
              <div className="text-3xl font-semibold">Platform landing zone</div>
            </div>
            <p className="mt-3 text-xl text-white/75 leading-snug">
              The shared foundation, normally one per Microsoft Entra tenant, run as a
              product by a central platform team.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Box tone="navy" compact label="Governance" sub="Hierarchy and policy" className="border-white/25" />
              <Box tone="navy" compact label="Shared services" sub="Only where they add value" className="border-white/25" />
              <Box tone="navy" compact label="Distribution" sub="Subscription vending" className="border-white/25" />
            </div>
          </div>

          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted p-7">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-slide-accent" />
              <div className="text-3xl font-semibold text-slide-primary">Application landing zones</div>
            </div>
            <p className="mt-3 text-xl text-slide-gray-700 leading-snug">
              The environments where workload teams build and operate. Each workload can
              span development, test and production subscriptions inside platform guardrails.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Box tone="light" compact label="Workload owned" sub="End-to-end lifecycle" />
              <Box tone="light" compact label="Policy governed" sub="A consistent minimum" />
              <Box tone="light" compact label="Fit for purpose" sub="One or more subscriptions" />
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-4 gap-3">
          {designAreas.map((area) => (
            <div key={area.t} className="rounded border-2 border-slide-gray-200 bg-white px-4 py-3">
              <div className="text-lg font-semibold text-slide-primary leading-tight">{area.t}</div>
              <div className="text-base text-slide-gray-600 leading-snug mt-0.5">{area.d}</div>
            </div>
          ))}
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 03 ====== */

const METAPHOR: { city: string; azure: string; icon: React.ReactNode; tone: Tone; group: string }[] = [
  { city: 'The city boundary', azure: 'Tenant', icon: <Landmark className="w-6 h-6" />, tone: 'navy', group: 'Where things live' },
  { city: 'Districts with their own by-laws', azure: 'Management Groups', icon: <Layers className="w-6 h-6" />, tone: 'cloud', group: 'Where things live' },
  { city: 'Fenced properties', azure: 'Subscriptions', icon: <Receipt className="w-6 h-6" />, tone: 'cloud', group: 'Where things live' },
  { city: 'Rooms inside a property', azure: 'Resource Groups', icon: <FolderTree className="w-6 h-6" />, tone: 'light', group: 'Where things live' },
  { city: 'The contents of the rooms', azure: 'Resources', icon: <Server className="w-6 h-6" />, tone: 'light', group: 'Where things live' },
  { city: 'The private road system', azure: 'VNet', icon: <Network className="w-6 h-6" />, tone: 'cloud', group: 'How they communicate' },
  { city: 'Individual streets', azure: 'Subnets', icon: <Map className="w-6 h-6" />, tone: 'light', group: 'How they communicate' },
  { city: 'A guard on one street', azure: 'NSG', icon: <ShieldCheck className="w-6 h-6" />, tone: 'success', group: 'How they communicate' },
  { city: 'The central checkpoint', azure: 'Azure Firewall', icon: <Flame className="w-6 h-6" />, tone: 'error', group: 'How they communicate' },
  { city: 'Road signs', azure: 'Routes / UDR', icon: <Compass className="w-6 h-6" />, tone: 'warning', group: 'How they communicate' },
  { city: 'The address book', azure: 'Private DNS', icon: <BookOpen className="w-6 h-6" />, tone: 'light', group: 'How they communicate' },
  { city: 'The identity office', azure: 'Microsoft Entra ID', icon: <Users className="w-6 h-6" />, tone: 'navy', group: 'Who controls what' },
  { city: 'Keys issued to a person', azure: 'RBAC', icon: <Lock className="w-6 h-6" />, tone: 'cloud', group: 'Who controls what' },
  { city: 'The by-laws themselves', azure: 'Azure Policy', icon: <Landmark className="w-6 h-6" />, tone: 'warning', group: 'Who controls what' },
];

export function S03Metaphor() {
  const [group, setGroup] = useState<string | null>(null);
  const groups = ['Where things live', 'How they communicate', 'Who controls what'];

  return (
    <AZSlide index={3} kicker="The central metaphor">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>The map for the whole deck</Kicker>
            <Title>Azure is a city.</Title>
          </div>
          <div className="flex gap-2 pb-2">
            <button
              type="button"
              onClick={() => setGroup(null)}
              className={`px-4 py-2 rounded-full border-2 text-lg font-semibold transition-colors ${
                group === null
                  ? 'bg-slide-primary border-slide-primary text-white'
                  : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
              }`}
            >
              All
            </button>
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={`px-4 py-2 rounded-full border-2 text-lg font-semibold transition-colors ${
                  group === g
                    ? 'bg-slide-primary border-slide-primary text-white'
                    : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <Lead className="mt-4">
          You already know how a city is organised. Every Azure concept in this deck maps
          onto something you can point at, and we use the same map throughout.
        </Lead>

        <div className="mt-7 grid grid-cols-2 gap-x-12 gap-y-2">
          {METAPHOR.map((m) => {
            const dim = group !== null && m.group !== group;
            return (
              <div
                key={m.azure}
                className="flex items-center gap-4 py-1 transition-opacity duration-300"
                style={{ opacity: dim ? 0.22 : 1 }}
              >
                <div className="flex items-center gap-3 w-[46%]">
                  <div className="text-slide-gray-500">{m.icon}</div>
                  <span className="text-xl text-slide-gray-600">{m.city}</span>
                </div>
                <ArrowRight className="w-auto" />
                <Chip tone={m.tone}>{m.azure}</Chip>
              </div>
            );
          })}
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 04 ====== */

export function S04SectionHierarchy() {
  return (
    <SectionDivider
      index={4}
      eyebrow="Section 1"
      title="Where things live."
      items={['Tenant', 'Management Groups', 'Subscriptions', 'Resource Groups', 'Resources']}
    />
  );
}

/* ============================================================== 05 ====== */

interface Tier {
  key: string;
  azure: string;
  city: string;
  icon: React.ReactNode;
  tone: Tone;
  what: string;
  /** Why this layer exists at all, the thing it, and only it, gives you. */
  purpose: string;
  practice: { t: string; d: string }[];
}

const TIERS: Tier[] = [
  {
    key: 'tenant',
    azure: 'Tenant',
    city: 'The city boundary',
    icon: <Landmark className="w-7 h-7" />,
    tone: 'navy',
    what: 'The Microsoft Entra directory that Azure subscriptions trust for identities and access.',
    purpose: 'It is the main identity boundary for the platform. Billing offers are associated with subscriptions, but billing and tenant structure are separate design decisions.',
    practice: [
      { t: 'Usually one platform landing zone per tenant', d: 'A second tenant adds another identity, policy and operations boundary. Use it only for a clear requirement.' },
      { t: 'Keep billing and identity concepts separate', d: 'A subscription belongs to one tenant at a time, while billing arrangements can span tenants.' },
      { t: 'Plan privileged and emergency access', d: 'Protect admin paths with MFA, Conditional Access, PIM and tested emergency accounts.' },
    ],
  },
  {
    key: 'mg',
    azure: 'Management Groups',
    city: 'Districts with by-laws',
    icon: <Layers className="w-7 h-7" />,
    tone: 'cloud',
    what: 'A tree of containers above subscriptions, where policy and access are applied once and inherited by everything beneath.',
    purpose: 'This layer lets policy and selected platform access apply consistently across many subscriptions.',
    practice: [
      { t: 'Group subscriptions that need the same policy', d: 'Platform, Landing zones, Sandbox and Decommissioned are durable patterns. Avoid mirroring a changing org chart.' },
      { t: 'Keep the hierarchy simple', d: 'Each extra level creates another place to understand inheritance and exceptions.' },
      { t: 'Use broad RBAC sparingly', d: 'Platform roles can sit here, but workload-team roles normally belong at subscription or resource-group scope.' },
    ],
  },
  {
    key: 'sub',
    azure: 'Subscriptions',
    city: 'Fenced properties',
    icon: <Receipt className="w-7 h-7" />,
    tone: 'cloud',
    what: 'A primary unit of management, cost reporting, service limits, policy and access.',
    purpose: 'It creates a practical boundary for ownership and scale. Workload teams are commonly given one or more subscriptions through vending.',
    practice: [
      { t: 'Separate where the boundary earns its keep', d: 'Environment, ownership, policy, risk and service limits determine whether a workload needs more than one subscription.' },
      { t: 'It is a scale unit, not just a folder', d: 'Many quotas and administrative boundaries are subscription scoped.' },
      { t: 'Vend a product, not an empty subscription', d: 'Place it correctly and apply the required policy, access, budgets, diagnostics and connectivity inputs.' },
    ],
  },
  {
    key: 'rg',
    azure: 'Resource Groups',
    city: 'Rooms inside a property',
    icon: <FolderTree className="w-7 h-7" />,
    tone: 'light',
    what: 'A management container for resources that usually share a lifecycle, owner or access pattern.',
    purpose: 'It gives teams a useful scope for deployment, permissions, locks, tags and lifecycle operations. Deleting it deletes its contained resources.',
    practice: [
      { t: 'Prefer shared lifecycle and ownership', d: 'A web app and its supporting resources often belong together. Avoid company-wide groups by resource type.' },
      { t: 'Treat deletion as a deliberate boundary', d: 'Locks and deployment design should protect resources that must not disappear together.' },
      { t: 'Use it as a least-privilege scope', d: 'Give a team the access it needs on its resources, not automatically on the entire subscription.' },
    ],
  },
  {
    key: 'res',
    azure: 'Resources',
    city: 'The contents of the rooms',
    icon: <Server className="w-7 h-7" />,
    tone: 'light',
    what: 'The actual workloads: compute, data, storage, networking, secrets.',
    purpose: 'This is the only layer that does any work. Every layer above it exists to make this layer safe by default.',
    practice: [
      { t: 'Inherited controls still apply', d: 'Policy and role assignments from parent scopes are evaluated here, alongside more specific assignments and exemptions.' },
      { t: 'Metadata makes operations answerable', d: 'Owner, application and cost tags support accountability when they are governed consistently.' },
      { t: 'Deploy repeatably through code', d: 'Infrastructure as Code makes review, testing, recovery and change history possible.' },
    ],
  },
];

const TIER_ICONS = [Cpu, Database, Cloud, Network, ShieldCheck, Server];

export function S05Hierarchy() {
  const [active, setActive] = useState(0);
  const tier = TIERS[active];

  return (
    <AZSlide index={5} kicker="Interactive">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>Where things live</Kicker>
            <Title>Five containers, each wrapping the next.</Title>
          </div>
          <span className="text-lg font-medium text-slide-gray-500 pb-3">
            Click a layer to open it
          </span>
        </div>

        {/* The chain, click any link */}
        <div className="mt-6 flex items-stretch gap-2">
          {TIERS.map((t, i) => (
            <React.Fragment key={t.key}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`flex-1 text-left rounded border-2 px-5 py-3.5 transition-all duration-200 ${
                  i === active
                    ? 'bg-slide-primary border-slide-primary text-white shadow-md scale-[1.02]'
                    : 'bg-white border-slide-gray-300 text-slide-gray-800 hover:border-slide-accent'
                }`}
              >
                <div className={i === active ? 'text-white' : 'text-slide-accent'}>{t.icon}</div>
                <div className="mt-2 text-xl font-semibold leading-tight">{t.azure}</div>
                <div
                  className={`text-lg leading-snug ${
                    i === active ? 'text-white/70' : 'text-slide-gray-600'
                  }`}
                >
                  {t.city}
                </div>
              </button>
              {i < TIERS.length - 1 && (
                <div className="self-center px-1 text-slide-gray-400 text-3xl font-light">›</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* The open layer */}
        <div className="mt-6 h-[370px] grid grid-cols-[1fr_1.25fr] gap-8">
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted p-6 flex flex-col">
            <Chip tone="navy" className="self-start">{tier.azure}</Chip>
            <p className="mt-4 text-2xl font-semibold text-slide-primary leading-tight">
              {tier.what}
            </p>
            <div className="mt-auto pt-4 border-t-2 border-slide-accent/40">
              <div className="text-base font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
                Why this layer exists
              </div>
              <p className="mt-2 text-lg text-slide-gray-700 leading-snug">{tier.purpose}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            {tier.practice.map((p, i) => {
              const Icon = TIER_ICONS[i % TIER_ICONS.length];
              return (
                <div
                  key={p.t}
                  className="flex items-start gap-3 rounded border-2 border-slide-gray-200 bg-white px-5 py-3"
                >
                  <div className="rounded-sm bg-slide-accent-muted p-2.5 text-slide-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slide-gray-900 leading-tight">{p.t}</div>
                    <div className="text-base text-slide-gray-600 leading-snug mt-1">{p.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-base text-slide-gray-600">
          Role and policy assignments inherit to child scopes. Lower scopes can add assignments,
          and Policy can use documented exemptions, so effective control is the combined result.
        </p>
      </Body>
    </AZSlide>
  );
}
