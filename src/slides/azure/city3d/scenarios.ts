export type Vec3 = [number, number, number];

export type NodeKind =
  | 'workload'
  | 'nsg'
  | 'firewall'
  | 'dns'
  | 'gateway'
  | 'onprem'
  | 'internet'
  | 'data';

export interface CityNode {
  id: string;
  /** Plain-language name used in the city metaphor. */
  label: string;
  /** The Azure service this stands for. */
  azure: string;
  /** Ground position in city space. The city model spans roughly -30..30. */
  pos: Vec3;
  kind: NodeKind;
}

/**
 * Where each Azure component sits in the city.
 *
 * The hub (Azure Firewall) is the city centre; the two spokes sit north-west
 * and north-east; the on-premises datacentre and the public internet sit
 * outside the city on the south edge, either side of the gateway.
 */
export const NODES: Record<string, CityNode> = {
  appA: {
    id: 'appA',
    label: 'App campus',
    azure: 'Spoke A · App workload',
    pos: [-21, 0, -9],
    kind: 'workload',
  },
  nsgA: {
    id: 'nsgA',
    label: 'Street guard',
    azure: 'NSG · Spoke A subnet',
    pos: [-11, 0, -9],
    kind: 'nsg',
  },
  dns: {
    id: 'dns',
    label: 'Address book',
    azure: 'Private DNS zone',
    pos: [0, 0, -19],
    kind: 'dns',
  },
  firewall: {
    id: 'firewall',
    label: 'City checkpoint',
    azure: 'Azure Firewall · Hub',
    pos: [0, 0, 0],
    kind: 'firewall',
  },
  nsgB: {
    id: 'nsgB',
    label: 'Street guard',
    azure: 'NSG · Spoke B subnet',
    pos: [11, 0, -9],
    kind: 'nsg',
  },
  dataB: {
    id: 'dataB',
    label: 'Data vault',
    azure: 'Spoke B · SQL private endpoint',
    pos: [21, 0, -9],
    kind: 'data',
  },
  gateway: {
    id: 'gateway',
    label: 'City gate',
    azure: 'ExpressRoute / VPN Gateway',
    pos: [-11, 0, 15],
    kind: 'gateway',
  },
  onprem: {
    id: 'onprem',
    label: 'Old town',
    azure: 'On-premises datacentre',
    pos: [-23, 0, 18],
    kind: 'onprem',
  },
  internet: {
    id: 'internet',
    label: 'Outside world',
    azure: 'Internet / SaaS',
    pos: [22, 0, 17],
    kind: 'internet',
  },
};

export interface Hop {
  node: string;
  title: string;
  /** The city metaphor, for a non-technical audience. */
  plain: string;
  /** What is actually happening in Azure. */
  azure: string;
  /** The concrete control that made this hop possible (or not). */
  control: string;
  status: 'start' | 'allow' | 'deny';
}

export interface Scenario {
  id: string;
  label: string;
  /** One line naming the architectural point this scenario proves. */
  summary: string;
  hops: Hop[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'east-west',
    label: 'App → database',
    summary: 'East-west: two spokes talk only by going through the hub.',
    hops: [
      {
        node: 'appA',
        title: 'Leaving the building',
        plain: 'The app needs the database that lives on the other side of the city.',
        azure: 'Source is a workload in the Spoke A app subnet.',
        control: 'Spoke A VNet · 10.1.1.0/24',
        status: 'start',
      },
      {
        node: 'dns',
        title: 'Resolve the destination',
        plain: 'Before leaving, the app checks the address book for the database location.',
        azure: 'Private DNS resolves the private endpoint to a private IP before the network flow begins.',
        control: 'privatelink.database… → 10.2.1.4',
        status: 'allow',
      },
      {
        node: 'nsgA',
        title: 'Street guard waves it out',
        plain: 'The guard on this street allows traffic heading for the checkpoint.',
        azure: 'NSG outbound rule permits 1433 towards the hub range.',
        control: 'NSG allow · dst 10.0.0.0/16 : 1433',
        status: 'allow',
      },
      {
        node: 'firewall',
        title: 'Everything meets at the checkpoint',
        plain: 'Traffic between campuses always goes through the city checkpoint first.',
        azure: 'A UDR forces the subnet default route to the firewall, which applies the network rule.',
        control: 'UDR 0.0.0.0/0 → firewall · allow A→B:1433',
        status: 'allow',
      },
      {
        node: 'nsgB',
        title: 'Guard at the destination',
        plain: 'The guard on the far street checks who is arriving before letting it in.',
        azure: 'NSG inbound rule accepts 1433, but only from the hub range.',
        control: 'NSG allow · src 10.0.0.0/16 : 1433',
        status: 'allow',
      },
      {
        node: 'dataB',
        title: 'Arrived',
        plain: 'The database answers, and the reply follows exactly the same road back.',
        azure: 'The private endpoint accepts the connection. Both the firewall and the NSGs logged the flow.',
        control: 'Private endpoint · flow logged end to end',
        status: 'allow',
      },
    ],
  },
  {
    id: 'hybrid',
    label: 'On-prem → app',
    summary: 'Hybrid: the corporate network enters through one inspected gate.',
    hops: [
      {
        node: 'onprem',
        title: 'Starting in the old town',
        plain: 'Someone in the corporate office opens the internal application.',
        azure: 'Client on the on-premises network, routed over ExpressRoute.',
        control: 'On-prem 192.168.0.0/16',
        status: 'start',
      },
      {
        node: 'gateway',
        title: 'One official entrance',
        plain: 'The private road into the city has exactly one gate.',
        azure: 'ExpressRoute or VPN gateway, deployed in the hub VNet.',
        control: 'GatewaySubnet · hub VNet',
        status: 'allow',
      },
      {
        node: 'firewall',
        title: 'Even trusted visitors are inspected',
        plain: 'Coming in through the gate does not skip the checkpoint.',
        azure: 'The gateway route table sends incoming traffic to the firewall before any spoke.',
        control: 'Gateway UDR → Azure Firewall',
        status: 'allow',
      },
      {
        node: 'nsgA',
        title: 'Street guard confirms',
        plain: 'The guard checks that this street accepts visitors from the office.',
        azure: 'NSG allows the on-premises range on 443 and nothing else.',
        control: 'NSG allow · src 192.168.0.0/16 : 443',
        status: 'allow',
      },
      {
        node: 'appA',
        title: 'Reaches the app',
        plain: 'The user gets the app, and it was never exposed to the internet to do it.',
        azure: 'No public IP on the workload. The path is private, inspected and logged.',
        control: 'Private, inspected, logged',
        status: 'allow',
      },
    ],
  },
  {
    id: 'egress',
    label: 'App → internet',
    summary: 'Egress: the whole estate leaves by one known address.',
    hops: [
      {
        node: 'appA',
        title: 'The app calls a partner API',
        plain: 'The app needs something from outside the city.',
        azure: 'Outbound HTTPS from a Spoke A workload.',
        control: 'Outbound 443',
        status: 'start',
      },
      {
        node: 'nsgA',
        title: 'Guard points it inward',
        plain: 'The guard lets it head for the checkpoint, not straight out of town.',
        azure: 'The NSG allows outbound 443, and the UDR keeps the traffic inside the network.',
        control: 'NSG allow 443 · UDR → firewall',
        status: 'allow',
      },
      {
        node: 'firewall',
        title: 'Only one way out',
        plain: 'Every exit from the city is the same checkpoint, so all of it can be watched.',
        azure: 'An application rule allows the approved FQDN; everything else is denied and logged.',
        control: 'FW app rule · allow api.partner.com',
        status: 'allow',
      },
      {
        node: 'internet',
        title: 'Out to the world',
        plain: 'The partner sees one predictable address for the entire company.',
        azure: 'A stable SNAT address, full egress logging, and no rogue public IPs on workloads.',
        control: 'Fixed egress IP · no public IPs on workloads',
        status: 'allow',
      },
    ],
  },
  {
    id: 'blocked',
    label: 'Blocked shortcut',
    summary: 'What a bypass actually costs: nothing central saw it.',
    hops: [
      {
        node: 'appA',
        title: 'A team takes a shortcut',
        plain: 'A team peers their campus straight to another one to save a hop.',
        azure: 'Direct spoke-to-spoke peering, deliberately bypassing the hub.',
        control: 'Spoke A ⇄ Spoke B peering',
        status: 'start',
      },
      {
        node: 'nsgA',
        title: 'The local guard sees nothing wrong',
        plain: 'The guard on this street only knows its own street rules.',
        azure: 'The NSG allows the outbound flow, but an NSG is not a substitute for central inspection.',
        control: 'NSG allow · outbound permitted',
        status: 'allow',
      },
      {
        node: 'nsgB',
        title: 'Refused at the destination',
        plain: 'The far street does not recognise traffic that never passed the checkpoint.',
        azure: 'The inbound NSG denies anything that did not arrive from the hub range, and nothing was centrally inspected or logged along the way.',
        control: 'NSG deny · src not in 10.0.0.0/16',
        status: 'deny',
      },
    ],
  },
];
