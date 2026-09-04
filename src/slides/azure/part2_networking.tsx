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
    { n: 'app-subnet', c: '10.1.1.0/24', t: 'Where the workload runs' },
    { n: 'data-subnet', c: '10.1.2.0/24', t: 'Private endpoints only' },
    { n: 'mgmt-subnet', c: '10.1.3.0/24', t: 'Jump hosts and agents' },
    { n: 'AzureFirewallSubnet', c: '10.0.1.0/26', t: 'Reserved name, hub only' },
  ];

  return (
    <AZSlide index={7} kicker="VNet & Subnets">
      <Body>
        <Kicker>The private road system</Kicker>
        <Title>A VNet is a private address space.</Title>
        <Lead className="mt-4">
          Nothing enters or leaves it unless you build a way in. Subnets carve that block
          into named streets, each of which can be guarded separately.
        </Lead>

        <div className="mt-8 flex-1 flex flex-col justify-center">
          <div className="rounded border-2 border-slide-accent bg-slide-accent-muted/50 p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Network className="w-7 h-7 text-slide-primary" />
                <span className="text-2xl font-semibold text-slide-primary">
                  VNet · payments-prod
                </span>
              </div>
              <Chip tone="cloud">10.1.0.0/16</Chip>
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
              label="Isolated by default"
              sub="Two VNets cannot reach each other until you peer them. Isolation is the starting state."
            />
            <Box
              tone="light"
              icon={<Map className="w-6 h-6" />}
              label="Plan the address space once"
              sub="Overlapping ranges stop two VNets ever being peered, the hardest decision to walk back."
            />
            <Box
              tone="light"
              icon={<ShieldCheck className="w-6 h-6" />}
              label="One guard per street"
              sub="A subnet is the natural place to attach an NSG."
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
    { a: 'Allow', src: '10.1.1.0/24', port: '1433', t: 'app street → data street', tone: 'success' as Tone },
    { a: 'Allow', src: '10.0.0.0/16', port: '443', t: 'anything arriving via the hub', tone: 'success' as Tone },
    { a: 'Deny', src: 'Internet', port: '*', t: 'no road in from outside', tone: 'error' as Tone },
  ];

  return (
    <AZSlide index={8} kicker="NSG vs Azure Firewall">
      <Body>
        <Kicker>Two different jobs, constantly confused</Kicker>
        <Title>A guard on one street. A checkpoint for the whole city.</Title>

        <div className="mt-6 grid grid-cols-2 gap-8 flex-1">
          {/* NSG */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-9 h-9 text-slide-accent" />
              <div>
                <div className="text-2xl font-semibold text-slide-gray-900">Network Security Group</div>
                <div className="text-lg text-slide-gray-600">The guard at one entrance</div>
              </div>
            </div>

            <p className="mt-4 text-lg text-slide-gray-700 leading-snug">
              Attached to a subnet or a NIC. Decides on addresses and ports alone, cheap,
              everywhere, and blind to content.
            </p>

            <div className="mt-4 rounded border-2 border-slide-gray-200 overflow-hidden">
              <div className="bg-slide-primary text-white px-5 py-2.5 text-lg font-semibold">
                Rule list · data-subnet
              </div>
              <div className="divide-y divide-slide-gray-200">
                {rules.map((r) => (
                  <div key={r.t} className="flex items-center gap-3 px-5 py-2.5">
                    <Chip tone={r.tone} className="!px-3 !py-0.5 !text-base">{r.a}</Chip>
                    <span className="text-lg font-mono text-slide-gray-600 w-36">{r.src}</span>
                    <span className="text-lg font-mono text-slide-gray-500 w-16">:{r.port}</span>
                    <span className="text-lg text-slide-gray-700 leading-tight">{r.t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 text-lg text-slide-gray-600">
              Stateful, and the first matching rule wins.
            </div>
          </div>

          {/* Firewall */}
          <div className="rounded border-2 border-[hsl(var(--slide-error)/0.45)] bg-[hsl(var(--slide-error)/0.05)] p-6 flex flex-col">
            <div className="flex items-center gap-3">
              <Flame className="w-9 h-9 text-[hsl(var(--slide-error))]" />
              <div>
                <div className="text-2xl font-semibold text-slide-gray-900">Azure Firewall</div>
                <div className="text-lg text-slide-gray-600">The checkpoint everything passes</div>
              </div>
            </div>

            <p className="mt-4 text-lg text-slide-gray-700 leading-snug">
              One managed service in the hub. Every flow in, out or between spokes is
              inspected and logged there.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <Box tone="light" compact icon={<Globe className="w-5 h-5" />} label="Filters on names, not just numbers" sub="Allow api.partner.com, not an IP range that changes weekly." />
              <Box tone="light" compact icon={<AlertTriangle className="w-5 h-5" />} label="Threat intelligence built in" sub="Known-bad destinations refused, with no list to maintain." />
              <Box tone="light" compact icon={<BookOpen className="w-5 h-5" />} label="One place that saw everything" sub="Which makes an incident answerable afterwards." />
            </div>

            <div className="mt-auto pt-4 text-lg text-slide-gray-600">
              It only works if traffic is <em>forced</em> through it, a routing decision,
              not a firewall setting.
            </div>
          </div>
        </div>

        <div className="mt-4 rounded border-2 border-slide-accent bg-slide-accent-muted px-6 py-2.5">
          <p className="text-lg text-slide-primary font-medium">
            You need both: the NSG stops the wrong neighbour reaching a street, and the
            firewall is the only thing that sees the whole picture.
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
          Routing decides which way a packet drives; DNS decides what it was aiming for.
          Almost every "the network is broken" ticket is one of these two.
        </Lead>

        <div className="mt-6 grid grid-cols-2 gap-8 flex-1">
          {/* Routes */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <Compass className="w-8 h-8 text-slide-accent" />
              <span className="text-2xl font-semibold">Routes, the road signs</span>
            </div>

            <p className="text-lg text-slide-gray-700 leading-snug">
              By default a subnet drives straight out to the internet. A user-defined route
              overrides that sign to read <em>“via the checkpoint first”</em>, the mechanism
              that makes central inspection real.
            </p>

            <div className="mt-4 rounded border-2 border-slide-gray-200 bg-slide-gray-100 p-4">
              <div className="text-lg font-semibold text-slide-gray-600 uppercase tracking-[0.12em] mb-3">
                Route table · app-subnet
              </div>
              <div className="font-mono text-lg divide-y divide-slide-gray-300">
                <div className="flex justify-between py-2">
                  <span className="text-slide-gray-700">0.0.0.0/0</span>
                  <span className="text-slide-accent font-semibold">→ 10.0.1.4 (firewall)</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slide-gray-700">10.1.0.0/16</span>
                  <span className="text-slide-gray-500">local VNet</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slide-gray-700">192.168.0.0/16</span>
                  <span className="text-slide-accent font-semibold">→ 10.0.1.4 (firewall)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Box tone="error" compact icon={<XCircle className="w-5 h-5" />} label="Default" sub="Straight out. Nothing inspected." className="flex-1" />
              <Box tone="success" compact icon={<CheckCircle2 className="w-5 h-5" />} label="With a UDR" sub="Via the firewall. Inspected and logged." className="flex-1" />
            </div>
          </div>

          {/* DNS */}
          <div className="rounded border-2 border-slide-gray-300 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-8 h-8 text-slide-accent" />
              <span className="text-2xl font-semibold">DNS, the address book</span>
            </div>

            <p className="text-lg text-slide-gray-700 leading-snug">
              Services find each other by name. A private DNS zone makes a name resolve to a
              <em> private</em> address, so traffic never leaves the road system to reach
              something next door.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded border-2 border-slide-gray-200 bg-slide-gray-100 px-5 py-3 font-mono text-lg">
              <Server className="w-5 h-5 text-slide-accent shrink-0" />
              <span className="text-slide-gray-700">sql-payments</span>
              <span className="text-slide-gray-400">→</span>
              <BookOpen className="w-5 h-5 text-slide-primary shrink-0" />
              <span className="text-slide-primary font-semibold">private DNS zone</span>
              <span className="text-slide-gray-400">→</span>
              <Building2 className="w-5 h-5 text-slide-gray-500 shrink-0" />
              <span className="text-slide-gray-700">10.2.1.4</span>
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-2.5">
              <Box tone="light" compact icon={<Globe className="w-5 h-5" />} label="Public DNS resolves the internet" sub="Azure-provided by default, and fine for that job." />
              <Box tone="cloud" compact icon={<Lock className="w-5 h-5" />} label="Private zones resolve your estate" sub="Linked to the hub so every spoke gets the same answer. Without it, a private endpoint resolves to its public name and the traffic leaves." />
            </div>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}

/* ============================================================== 10 ====== */

export function S10HubSpoke() {
  const [after, setAfter] = useState(true);

  const before = [
    'Every subscription invents its own address space',
    'Egress goes straight out, nothing inspects it',
    'Spokes cannot reach each other cleanly',
    'No shared DNS, so names break across teams',
  ];
  const afterItems = [
    'One hub, peered to every spoke',
    'All egress forced through the firewall',
    'Spoke-to-spoke is controlled and logged',
    'One private DNS estate, resolving everywhere',
  ];

  return (
    <AZSlide index={10} kicker="Hub and spoke">
      <Body>
        <div className="flex items-end justify-between">
          <div>
            <Kicker>The shape the whole network takes</Kicker>
            <Title>One hub holds what everyone shares.</Title>
          </div>
          <div className="flex gap-2 pb-2">
            {[
              { k: false, l: 'Without a landing zone' },
              { k: true, l: 'With one' },
            ].map((o) => (
              <button
                key={o.l}
                type="button"
                onClick={() => setAfter(o.k)}
                className={`px-5 py-2.5 rounded-full border-2 text-lg font-semibold transition-colors ${
                  after === o.k
                    ? 'bg-slide-primary border-slide-primary text-white'
                    : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent'
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <Lead className="mt-4">
          Rather than every property building private roads to every other property, one
          central hub holds the shared services, firewall, DNS, gateways, and each spoke
          connects only to it.
        </Lead>

        <div className="mt-7 flex-1 grid grid-cols-[1.35fr_1fr] gap-8 items-center">
          {/* Topology */}
          <div className="flex flex-col items-center">
            <div className="rounded border-4 border-slide-accent bg-slide-accent-muted px-10 py-5 flex flex-col items-center gap-1.5">
              <Network className="w-11 h-11 text-slide-primary" />
              <span className="text-2xl font-semibold text-slide-primary">Hub VNet</span>
              <span className="text-lg text-slide-gray-600">
                Azure Firewall · Private DNS · ExpressRoute / VPN gateway
              </span>
            </div>

            <div className="flex justify-between items-start w-full mt-1 px-4">
              {['Payments', 'SAP', 'HR', 'Ecommerce'].map((s) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className="w-0.5 h-9 bg-slide-gray-400" />
                  <div className="rounded border-2 border-slide-gray-300 bg-white px-5 py-3.5 text-center">
                    <Building2 className="w-7 h-7 text-slide-gray-600 mx-auto mb-1" />
                    <div className="font-semibold">{s}</div>
                    <div className="text-lg text-slide-gray-500">Spoke VNet</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xl text-slide-gray-600 text-center max-w-2xl">
              Peering connects each spoke to the hub. Spokes reach each other{' '}
              <span className="text-slide-primary font-semibold">only through it</span>, which
              is what makes a single checkpoint possible at all.
            </p>
          </div>

          {/* Before / after */}
          <div
            className={`rounded border-2 p-7 flex flex-col h-full transition-colors duration-300 ${
              after
                ? 'border-[hsl(var(--slide-success)/0.5)] bg-[hsl(var(--slide-success)/0.05)]'
                : 'border-[hsl(var(--slide-error)/0.45)] bg-[hsl(var(--slide-error)/0.04)]'
            }`}
          >
            <Chip tone={after ? 'success' : 'error'} className="self-start mb-5">
              {after ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {after ? 'With a landing zone' : 'Without one'}
            </Chip>

            <div className="flex flex-col gap-3 flex-1 justify-center">
              {(after ? afterItems : before).map((t) => (
                <Box key={t} tone={after ? 'success' : 'error'} compact label={t} />
              ))}
            </div>
          </div>
        </div>
      </Body>
    </AZSlide>
  );
}
