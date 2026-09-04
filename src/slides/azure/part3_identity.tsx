import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, ArrowRight, ArrowDown, SectionDivider,
} from './components';
import {
  Fingerprint, Users, KeyRound, ShieldCheck, Lock, Server, UserCheck,
  Building2, Scale, BookOpen, CheckCircle2, XCircle, Clock, Layers, FolderTree,
} from 'lucide-react';

/* ============================================================== 12 ====== */

export function S12SectionIdentity() {
  return (
    <SectionDivider
      index={12}
      eyebrow="Section 3"
      title="Who controls what."
      items={['Microsoft Entra ID', 'Managed identities', 'RBAC and scope', 'RBAC vs Policy']}
    />
  );
}

/* ============================================================== 13 ====== */

export function S13EntraAndIdentities() {
  return (
    <AZSlide index={13} kicker="Entra ID & managed identities">
      <Body>
        <Kicker>The identity office</Kicker>
        <Title>People get accounts. So do applications.</Title>
        <Lead className="mt-4">
          Nothing acts in Azure without an identity. Entra ID issues them and proves them,
          for humans and for workloads alike.
        </Lead>

        <div className="mt-4 grid grid-cols-2 gap-8 flex-1">
          {/* People */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-slide-accent" />
              <span className="text-2xl font-semibold">People</span>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Box
                compact
                tone="navy"
                icon={<Fingerprint className="w-6 h-6" />}
                label="Identity, not permission"
                sub="Entra proves who someone is. What they may do is a separate decision: that is RBAC."
              />
              <Box
                compact
                tone="cloud"
                icon={<Users className="w-6 h-6" />}
                label="Grant to groups, never to people"
                sub="A named individual on a role assignment is a permission nobody finds again."
              />
              <Box
                compact
                tone="light"
                icon={<UserCheck className="w-6 h-6" />}
                label="Conditional access"
                sub="Require MFA, refuse risky sign-ins, gate by device."
              />
              <Box
                compact
                tone="light"
                icon={<Clock className="w-6 h-6" />}
                label="PIM: elevate, then expire"
                sub="Standing admin access is what an attacker looks for. Make it a request."
              />
            </div>
          </div>

          {/* Workloads */}
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted/40 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <Server className="w-8 h-8 text-slide-primary" />
              <span className="text-2xl font-semibold">Applications</span>
            </div>

            <p className="text-lg text-slide-gray-700 leading-snug mb-4">
              An app needs to open doors too. A managed identity is an account the platform
              issues to the workload itself, with no password to store, leak or rotate.
            </p>

            <div className="flex flex-col items-center gap-2">
              <Box compact tone="navy" icon={<Server className="w-6 h-6" />} label="Workload" sub="VM, App Service, Function, container" className="w-full" />
              <ArrowDown />
              <Box compact tone="light" icon={<Lock className="w-6 h-6" />} label="Key Vault / SQL / Storage" sub="Trusts Entra. No shared secret exists." className="w-full" />
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-2.5">
              <Box tone="success" compact icon={<CheckCircle2 className="w-5 h-5" />} label="No secret in code, config or pipeline variables" />
              <Box tone="error" compact icon={<XCircle className="w-5 h-5" />} label="Replaces connection strings that carry a password" />
            </div>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 14 ====== */

const SCOPES = [
  {
    key: 'mg',
    label: 'Management Group',
    detail: 'Platform',
    icon: <Layers className="w-6 h-6" />,
    reaches: ['sub', 'rg', 'res'],
    note: 'Reaches every subscription, group and resource beneath it for as long as the assignment exists. This is the right scope for a read-only audit role, and almost never the right scope for Contributor.',
  },
  {
    key: 'sub',
    label: 'Subscription',
    detail: 'Connectivity',
    icon: <Building2 className="w-6 h-6" />,
    reaches: ['rg', 'res'],
    note: 'The usual home for a platform team’s working access: broad enough to operate the environment, bounded by the property fence.',
  },
  {
    key: 'rg',
    label: 'Resource Group',
    detail: 'hub-firewall',
    icon: <FolderTree className="w-6 h-6" />,
    reaches: ['res'],
    note: 'Where an application team should normally live. They can build everything in their own room and nothing outside it.',
  },
  {
    key: 'res',
    label: 'Resource',
    detail: 'Azure Firewall',
    icon: <ShieldCheck className="w-6 h-6" />,
    reaches: [],
    note: 'The narrowest grant there is: one object, one role. Use it for the exceptions, and write down why.',
  },
];

export function S14RBAC() {
  const [scope, setScope] = useState(0);
  const active = SCOPES[scope];

  return (
    <AZSlide index={14} kicker="Interactive">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>Who can do what, and where</Kicker>
            <Title>RBAC is three things joined together.</Title>
          </div>
          <span className="text-lg font-medium text-slide-gray-500 pb-3">
            Click a scope to see how far it reaches
          </span>
        </div>

        {/* The assignment */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Box tone="cloud" icon={<Users className="w-6 h-6" />} label="WHO" sub="A group, never a person" />
          <ArrowRight />
          <Box tone="cloud" icon={<KeyRound className="w-6 h-6" />} label="WHICH ROLE" sub="A named set of actions" />
          <ArrowRight />
          <Box tone="cloud" icon={<Building2 className="w-6 h-6" />} label="AT WHAT SCOPE" sub="And everything below it" />
          <ArrowRight />
          <Box tone="navy" icon={<ShieldCheck className="w-6 h-6" />} label="ROLE ASSIGNMENT" sub="Exactly those actions, exactly there" />
        </div>

        {/* Scope ladder */}
        <div className="mt-7 flex-1 grid grid-cols-[1fr_1fr] gap-8">
          <div className="flex flex-col items-stretch gap-2 justify-center">
            {SCOPES.map((s, i) => {
              const isActive = i === scope;
              const inherits = active.reaches.includes(s.key);
              return (
                <React.Fragment key={s.key}>
                  <button
                    type="button"
                    onClick={() => setScope(i)}
                    style={{ marginLeft: i * 28 }}
                    className={`flex items-center gap-3 rounded border-2 px-5 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-slide-primary border-slide-primary text-white'
                        : inherits
                        ? 'bg-[hsl(var(--slide-success)/0.10)] border-[hsl(var(--slide-success)/0.5)] text-slide-gray-900'
                        : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slide-accent'}>{s.icon}</span>
                    <span className="flex-1">
                      <span className="block text-xl font-semibold leading-tight">{s.label}</span>
                      <span
                        className={`block text-lg leading-tight ${
                          isActive ? 'text-white/70' : 'text-slide-gray-600'
                        }`}
                      >
                        {s.detail}
                      </span>
                    </span>
                    {isActive && <Chip tone="cloud" className="!py-1 !text-base">assigned here</Chip>}
                    {inherits && <Chip tone="success" className="!py-1 !text-base">inherited</Chip>}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex flex-col justify-center gap-5">
            <div className="rounded border-2 border-slide-accent bg-slide-accent-muted p-6">
              <div className="text-lg font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
                Assigned at {active.label}
              </div>
              <p className="mt-3 text-2xl text-slide-gray-800 leading-snug">{active.note}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Box tone="light" compact icon={<BookOpen className="w-5 h-5" />} label="Reader" sub="Look, don't touch" />
              <Box tone="light" compact icon={<KeyRound className="w-5 h-5" />} label="Contributor" sub="Build, but can't grant" />
              <Box tone="light" compact icon={<ShieldCheck className="w-5 h-5" />} label="Owner" sub="Can also grant. Rare." />
            </div>

            <p className="text-xl text-slide-gray-600 leading-snug">
              Permissions only ever flow <span className="font-semibold text-slide-primary">down</span>,
              and they only ever <span className="font-semibold text-slide-primary">add</span>. There is
              no "deny this one thing" here, that is what Policy is for.
            </p>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 15 ====== */

export function S15RBACvsPolicy() {
  return (
    <AZSlide index={15} kicker="The distinction that matters most">
      <Body>
        <Kicker>The two pillars of control</Kicker>
        <Title>
          RBAC asks <em>who</em>. Policy asks <em>what</em>.
        </Title>
        <Lead className="mt-4">
          They sit next to each other in the portal and are constantly mistaken for one
          another. They answer different questions, and you need both.
        </Lead>

        <div className="mt-6 grid grid-cols-2 gap-8 flex-1">
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted/40 p-6 flex flex-col">
            <Chip tone="cloud" className="self-start mb-4">
              <KeyRound className="w-5 h-5" /> RBAC
            </Chip>
            <p className="text-3xl font-semibold text-slide-primary mb-4">
              “Who is allowed to act?”
            </p>
            <div className="flex flex-col gap-3 flex-1">
              <Box tone="light" compact label="Controls actions" sub="create, read, update, delete" />
              <Box tone="light" compact label="Attached to an identity" sub="a group, a service principal, a managed identity" />
              <Box tone="light" compact label="Only ever grants" sub="It permits; it cannot forbid a configuration" />
              <Box tone="light" compact label="An Owner is still bound by Policy" sub="Full permission does not mean anything may exist" />
            </div>
          </div>

          <div className="rounded border-2 border-slide-primary/35 bg-slide-gray-100 p-6 flex flex-col">
            <Chip tone="navy" className="self-start mb-4">
              <Scale className="w-5 h-5" /> Azure Policy
            </Chip>
            <p className="text-3xl font-semibold text-slide-primary mb-4">
              “What is allowed to exist?”
            </p>
            <div className="flex flex-col gap-3 flex-1">
              <Box tone="light" compact label="Controls configuration" sub="regions, SKUs, tags, encryption, public access" />
              <Box tone="light" compact label="Attached to a scope" sub="management group, subscription, resource group" />
              <Box tone="light" compact label="Can deny, audit or repair" sub="It is a guardrail, not a permission" />
              <Box tone="light" compact label="It stops an Owner too" sub="Which is exactly why it is worth having" />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded border-2 border-slide-gray-300 bg-white px-6 py-3">
          <p className="text-lg text-slide-gray-800">
            The test: <span className="font-semibold">“Could a well-meaning Owner still do this?”</span>{' '}
            If yes, and it would be a problem, you needed a policy, not a smaller role.
          </p>
        </div>
      </Body>
    </AZSlide>
  );
}
