export type Vec3 = [number, number, number];

export type NodeKind =
  | 'workload'
  | 'nsg'
  | 'firewall'
  | 'dns'
  | 'gateway'
  | 'waf'
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
    azure: 'Azure Private DNS / resolver',
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
    azure: 'Spoke B · SQL workload',
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
  appGateway: {
    id: 'appGateway',
    label: 'Web checkpoint',
    azure: 'Application Gateway WAF · Workload',
    pos: [-18, 0, 4],
    kind: 'waf',
  },
};

export interface Hop {
  node: string;
  /** Optional source node for this decision. It prevents lookup steps becoming data-path hops. */
  from?: string;
  /** DNS lookup is a preflight action, not part of the application payload path. */
  flow?: 'traffic' | 'lookup';
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
    summary: 'Traditional hub: explicit routes send traffic through central inspection.',
    hops: [
      {
        node: 'appA',
        title: 'Leaving the building',
        plain: 'The app needs the database that lives on the other side of the city.',
        azure: 'The source is a workload in the Spoke A application subnet.',
        control: 'Spoke A app subnet · 10.1.0.0/24',
        status: 'start',
      },
      {
        node: 'dns',
        from: 'appA',
        flow: 'lookup',
        title: 'Resolve the destination',
        plain: 'Before the connection starts, the app asks the address book where the database lives.',
        azure: 'A separate DNS query resolves the private database name. The application packet has not moved yet.',
        control: 'payments-db.internal.contoso.com → 10.2.1.4',
        status: 'allow',
      },
      {
        node: 'nsgA',
        from: 'appA',
        title: 'Street guard waves it out',
        plain: 'The guard on this street allows traffic heading for the checkpoint.',
        azure: 'The source subnet NSG permits TCP 1433 to the destination spoke range.',
        control: 'NSG allow · dst 10.2.0.0/16 : 1433',
        status: 'allow',
      },
      {
        node: 'firewall',
        title: 'Everything meets at the checkpoint',
        plain: 'This approved cross-campus connection is sent through the shared checkpoint.',
        azure: 'A specific UDR overrides the peering route. Azure Firewall evaluates a network rule and preserves the private source by default.',
        control: 'UDR 10.2.0.0/16 → firewall · allow A→B:1433',
        status: 'allow',
      },
      {
        node: 'nsgB',
        title: 'Guard at the destination',
        plain: 'The guard on the far street checks who is arriving before letting it in.',
        azure: 'The destination NSG sees the original private source and permits only the application subnet on TCP 1433.',
        control: 'NSG allow · src 10.1.0.0/24 : 1433',
        status: 'allow',
      },
      {
        node: 'dataB',
        title: 'Arrived',
        plain: 'The database accepts the connection, then the reply takes the controlled road back.',
        azure: 'The listener and data-plane identity authorize the request. A matching Spoke B route keeps the return path symmetric.',
        control: 'Return UDR 10.1.0.0/20 → firewall',
        status: 'allow',
      },
    ],
  },
  {
    id: 'hybrid',
    label: 'On-prem → app',
    summary: 'Hybrid: one valid design routes private corporate traffic through hub inspection.',
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
        azure: 'Hub route tables and gateway propagation are designed so the path crosses Azure Firewall in both directions.',
        control: 'Hub routing · gateway ↔ firewall ↔ spoke',
        status: 'allow',
      },
      {
        node: 'nsgA',
        title: 'Street guard confirms',
        plain: 'The guard checks that this street accepts visitors from the office.',
        azure: 'The workload subnet NSG permits the approved on-premises range on TCP 443.',
        control: 'NSG allow · src 192.168.0.0/16 : 443',
        status: 'allow',
      },
      {
        node: 'appA',
        title: 'Reaches the app',
        plain: 'The user gets the app, and it was never exposed to the internet to do it.',
        azure: 'The workload has no public IP. Firewall diagnostics and VNet flow logs provide evidence when enabled.',
        control: 'Private path · symmetric routes · diagnostics',
        status: 'allow',
      },
    ],
  },
  {
    id: 'egress',
    label: 'App → internet',
    summary: 'Egress: a regional workload leaves through an approved, observable address set.',
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
        azure: 'The NSG permits outbound HTTPS. A default UDR on the private subnet selects Azure Firewall as the next hop.',
        control: 'NSG allow 443 · UDR 0.0.0.0/0 → firewall',
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
        azure: 'Azure Firewall uses its public IP or prefix for SNAT. Diagnostic logs record the decision when configured.',
        control: 'Approved egress IP set · no workload public IP',
        status: 'allow',
      },
    ],
  },
  {
    id: 'ingress',
    label: 'Internet → app',
    summary: 'Ingress: one valid pattern terminates and filters web traffic before the workload.',
    hops: [
      {
        node: 'internet',
        title: 'A customer opens the application',
        plain: 'A visitor approaches the only published entrance for this building.',
        azure: 'An internet client starts an HTTPS connection to the application endpoint.',
        control: 'HTTPS · public application endpoint',
        status: 'start',
      },
      {
        node: 'appGateway',
        title: 'The web checkpoint inspects the request',
        plain: 'The entrance checks the request before it is allowed near the building.',
        azure: 'Application Gateway v2 terminates HTTPS and its WAF policy evaluates Layer 7 threats.',
        control: 'App Gateway v2 · WAF policy · TLS',
        status: 'allow',
      },
      {
        node: 'nsgA',
        title: 'Only the web tier can enter',
        plain: 'The street guard accepts visitors only from the approved checkpoint.',
        azure: 'The workload NSG allows the dedicated Application Gateway subnet to the backend port.',
        control: 'NSG allow · src 10.1.4.0/24 : 443',
        status: 'allow',
      },
      {
        node: 'appA',
        title: 'The private workload receives the request',
        plain: 'The visitor reaches the building without a public door on the workload itself.',
        azure: 'The backend uses a private address. Health probes, certificates and application authentication still need separate design.',
        control: 'Private backend · WAF logs · app authentication',
        status: 'allow',
      },
    ],
  },
  {
    id: 'blocked',
    label: 'Denied egress',
    summary: 'Denied egress: an unapproved destination stops at the central policy point.',
    hops: [
      {
        node: 'appA',
        title: 'A workload calls an unknown service',
        plain: 'The building tries to send data to an address that is not on the approved list.',
        azure: 'A workload starts outbound HTTPS to an unapproved FQDN.',
        control: 'Outbound 443 · unknown.example',
        status: 'start',
      },
      {
        node: 'nsgA',
        title: 'The local guard permits the route',
        plain: 'The street guard allows HTTPS to leave, but does not understand the service name.',
        azure: 'The NSG permits Layer 4 traffic. The default UDR still sends it to Azure Firewall.',
        control: 'NSG allow 443 · UDR → firewall',
        status: 'allow',
      },
      {
        node: 'firewall',
        title: 'Central policy refuses the destination',
        plain: 'The city checkpoint has no approved route for this destination, so the trip ends here.',
        azure: 'No application rule allows the FQDN. Azure Firewall denies and logs the connection attempt.',
        control: 'Default deny · log decision and rule collection',
        status: 'deny',
      },
    ],
  },
];
