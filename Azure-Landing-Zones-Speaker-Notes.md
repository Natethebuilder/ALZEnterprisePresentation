# Azure Landing Zones: Speaker Notes and Solution Engineer Guide

Accuracy review date: 7 September 2026

These notes are deliberately separate from the presentation. They are written for a solution engineer who needs to teach the foundations, guide a customer conversation and prepare for implementation.

## How to use this guide

- Keep the visible slides simple. Use these notes to add precision when the audience asks how a control works or whether a pattern is mandatory.
- Describe the deck as a teaching model. The city metaphor explains boundaries and decisions, but it is not a literal Azure architecture.
- Separate facts from design choices. Azure provides capabilities. The landing zone design decides where to use them, who owns them and how they are operated.
- Never say that a hub, firewall, private endpoint or separate subscription is mandatory for every workload. Microsoft provides a reference architecture that must be adapted to business and technical requirements.
- When a customer gives an absolute requirement, ask for the reason, the evidence and the accountable owner. This turns a preference into a design input that can be tested.

## The one-sentence explanation

An Azure landing zone is the combination of a shared platform foundation, governed workload environments and an operating model that lets teams use Azure safely at scale.

## Section 0: Opening and mental model

### Slide 1: Azure Landing Zones for the enterprise

Purpose: Set the expectation that the session connects architecture to ownership and delivery.

Talk track:

- A landing zone is not one network diagram and it is not a single Azure service.
- It is a target architecture plus repeatable implementation and operating practices for a multi-subscription estate.
- This session follows four questions: where resources live, how traffic moves, who may act and how the environment stays governed.
- The city metaphor helps non-technical stakeholders follow the same story as architects. Each metaphor will be translated back into an Azure mechanism.

Ask the room:

- Which of the four questions causes the most delay or risk today?
- Is the current challenge greenfield, brownfield or a mixture of both?

Source:

- [What is an Azure landing zone?](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)

### Slide 2: Platform and application landing zones

Purpose: Establish the current Microsoft definition before discussing individual services.

Talk track:

- The platform landing zone is the shared foundation. It normally includes the management-group hierarchy and any central capabilities that provide a clear benefit across workloads.
- Most organizations should have one platform landing zone per Microsoft Entra tenant.
- Application landing zones are the environments where workload teams deploy and operate. A workload has one application landing zone that can contain development, test and production environments. Each environment can use one or more subscriptions when requirements justify it.
- Central resources are optional and requirement driven. A shared connectivity hub is common, but an online workload product can be intentionally isolated and may not need hub peering.
- The eight design areas are coupled. A network decision changes identity, operations, security, governance and automation requirements.

The design areas:

- Billing and Microsoft Entra tenant
- Identity and access management
- Resource organization
- Network topology and connectivity
- Security
- Management
- Governance
- Platform automation and DevOps

Customer lens:

- A customer often starts by asking for a hub or a management-group tree. Bring the conversation back to workload types, risk, ownership and operating capability.
- The reference architecture is a starting point. A sound deviation is one with a documented requirement, tradeoff and owner.

Sources:

- [Azure landing zone design areas and conceptual architecture](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas)
- [Platform and application landing zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)

### Slide 3: Azure is a city

Purpose: Give the audience a common vocabulary.

Talk track:

- The tenant is the main identity and Azure control-plane boundary. It is not the same thing as the billing hierarchy.
- Management groups group subscriptions that need common governance.
- Subscriptions create useful ownership, access, cost and quota boundaries.
- Resource groups organize resources for management, lifecycle and access.
- VNets and subnets provide address and routing structure. They do not replace security controls.
- NSGs are local Layer 3 and Layer 4 filters. Azure Firewall is a centralized policy and inspection service for traffic routed through it.
- DNS resolves a name before an application connection starts. DNS is not a hop in the application payload path.
- Microsoft Entra ID proves identity. Azure RBAC authorizes actions. Azure Policy evaluates resource state and configuration.

Limits of the metaphor:

- Azure resources are software-defined and can have relationships that physical buildings do not.
- Peering is not a security decision by itself. Routing and filtering still determine the allowed path.
- Azure Firewall does not automatically see every flow. Effective routes determine what crosses it.

Sources:

- [Azure landing zone design areas](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas)
- [Azure Virtual Network traffic routing](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview)

## Section 1: Where things live

### Slide 4: Section introduction

Purpose: Shift from the overall model to the Azure resource hierarchy.

Talk track:

- The hierarchy has two jobs: organize ownership and apply controls at the right scale.
- Do not copy an organization chart into management groups. Teams and reporting lines change more often than governance requirements.
- The useful question is: which subscriptions need the same policy and platform treatment?

### Slide 5: Five containers, each wrapping the next

Purpose: Explain scope, inheritance and the reason each layer exists.

Tenant:

- A Microsoft Entra tenant holds identities and is trusted by Azure subscriptions for authentication and authorization.
- Billing offers and billing accounts are related to subscriptions but are separate from the tenant design. Billing arrangements can span tenants.
- A second tenant creates another identity, policy and operations boundary. Use multiple tenants only for a clear legal, security, sovereignty, merger or operating requirement.

Management groups:

- Management groups sit above subscriptions and are mainly used to apply Azure Policy at scale.
- Platform teams can receive carefully controlled RBAC at management-group scope. Workload-team access normally belongs at subscription or resource-group scope to reduce over-permissioning.
- The current landing zone pattern includes an intermediate root, Platform, Landing zones, Sandbox and Decommissioned branches, with workload archetypes below Landing zones.
- Moving a subscription can change inherited policy and access. Treat the move as a controlled change with impact testing.

Subscriptions:

- A subscription is a strong unit for management, access, cost reporting, many service limits and ownership.
- Use separate subscriptions when environment isolation, regulatory scope, team ownership, risk, quota or deployment independence makes the boundary valuable.
- Do not force one subscription per environment without checking service design and operational cost. Microsoft guidance explicitly supports one or more subscriptions per environment.
- Subscription vending should return a usable product, not an empty container. It can set the management group, groups and role assignments, budget, tags, diagnostics, security settings and connectivity inputs.

Resource groups:

- A resource belongs to one resource group at a time.
- A resource group is a management and lifecycle scope. Resources in it can be deployed separately and can live in different Azure regions.
- Deleting a resource group deletes the resources in it. Use locks and separation when resources must not share that deletion boundary.
- Resource groups are useful RBAC scopes when a team owns only part of a subscription.

Resources:

- Resources are the services that do the work.
- Effective policy and access combine assignments from parent scopes with more specific assignments, conditions, deny assignments and Policy exemptions where applicable.
- Use Infrastructure as Code so the platform can be reviewed, tested, rebuilt and changed consistently.

Implementation advice:

- Start the hierarchy from policy archetypes and operating responsibility.
- Keep the hierarchy as simple as the requirements allow.
- Test inherited policy and access before moving existing subscriptions.
- Define a subscription request schema and product lines before building a vending interface.

Sources:

- [Management groups in Azure landing zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups)
- [Azure billing offers and Microsoft Entra tenants](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-microsoft-entra-tenant)
- [Azure landing zone design principles](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-principles)
- [Subscription vending product lines](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/subscription-vending-product-lines)

## Section 2: How traffic flows

### Slide 6: Section introduction

Purpose: Establish that a network flow is a sequence of independent decisions.

Use this troubleshooting sentence throughout the section:

The name resolves, the source selects a route, each security control makes a decision, the destination listens and authorizes, and the reply needs a valid return path.

Key language:

- North-south traffic enters or leaves a network boundary.
- East-west traffic moves between workloads, tiers or VNets.
- Control-plane traffic manages Azure resources through Azure Resource Manager.
- Data-plane traffic accesses the workload or service itself.
- Identity and network reachability are independent. A private route does not grant data access, and a valid token does not create a route.

### Slide 7: VNet and subnets

Purpose: Explain address space, segmentation and explicit connectivity.

Talk track:

- A VNet provides private address space and Azure routing. A subnet is a range within that VNet.
- A VNet can connect to other VNets through peering, Virtual WAN connections or managed connectivity. It can connect to on-premises through VPN or ExpressRoute. Private Link provides private access to a supported service without making networks fully routable to each other.
- Plan address space across Azure regions, on-premises locations, branches and other clouds. Overlap prevents normal routed integration and creates migration cost.
- Microsoft guidance advises against reserving excessively large VNets such as a default /16 when the need is not understood. Size for growth and service requirements.
- Azure reserves five IPv4 addresses in each subnet. Some services require dedicated, correctly named subnets.
- After 31 March 2026, VNets created through newer API versions default to private subnets. Existing estates can still have implicit default outbound access. Design explicit egress for both new and existing workloads.

Explicit outbound options:

- Azure Firewall or another NVA with a UDR when policy and inspection are required
- NAT Gateway when scalable outbound SNAT is required without centralized application filtering
- Standard Load Balancer outbound rules for appropriate load-balanced scenarios
- A public IP on a resource only when the exposure is an intentional part of the design

Customer pitfalls:

- Address ranges are allocated team by team without an enterprise IP plan.
- Subnets are created by resource type without considering routing, delegation or lifecycle.
- Private subnets are enabled before Windows activation, updates, package repositories and service dependencies have an approved egress path.
- The organization treats every workload as routable to every other workload because a hub exists.

Sources:

- [Plan for IP addressing](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/plan-for-ip-addressing)
- [Default outbound access in Azure](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/default-outbound-access)
- [Azure Virtual Network overview](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)

### Slide 8: NSG versus Azure Firewall

Purpose: Prevent the common mistake of treating local filtering and central inspection as interchangeable.

NSG:

- An NSG is a stateful Layer 3 and Layer 4 filter attached to a subnet or network interface.
- Rules contain a priority, direction, action, protocol, source, destination and ports. Lower priority numbers are evaluated first.
- An allowed connection automatically allows return traffic for the stateful flow. This does not remove the need for a valid return route.
- Service tags and Application Security Groups can simplify rules, but Application Security Groups do not span VNets.
- NSGs do not inspect HTTP paths, payloads or user identity.

Azure Firewall:

- Azure Firewall is a managed, stateful network security service.
- Network rules filter Layer 3 and Layer 4 traffic. Application rules support FQDN-aware policy for supported protocols. DNAT rules publish a private destination through a firewall public address when that is the selected ingress pattern.
- Threat intelligence can be configured for alert or deny behavior.
- Firewall Premium adds capabilities such as TLS inspection and intrusion detection and prevention. Confirm supported scenarios and privacy requirements before recommending inspection.
- The firewall sees only traffic that effective routes send to it. Direct peering, service endpoints and other more specific routes can bypass a default route.
- Diagnostic settings must send logs to the required sink. A deployed firewall without routing, policy, logging and an owner is not an operational control.

Do not confuse these services:

- Azure Firewall protects network flows and central egress or transit patterns.
- Web Application Firewall protects HTTP and HTTPS applications at Layer 7 on services such as Application Gateway or Azure Front Door.
- DDoS Protection addresses volumetric network attacks. It is not a replacement for Firewall or WAF.

Sources:

- [How network security groups filter traffic](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Azure Firewall overview](https://learn.microsoft.com/en-us/azure/firewall/overview)
- [Plan for landing zone network segmentation](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/plan-for-landing-zone-network-segmentation)

### Slide 9: Routes and DNS

Purpose: Teach the two most common causes of a failed connection.

Routing:

- Azure chooses a route using longest prefix match.
- For equal prefixes, a user-defined route is preferred over a BGP route, and a BGP route is preferred over a system route. Azure documents special preferred system routes for VNet, peering and service endpoints, so always inspect the effective route table rather than relying on memory.
- A 0.0.0.0/0 UDR is useful for internet egress, but it does not override a more specific peering or BGP prefix.
- To force traditional hub-spoke traffic between Spoke A and Spoke B through a firewall, use explicit routes for the remote spoke prefix on both sides. The return path must cross the same stateful appliance.
- Route propagation from a virtual network gateway can introduce BGP routes. Decide when it should be enabled and when explicit UDRs must override it.
- Check effective routes on the source network interface and the destination return path.

DNS:

- DNS resolution happens before the application connection. The 3D walkthrough uses a dotted line so the lookup is not confused with the payload path.
- A Private Endpoint requires its normal service FQDN to resolve to the private endpoint IP from every client that should use it.
- A private DNS zone can be linked directly to each VNet that needs the records.
- A centralized pattern can use Azure DNS Private Resolver in a hub plus forwarding rulesets linked to spokes. Approved DNS forwarders are another pattern.
- Merely linking a private DNS zone to the hub does not make every peered spoke able to resolve it.
- On-premises resolution commonly forwards the relevant Azure private zones to a Private Resolver inbound endpoint or approved forwarders.
- If the name resolves to a public address, the result depends on service configuration. The connection might use the public endpoint, or it might fail when public network access is disabled. Do not state that it always leaves the network.

Troubleshooting checks:

- Resolve the FQDN from the actual source and record the returned address.
- Confirm the address belongs to the expected private endpoint or destination.
- Inspect effective routes and next hop.
- Use Network Watcher connection troubleshoot, IP flow verify and packet capture where supported.
- Inspect Firewall diagnostics and VNet flow logs. New NSG flow logs can no longer be created, and NSG flow logs retire on 30 September 2027. Use VNet flow logs for new designs.

Sources:

- [Azure Virtual Network traffic routing](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview)
- [Private Endpoint DNS integration scenarios](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns-integration)
- [DNS security and private name resolution](https://learn.microsoft.com/en-us/azure/networking/design-guide/dns-security)
- [Migrate to Virtual Network flow logs](https://learn.microsoft.com/en-us/azure/network-watcher/nsg-flow-logs-migrate)

### Slide 10: Enterprise topology

Purpose: Show that Microsoft supports two major hub models and that topology follows requirements.

Traditional hub and spoke:

- The platform team manages hub VNets, peering, route tables, gateways, firewall or NVAs, DNS components and lifecycle.
- It offers high flexibility for custom appliances and unusual routing needs.
- Peering is non-transitive. A spoke is not automatically connected to another spoke through the hub.
- One regional hub is the common starting point for same-region spokes. Multi-region design needs deliberate hub-to-hub and on-premises routing.
- Direct spoke-to-spoke connectivity can reduce latency and firewall cost when inspection is not required, but it changes visibility and segmentation. Azure Virtual Network Manager connected groups are one option.

Azure Virtual WAN:

- Azure Virtual WAN provides Microsoft-managed virtual hubs, transitive connectivity and integrated branch and VNet connectivity.
- Routing intent and policies can steer private and internet traffic through Azure Firewall in a secured hub.
- It is well suited to broad branch connectivity, multi-region transit and organizations that want less customer-managed routing infrastructure.
- Virtual hubs support a defined set of managed resources. Customer-deployed shared services normally live in a connected shared-services VNet, not inside the virtual hub.
- Check current limits, supported NVAs, routing behavior and secured-hub constraints before committing.

Decision questions:

- How many regions, branches, circuits, VNets and routes are expected in three years?
- Are custom NVAs or unsupported services required in the hub?
- Which east-west flows need inspection, and which need low latency?
- Who will own route lifecycle, incident response and upgrades?
- Is the customer optimizing for flexibility, operational simplicity, cost or existing skills?

Sources:

- [Hub-spoke network topology in Azure](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology)
- [Virtual WAN network topology in an Azure landing zone](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/virtual-wan-network-topology)
- [Azure Virtual Network Manager in landing zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/azure-virtual-network-manager)

### Slide 11: Interactive city walkthrough

Purpose: Turn the concepts into repeatable connection traces.

Presenter controls:

- Choose a scenario, then use Next decision.
- A solid route is application traffic.
- A dotted route is a DNS lookup and is not the application payload.
- Use Lock on packet when you want the camera to follow motion. Switch back to Explore city to orbit manually.

Scenario 1, App to database:

1. The application starts in the Spoke A application subnet.
2. A separate DNS query resolves the private database name to 10.2.1.4. The application packet has not moved.
3. The source NSG permits TCP 1433 to the destination range.
4. A specific UDR for 10.2.0.0/16 sends the flow to the firewall. A default route alone would lose to the more specific peering route.
5. The firewall network rule allows the flow. By default, Azure Firewall does not SNAT network-rule traffic to RFC 1918 private destinations, so the destination sees the original private source.
6. The destination NSG allows the original Spoke A application subnet.
7. The SQL listener and data-plane identity still have to authorize the request. A corresponding route in Spoke B makes the reply symmetric.

Scenario 2, On-premises to app:

1. The private client route is advertised or statically configured toward ExpressRoute or VPN.
2. The gateway terminates the private connection in the hub topology.
3. Hub routing sends the flow through Azure Firewall. The exact combination of BGP propagation and UDRs is architecture specific.
4. The workload NSG permits the approved on-premises range on the application port.
5. The application has no direct public IP. Diagnostics are useful only if enabled and sent to an owned monitoring platform.

Call out route symmetry. A working forward path with a reply that bypasses the stateful firewall still fails.

Scenario 3, App to internet:

1. The workload starts HTTPS to an external API.
2. The NSG allows the Layer 4 flow, and a 0.0.0.0/0 UDR selects the firewall.
3. An application rule allows the approved FQDN. Azure Firewall defaults to deny when no rule matches.
4. The external service sees one of the firewall public IP addresses or an address from the assigned prefix. Do not promise one address for an entire company when there are several regions or firewalls.

For high SNAT scale, assess public IP capacity and the supported NAT Gateway integration for Azure Firewall. For simple controlled outbound without FQDN filtering, NAT Gateway may be the better workload-level choice.

Scenario 4, Internet to app:

1. An internet user connects to the application endpoint.
2. Application Gateway v2 terminates TLS and WAF evaluates HTTP threats in this valid regional ingress pattern.
3. The backend NSG permits traffic from the dedicated Application Gateway subnet to the backend port.
4. The workload stays private. WAF, health probes, certificate lifecycle and application authentication are separate responsibilities.

Alternatives include Azure Front Door for global HTTP entry, Front Door plus a private origin pattern, or Azure Firewall DNAT for non-HTTP and selected inbound needs. Match the service to protocol, reach, resilience and inspection requirements.

Scenario 5, Denied egress:

1. A workload calls an unknown FQDN.
2. The NSG allows HTTPS because it works at Layer 4.
3. The UDR sends the flow to Azure Firewall.
4. No application rule allows the FQDN, so the firewall denies it. The log should identify the source, destination, rule collection and decision when diagnostics are configured.

Questions to ask after the walkthrough:

- Which of these flows exists in the customer estate?
- Which flows need centralized inspection, and which can use a simpler direct pattern?
- Who owns each route, rule, DNS zone, certificate and log alert?
- What evidence proves the intended path during an incident?

Sources:

- [Hub-and-spoke routing design](https://learn.microsoft.com/en-us/azure/networking/design-guide/hub-spoke)
- [Hybrid Azure Firewall tutorial and route requirements](https://learn.microsoft.com/en-us/azure/firewall/tutorial-hybrid-portal-policy)
- [Azure Firewall SNAT private ranges](https://learn.microsoft.com/en-us/azure/firewall/snat-private-range)
- [Private Link in a hub-and-spoke network](https://learn.microsoft.com/en-us/azure/architecture/guide/networking/private-link-hub-spoke-network)

## Section 3: Who controls what

### Slide 12: Section introduction

Purpose: Separate identity, authentication, authorization and configuration governance.

Talk track:

- Authentication asks who or what is making the request.
- Authorization asks whether that identity may perform this action at this scope.
- Network reachability asks whether packets can reach the endpoint.
- Azure Policy asks whether the resource state is permitted or compliant.
- Application authorization and data-plane authorization still exist after an Azure control-plane role is granted.

### Slide 13: Microsoft Entra ID and managed identities

Purpose: Explain human and workload identity without implying that all data access uses Entra.

People:

- Microsoft Entra ID authenticates users. Conditional Access can evaluate user, device, application, location and risk signals, depending on licensing and configuration.
- Use groups for workforce Azure role assignments so access follows team membership and can be reviewed.
- Keep production and non-production groups separate.
- Use PIM for eligible, time-bound privileged access. Configure activation controls based on risk, such as MFA, justification, approval and duration.
- Maintain tested emergency access accounts that are monitored and protected from accidental lockout.

Workloads:

- A managed identity is a special service principal managed by Azure.
- A system-assigned identity follows the lifecycle of one Azure resource.
- A user-assigned identity is a separate Azure resource that can be attached to one or more supported resources.
- Code uses Azure Identity or MSAL to request an Entra token. Developers do not store a client secret for the managed identity.
- The destination service must support Entra authentication, and the managed identity still needs an appropriate data-plane role.
- Managed identity does not remove every secret in an application. Third-party services and unsupported targets can still require credentials, which should be placed in a managed secret store with rotation and least privilege.

Sources:

- [Landing zone identity and access management](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/identity-access-landing-zones)
- [Managed identities overview](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)

### Slide 14: RBAC and scope

Purpose: Teach the role-assignment formula and inheritance.

The formula:

- Security principal: a user, group, service principal or managed identity
- Role definition: the allowed management actions and, where included, data actions
- Scope: management group, subscription, resource group or resource

Talk track:

- A role assignment attaches a role definition to a principal at a scope.
- Assign at the smallest scope that still allows the work to be practical.
- Role assignments inherit to child scopes. Multiple grants normally accumulate.
- Effective Azure Resource Manager authorization also checks deny assignments and supported role-assignment conditions.
- Customers generally cannot create arbitrary deny assignments. Azure creates many deny assignments through managed services such as deployment stacks and blueprints history. Explain the concept without presenting it as the normal tool for access design.
- RBAC conditions, sometimes called Azure ABAC conditions, are supported for specific actions and services. Confirm support before recommending them.

Built-in role shorthand:

- Reader can view control-plane resources.
- Contributor can manage resources but cannot grant Azure RBAC roles.
- Owner can manage resources and grant access. Use it sparingly and prefer eligible privilege for humans.
- User Access Administrator and Role Based Access Control Administrator are access-management roles. Delegation can be constrained with supported conditions.

Customer checks:

- Find direct user assignments.
- Find Owner assignments at management-group and subscription scope.
- Separate human administration, deployment automation and workload runtime identities.
- Review custom roles for wildcard actions and obsolete permissions.
- Verify data-plane access separately for Storage, Key Vault, SQL and other services.

Sources:

- [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)
- [Understand Azure role assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments)
- [Delegate Azure role assignment management with conditions](https://learn.microsoft.com/en-us/azure/role-based-access-control/delegate-role-assignments-overview)

### Slide 15: RBAC versus Azure Policy

Purpose: Give the audience a reliable diagnostic question.

Use RBAC when:

- The question is whether an identity may perform an Azure action.
- You need to grant a platform or workload role at a defined scope.
- A supported data service uses Azure RBAC for data-plane authorization.

Use Azure Policy when:

- The question is whether a resource state is allowed, compliant or should be changed.
- You need a common rule across many subscriptions regardless of whether deployment comes from the portal, CLI, Terraform, Bicep or another Azure Resource Manager client.
- You need audit evidence, a deny control, a supported modification or a related deployment.

Important nuance:

- Policy does not replace least-privilege RBAC.
- RBAC does not guarantee a secure configuration.
- An Owner can still be blocked by a deny Policy assignment because authorization to submit the request does not make the requested state compliant.
- Some Azure Policy data-plane modes exist for specific services. Do not generalize them to every application request.

Sources:

- [Azure Policy overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
- [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)

## Section 4: Governance and operating model

### Slide 16: Section introduction

Purpose: Move from individual controls to lifecycle, ownership and organizational change.

Talk track:

- Governance is not the initial policy deployment. It is the continuing process for choosing controls, measuring compliance, handling exceptions and changing the platform safely.
- A technically correct landing zone can still fail if the operating model has unclear ownership, long lead times or no product feedback.

### Slide 17: Azure Policy effects

Purpose: Explain the behavior and rollout risk of the four common effects.

Deny:

- Deny prevents a non-compliant create or update request.
- Use it for controls that have been validated as non-negotiable and technically supportable.
- Roll out with safe deployment practices. A broad deny can stop deployments, emergency work and platform components.

Audit:

- Audit allows the request and records non-compliance.
- Use it to measure impact, find false positives and prepare remediation or enforcement.
- Compliance evaluation is not an instant real-time inventory for every change. Understand evaluation timing before promising a dashboard outcome.

Modify:

- Modify can add, update or remove supported tags and can modify supported properties during create or update.
- Existing non-compliant resources need a remediation task.
- The policy assignment needs a managed identity for remediation.
- Prefer deny when silently modifying the deployed state would create drift from Infrastructure as Code. Use Modify where the behavior and ownership are clear.

DeployIfNotExists:

- DeployIfNotExists evaluates whether a related resource exists after the resource-provider request succeeds.
- It can deploy the related resource through a managed identity.
- Existing resources need a remediation task.
- Diagnostic settings are a common use, but only if the destination, permissions, supported resource types and cost model are designed.

Policy lifecycle:

- Group policies into initiatives that represent an owned control set.
- Version policy definitions and assignments through code.
- Start with a small ring, then expand after evidence.
- Define an exemption workflow with business justification, owner, expiry and review.
- Track policy conflicts and duplicate assignments.
- Keep the platform aligned with current Azure landing zone policy guidance instead of freezing the first deployment forever.

Sources:

- [Azure Policy effects](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effects)
- [Modify effect](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-modify)
- [Remediate non-compliant resources](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)
- [Safe deployment of Policy assignments](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/policy-safe-deployment-practices)

### Slide 18: Ownership contract

Purpose: Make decision rights explicit without pretending there is one universal RACI.

Talk track:

- The slide is a starting contract. Adjust it to the customer operating model.
- Platform teams own the end-to-end lifecycle of the landing-zone product and shared capabilities.
- Workload teams own the end-to-end lifecycle of their application, data, workload access, cost and operations inside the guardrails.
- Enabling teams close temporary capability gaps. They coach and accelerate rather than becoming permanent owners of the workload.
- Security, networking, identity, finance and compliance stakeholders can be embedded in the platform team or provide defined interfaces. What matters is one accountable owner for each outcome.

For every capability, document:

- Accountable owner
- Consumers
- Supported service and product variants
- Request interface and expected lead time
- Change and emergency path
- Monitoring and incident roles
- Cost allocation
- Exception and retirement path

Common organizational failure modes:

- The platform team owns a firewall but no one owns route correctness or log response.
- The workload team is called autonomous but cannot create a required rule without a ticket queue.
- Central operations has standing access to workload data without a business need.
- Application teams are responsible for cost but cannot see or influence shared platform allocation.

Source:

- [DevOps team topologies for Azure landing zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/considerations/devops-teams-topologies)

### Slide 19: Operating model

Purpose: Show why both central ticket control and ungoverned decentralization fail at scale.

Frozen city:

- Manual approval can create a queue for routine work.
- Teams create shadow paths when the supported path is too slow or cannot meet workload needs.
- Centralization can hide risk because unsanctioned resources are outside the visible estate.

Lawless city:

- Teams repeat network, identity and policy decisions with inconsistent skills and controls.
- Shared incident response and cost management become difficult.
- The model can appear fast at small scale and become expensive as team count grows.

Guardrailed autonomy:

- The platform team offers paved paths and multiple product lines rather than one rigid template.
- Workload teams control their delivery inside automated policy and access boundaries.
- Exceptions are a supported product capability with expiry and review.
- Platform success is measured as a service, not by the number of controls deployed.

Useful product metrics:

- Lead time from request to usable subscription
- Percentage of routine requests completed without manual platform action
- Change failure rate and time to restore the platform
- Policy exception volume, age and recurrence
- Workload adoption and satisfaction
- Percentage of platform changes delivered through code
- Coverage and freshness of network, identity, security and cost telemetry

Sources:

- [Azure landing zone design principles](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-principles)
- [Platform automation and DevOps](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/platform-automation-devops)
- [DevOps team topologies](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/considerations/devops-teams-topologies)

### Slide 20: Roadmap and workshop diagnostic

Purpose: Provide a safe implementation sequence without presenting a rigid waterfall.

Phase 1, discover and align:

- Identify outcomes, stakeholders, workload archetypes, regulatory needs, network dependencies and current operating pain.
- Produce a decision log, target architecture, ownership contract, initial product catalog and success measures.

Phase 2, deploy a code baseline:

- Prefer Microsoft accelerators and Azure Verified Modules where they fit the customer skills and required customization.
- The current platform landing zone options include an Infrastructure as Code accelerator using Bicep or Terraform building blocks, and a portal-based accelerator for teams that need a guided start.
- Keep source control, peer review, environment promotion, testing, emergency-change handling and rollback in scope from the beginning.
- Do not customize every default before a pilot proves the need.

Phase 3, pilot one workload:

- Choose a representative workload with real hybrid, DNS, identity, observability and support needs, but avoid the most politically or technically exceptional workload as the first test.
- Validate deployment, positive and negative traffic paths, access, logs, backup or recovery, incident escalation, cost reporting and policy exception flow.
- Use findings to change the platform backlog.

Phase 4, productize vending:

- Offer product lines such as Sandbox, Corp-connected and Online where they match the customer estate.
- Collect structured request data and commit a versioned parameter file or equivalent record.
- Automate subscription creation, management-group placement, access groups, role assignments, budgets, policy, security configuration and connectivity inputs.
- Return status and ownership clearly to the requester.

Phase 5, operate and evolve:

- Give the platform a service owner, backlog, service levels, telemetry and upgrade plan.
- Review Policy and exemptions, platform costs, capacity, limits and product adoption.
- Track upstream Azure landing zone changes and test upgrades before production rollout.

The diagnostic view:

- The five levels in the presentation are a workshop aid, not a Microsoft maturity standard.
- Use them to find the next constraint, not to award a score.
- A customer can be automated in subscription vending but weak in incident operations. Assess capabilities separately.

Benefits to explain honestly:

- Consistent minimum controls across many subscriptions
- Faster environment provisioning through automation
- Clearer ownership, cost and support boundaries
- Lower cognitive load for workload teams
- Repeatable evidence for security and compliance

Tradeoffs to explain honestly:

- Up-front product and automation investment
- A platform team can become a bottleneck if product choices are too narrow
- Central transit and inspection can add cost and latency
- Policy, routing and DNS complexity require lifecycle ownership
- Brownfield adoption needs coexistence, migration and exception handling
- Skills and organizational behavior often change more slowly than infrastructure

Sources:

- [Platform landing zone implementation options](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/deploy-landing-zones-with-terraform)
- [Subscription vending implementation guidance](https://learn.microsoft.com/en-us/azure/architecture/landing-zones/subscription-vending)
- [Automation guidance](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/considerations/automation)

### Slide 21: Discovery questions

Purpose: Help a solution engineer uncover requirements before recommending services.

How to facilitate:

- Ask for an example from the last real workload, not an ideal process description.
- Quantify lead time, volume, cost, incident frequency and exception age.
- Separate the current state, committed constraints and preferences.
- Record who supplied each requirement and who can approve a change.
- Ask what happens when the normal path fails at 02:00.

Follow-up prompts:

- Business outcome: How will the sponsor know the landing zone improved delivery or risk?
- Ownership: Who is paged for a hub route issue, and who is allowed to fix it?
- Vending: Which data is required from the requester, and which values can the platform derive?
- Network: Show the current address plan, circuits, DNS forwarding, egress points and public application entry points.
- Inspection: Which traffic requires central inspection because of an explicit risk, and which traffic only needs local segmentation?
- Identity: Which human roles are standing, which are eligible and which workload credentials are stored?
- Evidence: Which log answers the last network or access incident, and how long did it take to find?
- Day 2: How are exceptions expired, platform modules upgraded and shared costs allocated?

Desired discovery outputs:

- Stakeholder and decision map
- Workload archetype inventory
- Data classification and compliance constraints
- Subscription and management-group hypothesis
- Network and DNS dependency map
- Identity and privileged-access baseline
- Management, security and cost telemetry requirements
- Product catalog and vending request schema
- Implementation backlog with a representative pilot

### Slide 22: Five things to remember

Purpose: Compress the session into principles that survive technology changes.

Talk track:

1. The landing zone is an operating model as well as architecture and code.
2. Management groups scale policy. Subscriptions create useful workload boundaries.
3. RBAC answers whether an identity may act. Policy evaluates resource state.
4. Troubleshoot connections in order: DNS, effective route, security decisions, destination listener, return path, then data-plane identity.
5. Central guardrails should enable local ownership. Workarounds are feedback about the platform product.

### Slide 23: Closing

Purpose: End on the customer outcome, not the technology inventory.

Talk track:

- A good platform reduces cognitive load for workload teams without hiding the controls they need to understand.
- The goal is a governed environment with a predictable lead time and a clear support model.
- The platform should make the secure path the easiest supported path.
- The next step is not to deploy every reference component. It is to agree the first decisions and choose a representative pilot.

Close with:

What is the smallest customer workload that can prove the operating model, network path, identity model and governance lifecycle end to end?

## Implementation field checklist

### Before a design workshop

- Identify the executive sponsor, platform product owner and technical decision makers.
- Request the current tenant, billing, subscription and management-group inventory.
- Request the IP plan, network diagrams, route summaries, DNS design, connectivity circuits and public ingress inventory.
- Request the current role-assignment export, privileged-access process and workload identity patterns.
- Request the policy and initiative inventory, exemptions, compliance output and remediation ownership.
- Request platform deployment repositories, pipeline model and current change process.
- Choose two workload examples: one representative and one intentionally different.

### Before recommending a topology

- Classify workloads as connected, online or another justified product line.
- Estimate VNets, branches, regions, circuits, throughput, route count and growth.
- Record custom NVA, protocol, latency, TLS inspection and sovereignty requirements.
- Decide which traffic needs transit inspection and which can connect directly.
- Design DNS and hybrid name resolution with the network, not after it.
- Model availability, route convergence, asymmetry, firewall throughput and SNAT port capacity.
- Estimate peering, Virtual WAN, firewall, logging and egress costs.

### Before a pilot goes live

- Positive and negative DNS tests pass from every required source.
- Effective routes prove forward and return paths.
- NSG, firewall, WAF and service firewall rules match the intended sources and ports.
- Public exposure is intentional and inventoried.
- Human administration uses groups and least privilege.
- Privileged access is eligible or time-bound where required.
- Workload identities and data-plane roles are tested without embedded credentials where supported.
- Policy denial, audit and remediation behavior is tested in a non-production ring.
- Required logs reach the owned monitoring destination and an alert is exercised.
- Backup, recovery and incident escalation are tested.
- Cost ownership and budget alerts are visible.
- The deployment can be repeated from source control.

### Traffic-path validation script for a whiteboard

For each required flow, write down:

1. Source identity and source IP or subnet
2. Destination FQDN, resolved address and port
3. Source effective route and next hop
4. Every NSG, firewall, NVA, WAF or service firewall decision
5. Destination listener and data-plane authorization
6. Return route and any NAT behavior
7. Diagnostic evidence and responsible responder

If any line is unknown, the flow is not yet an operational design.

## Essential glossary

- Application landing zone: The governed environment for one workload across its environments and one or more subscriptions.
- Platform landing zone: The shared governance foundation and selected central services operated for many workloads.
- Management group: A scope above subscriptions used mainly for policy and selected platform access.
- Subscription vending: A repeatable process that creates and configures subscriptions or application landing zones for workload teams.
- VNet peering: Direct, non-transitive connectivity between VNets over the Microsoft backbone.
- UDR: A user-defined route associated with a subnet to select a custom next hop.
- BGP: A dynamic routing protocol used by VPN and ExpressRoute scenarios to exchange prefixes.
- NSG: A stateful Layer 3 and Layer 4 allow or deny filter on a subnet or network interface.
- Azure Firewall: A managed, stateful network security service for network, application and DNAT policy.
- WAF: A Layer 7 control for HTTP and HTTPS threats, available on services such as Application Gateway and Front Door.
- Private Endpoint: A network interface with a private IP in a VNet that provides private access to a supported service.
- Azure DNS Private Resolver: A managed service for DNS forwarding between Azure VNets and on-premises networks.
- Microsoft Entra ID: The identity and access directory used by Azure and other Microsoft services.
- Azure RBAC: Azure Resource Manager authorization based on principal, role definition and scope.
- Managed identity: An Azure-managed service principal that lets a supported resource request Entra tokens without an application credential managed by developers.
- Azure Policy: A service that evaluates and can enforce resource configuration and compliance at Azure scopes.
- Initiative: A group of Policy definitions assigned and reported together.
- PIM: Microsoft Entra Privileged Identity Management for eligible and time-bound privileged access.
- Control plane: APIs used to create, configure and manage Azure resources.
- Data plane: APIs and protocols used to access the workload or service data itself.

## Recommended learning path

Read these in order:

1. [What is an Azure landing zone?](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)
2. [Azure landing zone design areas](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas)
3. [Azure landing zone design principles](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-principles)
4. [Management groups](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups)
5. [Hub-spoke network topology](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology)
6. [Virtual WAN network topology](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/virtual-wan-network-topology)
7. [DNS security and private name resolution](https://learn.microsoft.com/en-us/azure/networking/design-guide/dns-security)
8. [Landing zone identity and access management](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/identity-access-landing-zones)
9. [Azure Policy overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
10. [Platform automation and DevOps](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/platform-automation-devops)
11. [Subscription vending implementation guidance](https://learn.microsoft.com/en-us/azure/architecture/landing-zones/subscription-vending)
12. [AZ-305: Design identity, governance and monitor solutions](https://learn.microsoft.com/en-us/training/paths/design-identity-governance-monitor-solutions/)

Use the [AZ-305 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305) as a skills checklist for the broader solution architect role. It covers identity, governance, monitoring, business continuity, infrastructure and network design beyond landing zones.
