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
          Microsoft Entra ID authenticates human and workload identities. Azure RBAC then
          authorizes control-plane actions and supported data-plane access.
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
                label="Assign workforce access through groups"
                sub="Group-based roles make joiners, movers, leavers and access reviews manageable."
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
                label="PIM: eligible, time-bound privilege"
                sub="Use approval, MFA and expiry for privileged roles where the risk justifies it."
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
              A managed identity lets supported Azure resources request Entra tokens without
              developers storing or rotating an application credential.
            </p>

            <div className="flex flex-col items-center gap-2">
              <Box compact tone="navy" icon={<Server className="w-6 h-6" />} label="Workload" sub="VM, App Service, Function, container" className="w-full" />
              <ArrowDown />
              <Box compact tone="light" icon={<Lock className="w-6 h-6" />} label="Key Vault / SQL / Storage" sub="Target supports Entra authentication and grants the required data role" className="w-full" />
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-2.5">
              <Box tone="success" compact icon={<CheckCircle2 className="w-5 h-5" />} label="System-assigned follows one resource; user-assigned can be reused" />
              <Box tone="error" compact icon={<XCircle className="w-5 h-5" />} label="Use credentials only when the target cannot use Entra authentication" />
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
    note: 'A common scope for a platform capability or workload team when it owns the whole subscription. It is broad enough to operate, but still bounded.',
  },
  {
    key: 'rg',
    label: 'Resource Group',
    detail: 'hub-firewall',
    icon: <FolderTree className="w-6 h-6" />,
    reaches: ['res'],
    note: 'A good scope when a team owns only part of a subscription. Prefer the smallest scope that still makes routine work practical.',
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
          <Box tone="cloud" icon={<Users className="w-6 h-6" />} label="WHO" sub="A workforce or workload identity" />
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
              Role assignments inherit down and normally accumulate. Effective access also
              evaluates deny assignments and supported role-assignment conditions. Policy
              governs resource configuration, not a person's job function.
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
              <Box tone="light" compact label="Evaluation has more than grants" sub="Applicable deny assignments and supported conditions are also checked" />
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
              <Box tone="light" compact label="Assigned at a scope" sub="management group, subscription, resource group or resource" />
              <Box tone="light" compact label="Can deny, audit or repair" sub="It is a guardrail, not a permission" />
              <Box tone="light" compact label="It stops an Owner too" sub="Which is exactly why it is worth having" />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded border-2 border-slide-gray-300 bg-white px-6 py-3">
          <p className="text-lg text-slide-gray-800">
            Use RBAC when the question is whether an identity may perform an action. Use
            Policy when the question is whether a resource state is compliant.
          </p>
        </div>
      </Body>
    </AZSlide>
  );
}
