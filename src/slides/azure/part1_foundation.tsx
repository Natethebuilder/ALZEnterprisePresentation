import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, ArrowRight,
  SectionDivider, MicrosoftLogo,
} from './components';
import type { Tone } from './components';
import {
  Layers, Landmark, Receipt, FolderTree, Server, Cpu, Database, Cloud, Users,
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
  const audiences = [
    { icon: <Compass className="w-7 h-7" />, who: 'Decision makers', why: 'The operating model, and where the value actually lands.' },
    { icon: <Network className="w-7 h-7" />, who: 'Architects & engineers', why: 'The technical foundations, and the trade-offs behind them.' },
    { icon: <ShieldCheck className="w-7 h-7" />, who: 'Security & governance', why: 'Where each boundary is enforced, and who owns it.' },
    { icon: <Users className="w-7 h-7" />, who: 'Platform & app teams', why: 'Who does what, and exactly where self-service begins.' },
  ];

  return (
    <AZSlide index={2} kicker="How to read this deck">
      <Body>
        <Kicker>One story, two depths</Kicker>
        <Title>Every idea arrives twice.</Title>
        <Lead className="mt-5">
          Each concept is introduced as part of the city, then named in Azure terms
          underneath. A non-technical stakeholder can follow the whole arc; an architect
          still gets the mechanism.
        </Lead>

        <div className="mt-10 grid grid-cols-4 gap-6">
          {audiences.map((a) => (
            <Box key={a.who} tone="light" icon={a.icon} label={a.who} sub={a.why} className="h-full" />
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Chip tone="cloud">The city</Chip>
          <ArrowRight />
          <Chip tone="navy">The Azure service</Chip>
          <ArrowRight />
          <Chip tone="success">Who owns it, and what breaks without it</Chip>
        </div>

        <p className="mt-8 text-xl text-slide-gray-600">
          Four slides are interactive: the hierarchy, the city walkthrough, and both
          governance builds. Look for the step controls and click through them.
        </p>
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
    what: 'Your organisation in Azure: the outermost boundary, and the root of identity and billing.',
    purpose: 'It is the identity boundary. Everything that can authenticate, and everything that can be paid for, lives inside exactly one of these.',
    practice: [
      { t: 'One tenant, almost always', d: 'A second tenant means a second identity estate to run. Reach for it only for a genuine legal or acquisition boundary.' },
      { t: 'Holds identities and the billing root', d: 'Users, groups, service principals, and the agreement everything is charged against.' },
      { t: 'Backed by Microsoft Entra ID', d: 'yourorg.onmicrosoft.com, the directory every access decision is checked against.' },
    ],
  },
  {
    key: 'mg',
    azure: 'Management Groups',
    city: 'Districts with by-laws',
    icon: <Layers className="w-7 h-7" />,
    tone: 'cloud',
    what: 'A tree of containers above subscriptions, where policy and access are applied once and inherited by everything beneath.',
    purpose: 'This is the only layer that lets you govern at scale. A rule set here reaches every subscription below it without per-subscription work.',
    practice: [
      { t: 'Shape it around governance, not the org chart', d: 'Platform / Landing zones / Sandbox / Decommissioned survives a reorg. A tree named after departments does not.' },
      { t: 'Keep it shallow, three or four levels', d: 'Every extra level is another place a permission can hide.' },
      { t: 'Changing it later is expensive', d: 'Moving subscriptions between groups silently changes what applies to them. Get this one roughly right up front.' },
    ],
  },
  {
    key: 'sub',
    azure: 'Subscriptions',
    city: 'Fenced properties',
    icon: <Receipt className="w-7 h-7" />,
    tone: 'cloud',
    what: 'The unit of billing, quota and blast radius, and the thing app teams are actually given.',
    purpose: 'It is the boundary that bounds. Cost, service limits and the damage one mistake can do all stop at its fence.',
    practice: [
      { t: 'One per environment × domain', d: 'payments-prod, payments-dev, hr-prod. Each is separately budgeted, separately limited, separately broken.' },
      { t: 'It is a scale unit, not a folder', d: 'When a workload approaches a service limit, the answer is another subscription, not a bigger one.' },
      { t: 'Hand them out by vending, not by ticket', d: 'A new subscription should arrive pre-placed in the right group, pre-peered and pre-governed.' },
    ],
  },
  {
    key: 'rg',
    azure: 'Resource Groups',
    city: 'Rooms inside a property',
    icon: <FolderTree className="w-7 h-7" />,
    tone: 'light',
    what: 'A container for resources that share a lifecycle: deployed together, and deleted together.',
    purpose: 'It is the unit of deployment and deletion. Getting it wrong is what makes an environment impossible to tear down cleanly.',
    practice: [
      { t: 'Group by lifecycle, never by type', d: 'A web app with its plan and its storage. Not "all the databases in the company".' },
      { t: 'Deleting the group deletes the contents', d: 'Which is a feature, if, and only if, the contents really did belong together.' },
      { t: 'It is also a natural RBAC scope', d: 'Give a team contributor on their room rather than on the whole property.' },
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
      { t: 'Every law above still applies', d: 'A resource obeys the policy on its group, its subscription and every management group above it. That is the whole point of the tree.' },
      { t: 'Tags are how cost becomes answerable', d: 'CostCentre and Owner, enforced by policy, are what turn a bill into a conversation.' },
      { t: 'Nothing here should be clicked into existence', d: 'If it was not deployed from code, nobody can recreate it.' },
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
        <div className="mt-6 h-[412px] grid grid-cols-[1fr_1.25fr] gap-8">
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted p-7 flex flex-col">
            <Chip tone="navy" className="self-start">{tier.azure}</Chip>
            <p className="mt-5 text-3xl font-semibold text-slide-primary leading-tight">
              {tier.what}
            </p>
            <div className="mt-auto pt-6 border-t-2 border-slide-accent/40">
              <div className="text-lg font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
                Why this layer exists
              </div>
              <p className="mt-2 text-xl text-slide-gray-700 leading-snug">{tier.purpose}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            {tier.practice.map((p, i) => {
              const Icon = TIER_ICONS[i % TIER_ICONS.length];
              return (
                <div
                  key={p.t}
                  className="flex items-start gap-4 rounded border-2 border-slide-gray-200 bg-white px-6 py-4"
                >
                  <div className="rounded-sm bg-slide-accent-muted p-2.5 text-slide-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-slide-gray-900 leading-tight">{p.t}</div>
                    <div className="text-lg text-slide-gray-600 leading-snug mt-1">{p.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-24 text-lg text-slide-gray-600">
          Access and policy flow <span className="font-semibold text-slide-primary">downwards only</span>.
          That single rule is what makes the tree worth having.
        </p>
      </Body>
    </AZSlide>
  );
}
