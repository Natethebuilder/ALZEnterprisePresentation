import React, { useState } from 'react';
import {
  AZSlide, Kicker, Title, Lead, Body, Box, Chip, ArrowRight, SectionDivider,
} from './components';
import type { Tone } from './components';
import {
  Network, Map, ShieldCheck, Flame, Compass, BookOpen, Building2, Globe,
  Server, Lock, CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react';

/* ============================================================== 06 ====== */

export function S06SectionNetwork() {
  return (
    <SectionDivider
      index={6}
      eyebrow="Section 2"
      title="How they communicate."
      items={['VNet & subnets', 'NSG vs Firewall', 'Routes & DNS', 'Hub and spoke', 'A packet, end to end']}
    />
  );
}

/* ============================================================== 07 ====== */

export function S07VNetSubnets() {
  const subnets = [
    { n: 'app-subnet', c: '10.1.0.0/24', t: 'Application compute' },
    { n: 'data-subnet', c: '10.1.1.0/24', t: 'Data tier or delegated service' },
    { n: 'private-endpoints', c: '10.1.2.0/24', t: 'Private Link endpoints' },
    { n: 'integration-subnet', c: '10.1.3.0/24', t: 'Service integration, if required' },
  ];

  return (
    <AZSlide index={7} kicker="VNet & Subnets">
      <Body>
        <Kicker>The private road system</Kicker>
        <Title>A VNet is a private address space.</Title>
        <Lead className="mt-4">
          A VNet gives resources a routable private network. Subnets divide the address
          space so routing, security and service delegation can be applied deliberately.
        </Lead>

        <div className="mt-8 flex-1 flex flex-col justify-center">
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted/50 p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Network className="w-7 h-7 text-slide-primary" />
                <span className="text-2xl font-semibold text-slide-primary">
                  Workload spoke · payments-prod
                </span>
              </div>
              <Chip tone="cloud">10.1.0.0/20</Chip>
            </div>

            <div className="grid grid-cols-4 gap-5">
              {subnets.map((s) => (
                <div key={s.n} className="rounded border-2 border-slide-gray-300 bg-white p-5">
                  <Map className="w-5 h-5 text-slide-accent mb-2" />
                  <div className="font-semibold text-slide-gray-900 leading-tight">{s.n}</div>
                  <div className="text-lg text-slide-gray-500 font-mono mt-1">{s.c}</div>
                  <div className="text-lg text-slide-gray-600 mt-2 leading-snug">{s.t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-6">
            <Box
              tone="light"
              icon={<Lock className="w-6 h-6" />}
              label="Connectivity is explicit"
              sub="Use peering, a gateway, Private Link or another approved pattern to connect networks and services."
            />
            <Box
              tone="light"
              icon={<Map className="w-6 h-6" />}
              label="Plan non-overlapping ranges"
              sub="Overlap with other VNets or on-premises networks blocks normal routing and makes later integration costly."
            />
            <Box
              tone="light"
              icon={<ShieldCheck className="w-6 h-6" />}
              label="Make outbound explicit"
              sub="Use private subnets and an intentional egress method such as Firewall or NAT Gateway."
            />
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 08 ====== */

export function S08NSGvsFirewall() {
  const rules = [
    { a: '100 Allow', src: '10.1.0.0/24', port: '1433', t: 'app subnet to data subnet', tone: 'success' as Tone },
    { a: '200 Allow', src: '10.50.0.0/24', port: '443', t: 'approved management source', tone: 'success' as Tone },
    { a: '300 Deny', src: 'Internet', port: '*', t: 'explicit internet inbound block', tone: 'error' as Tone },
  ];

  return (
    <AZSlide index={8} kicker="NSG vs Azure Firewall">
      <Body>
        <Kicker>Two different jobs, constantly confused</Kicker>
        <Title>A guard on one street. A checkpoint for the whole city.</Title>

        <div className="mt-5 grid grid-cols-2 gap-8 flex-1 min-h-0">
          {/* NSG */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-5 flex flex-col">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-9 h-9 text-slide-accent" />
              <div>
                <div className="text-2xl font-semibold text-slide-gray-900">Network Security Group</div>
                <div className="text-lg text-slide-gray-600">The guard at one entrance</div>
              </div>
            </div>

            <p className="mt-3 text-base text-slide-gray-700 leading-snug">
              Attached to a subnet or network interface. Stateful priority rules evaluate
              protocol, source, destination and port. It provides local Layer 3 and 4 segmentation.
            </p>

            <div className="mt-3 rounded border-2 border-slide-gray-200 overflow-hidden">
              <div className="bg-slide-primary text-white px-5 py-2.5 text-lg font-semibold">
                Rule list · data-subnet
              </div>
              <div className="divide-y divide-slide-gray-200">
                {rules.map((r) => (
                  <div key={r.t} className="flex items-center gap-3 px-5 py-2">
                    <Chip tone={r.tone} className="!px-3 !py-0.5 !text-base">{r.a}</Chip>
                    <span className="text-lg font-mono text-slide-gray-600 w-32">{r.src}</span>
                    <span className="text-lg font-mono text-slide-gray-500 w-16">:{r.port}</span>
                    <span className="text-lg text-slide-gray-700 leading-tight">{r.t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-3 text-base text-slide-gray-600">
              Lower priority numbers run first. Return traffic for an allowed flow is automatic.
            </div>
          </div>

          {/* Firewall */}
          <div className="rounded border-2 border-[hsl(var(--slide-error)/0.45)] bg-[hsl(var(--slide-error)/0.05)] p-5 flex flex-col">
            <div className="flex items-center gap-3">
              <Flame className="w-9 h-9 text-[hsl(var(--slide-error))]" />
              <div>
                <div className="text-2xl font-semibold text-slide-gray-900">Azure Firewall</div>
                <div className="text-lg text-slide-gray-600">The central policy checkpoint</div>
              </div>
            </div>

            <p className="mt-3 text-base text-slide-gray-700 leading-snug">
              A managed firewall commonly placed in each regional hub. It applies central
              network, application and DNAT policy to traffic that routing sends through it.
            </p>

            <div className="mt-3 flex flex-col gap-2">
              <Box tone="light" compact icon={<Globe className="w-5 h-5" />} label="Application rules can use FQDNs" sub="Allow approved service names for supported protocols instead of tracking changing addresses." className="[&>div:last-child]:!text-base" />
              <Box tone="light" compact icon={<AlertTriangle className="w-5 h-5" />} label="Threat intelligence is configurable" sub="Use alert or deny mode for traffic to known malicious addresses and domains." className="[&>div:last-child]:!text-base" />
              <Box tone="light" compact icon={<BookOpen className="w-5 h-5" />} label="Central logs need a destination" sub="Send diagnostic logs to the chosen monitoring and security platform." className="[&>div:last-child]:!text-base" />
            </div>

            <div className="mt-auto pt-3 text-base text-slide-gray-600">
              A firewall sees only the flows sent to it. Effective routes and symmetric
              return paths are part of the security design.
            </div>
          </div>
        </div>

        <div className="mt-3 rounded border-2 border-slide-accent bg-slide-accent-muted px-6 py-2">
          <p className="text-base text-slide-primary font-medium">
            Use NSGs for local segmentation. Use Azure Firewall or an approved NVA where
            centralized inspection and policy add value. They complement rather than replace each other.
          </p>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 09 ====== */

export function S09RoutesDNS() {
  return (
    <AZSlide index={9} kicker="Routes & DNS">
      <Body>
        <Kicker>The two things that decide where traffic actually goes</Kicker>
        <Title>Road signs, and the address book.</Title>
        <Lead className="mt-4">
          DNS resolves a name before the connection starts. Routing then selects a next hop
          by longest prefix match. Both must be correct in each direction.
        </Lead>

        <div className="mt-6 grid grid-cols-2 gap-8 flex-1">
          {/* Routes */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <Compass className="w-8 h-8 text-slide-accent" />
              <span className="text-2xl font-semibold">Routes, the road signs</span>
            </div>

            <p className="text-lg text-slide-gray-700 leading-snug">
              Azure combines system, BGP and user-defined routes. Use explicit prefixes to
              steer spoke, hybrid and internet traffic through the intended appliance.
            </p>

            <div className="mt-4 rounded border-2 border-slide-gray-200 bg-slide-gray-100 p-4">
              <div className="text-lg font-semibold text-slide-gray-600 uppercase tracking-[0.12em] mb-3">
                Route table · app-subnet
              </div>
              <div className="font-mono text-lg divide-y divide-slide-gray-300">
                <div className="flex justify-between py-2">
                  <span className="text-slide-gray-700">10.2.0.0/16</span>
                  <span className="text-slide-accent font-semibold">→ 10.0.1.4 (firewall)</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slide-gray-700">192.168.0.0/16</span>
                  <span className="text-slide-accent font-semibold">→ 10.0.1.4 (firewall)</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slide-gray-700">0.0.0.0/0</span>
                  <span className="text-slide-accent font-semibold">→ 10.0.1.4 (firewall)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Box tone="error" compact icon={<XCircle className="w-5 h-5" />} label="Common failure" sub="A broad default route loses to a more specific peering or BGP route." className="flex-1" />
              <Box tone="success" compact icon={<CheckCircle2 className="w-5 h-5" />} label="Validate" sub="Check effective routes and the reverse path before blaming the firewall." className="flex-1" />
            </div>
          </div>

          {/* DNS */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-8 h-8 text-slide-accent" />
              <span className="text-2xl font-semibold">DNS, the address book</span>
            </div>

            <p className="text-lg text-slide-gray-700 leading-snug">
              Private Endpoint names must resolve to their private IPs from every client
              network that needs them. The central pattern depends on who performs DNS.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded border-2 border-slide-gray-200 bg-slide-gray-100 px-5 py-3 font-mono text-lg">
              <Server className="w-5 h-5 text-slide-accent shrink-0" />
              <span className="text-slide-gray-700">sql-payments</span>
              <span className="text-slide-gray-400">→</span>
              <BookOpen className="w-5 h-5 text-slide-primary shrink-0" />
              <span className="text-slide-primary font-semibold">privatelink zone</span>
              <span className="text-slide-gray-400">→</span>
              <Building2 className="w-5 h-5 text-slide-gray-500 shrink-0" />
              <span className="text-slide-gray-700">10.2.1.4</span>
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-2.5">
              <Box tone="light" compact icon={<Globe className="w-5 h-5" />} label="Link zones where resolution is needed" sub="A private DNS zone can be linked to each client VNet that needs its records." />
              <Box tone="cloud" compact icon={<Lock className="w-5 h-5" />} label="Central DNS needs a resolver pattern" sub="Use Azure DNS Private Resolver or approved forwarders and link forwarding rulesets to spokes. Linking only the hub is not enough." />
            </div>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 10 ====== */

export function S10HubSpoke() {
  const [mode, setMode] = useState<'traditional' | 'vwan'>('traditional');

  const options = {
    traditional: {
      label: 'Traditional hub and spoke',
      hub: 'Customer-managed hub VNet',
      services: 'Firewall · DNS resolver · VPN / ExpressRoute gateway',
      connection: 'VNet peering and route tables',
      best: 'Best when you need detailed control, custom NVAs or a topology that does not fit a managed hub.',
      points: [
        'Flexible placement and choice of network services',
        'Platform team owns peering, routes and hub lifecycle',
        'Use one regional hub for most same-region spokes',
        'Spoke-to-spoke inspection needs explicit, symmetric UDRs',
      ],
    },
    vwan: {
      label: 'Azure Virtual WAN',
      hub: 'Microsoft-managed virtual hub',
      services: 'Managed routing · VPN / ExpressRoute · secured hub option',
      connection: 'VNet hub connections and virtual hub route tables',
      best: 'Best when branch, multi-region and transitive connectivity at scale justify a more opinionated managed service.',
      points: [
        'Managed any-to-any transit across hubs, branches and VNets',
        'Routing intent can steer private and internet traffic to security',
        'Less routing infrastructure for the platform team to operate',
        'Virtual hubs restrict which custom resources can live inside them',
      ],
    },
  } as const;

  const selected = options[mode];

  return (
    <AZSlide index={10} kicker="Enterprise topology">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>Choose how the hub is operated</Kicker>
            <Title>Choose the hub model that fits the operating need.</Title>
          </div>
          <div className="flex gap-2 pb-2">
            {(Object.keys(options) as Array<keyof typeof options>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`px-5 py-2.5 rounded-full border-2 text-lg font-semibold transition-colors ${
                  mode === key
                    ? 'bg-slide-primary border-slide-primary text-white'
                    : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
                }`}
              >
                {options[key].label}
              </button>
            ))}
          </div>
        </div>

        <Lead className="mt-4">
          Microsoft supports a customer-managed hub and spoke topology and Azure Virtual WAN.
          Both normally place shared connectivity in a dedicated platform subscription.
        </Lead>

        <div className="mt-7 flex-1 grid grid-cols-[1.35fr_1fr] gap-8 items-center">
          <div className="flex flex-col items-center">
            <div className="rounded border-4 border-slide-accent bg-slide-accent-muted px-10 py-5 flex flex-col items-center gap-1.5">
              <Network className="w-11 h-11 text-slide-primary" />
              <span className="text-2xl font-semibold text-slide-primary">{selected.hub}</span>
              <span className="text-lg text-slide-gray-600">
                {selected.services}
              </span>
            </div>

            <div className="flex justify-between items-start w-full mt-1 px-4">
              {['Payments', 'SAP', 'HR', 'Ecommerce'].map((s) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className="w-0.5 h-9 bg-slide-gray-400" />
                  <div className="rounded border-2 border-slide-gray-300 bg-white px-5 py-3.5 text-center">
                    <Building2 className="w-7 h-7 text-slide-gray-600 mx-auto mb-1" />
                    <div className="font-semibold">{s}</div>
                    <div className="text-lg text-slide-gray-500">Workload VNet</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xl text-slide-gray-600 text-center max-w-2xl">
              {selected.connection}. Connectivity, inspection and DNS are designed
              deliberately. A hub does not make every traffic path secure by itself.
            </p>
          </div>

          <div className="rounded border-2 border-slide-gray-300 bg-white p-7 flex flex-col h-full">
            <Chip tone={mode === 'traditional' ? 'cloud' : 'navy'} className="self-start mb-5">
              {mode === 'traditional' ? <Compass className="w-5 h-5" /> : <Network className="w-5 h-5" />}
              {selected.label}
            </Chip>

            <div className="flex flex-col gap-3 flex-1 justify-center">
              {selected.points.map((t) => (
                <Box key={t} tone={mode === 'traditional' ? 'light' : 'cloud'} compact label={t} />
              ))}
            </div>

            <p className="mt-5 text-lg text-slide-gray-600 leading-snug">{selected.best}</p>
          </div>
        </div>

        <p className="mt-4 text-lg text-slide-gray-600">
          Central services are optional, not a goal by themselves. Centralise only where
          governance, operations or economics clearly benefit multiple workloads.
        </p>
      </Body>
    </AZSlide>
  );
}
