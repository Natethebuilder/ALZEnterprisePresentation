import type { ComponentType } from 'react';
import { S01Title, S02HowToRead, S03Metaphor, S04SectionHierarchy, S05Hierarchy } from './part1_foundation';
import {
  S06SectionNetwork, S07VNetSubnets, S08NSGvsFirewall, S09RoutesDNS, S10HubSpoke,
} from './part2_networking';
import { SlideCityWalkthrough } from './interactive_city';
import {
  S12SectionIdentity, S13EntraAndIdentities, S14RBAC, S15RBACvsPolicy,
} from './part3_identity';
import {
  S16SectionGovernance, S17Policy, S18Ownership, S19OperatingModel,
} from './part4_governance';
import { S20Roadmap, S21Discovery, S22FiveThings, S23Closing } from './part5_closing';

export interface AzureSlide {
  component: ComponentType;
  /** Shown in the sidebar, the overview grid and the presenter view. */
  name: string;
  /** Broad layout family, used for grouping and future template work. */
  template: string;
  /** True when the slide has controls the presenter is expected to click. */
  interactive?: boolean;
}

/**
 * The deck, in order.
 *
 * 23 slides across four sections. Each slide makes exactly one point; where two
 * ideas only make sense together (NSG and firewall, routes and DNS, policy
 * effects and their examples) they share a slide rather than repeating each
 * other across two.
 */
export const azureSlides: AzureSlide[] = [
  { component: S01Title,             name: 'Title',                     template: 'title' },
  { component: S02HowToRead,         name: 'Platform and workload landing zones', template: 'intro' },
  { component: S03Metaphor,          name: 'Azure is a city',           template: 'grid', interactive: true },

  { component: S04SectionHierarchy,  name: '§ Where things live',       template: 'section' },
  { component: S05Hierarchy,         name: 'The hierarchy',             template: 'explorer', interactive: true },

  { component: S06SectionNetwork,    name: '§ How they communicate',    template: 'section' },
  { component: S07VNetSubnets,       name: 'VNet & subnets',            template: 'diagram' },
  { component: S08NSGvsFirewall,     name: 'NSG vs Azure Firewall',     template: 'comparison' },
  { component: S09RoutesDNS,         name: 'Routes & DNS',              template: 'comparison' },
  { component: S10HubSpoke,          name: 'Enterprise topology',       template: 'diagram', interactive: true },
  { component: SlideCityWalkthrough, name: 'City walkthrough (3D)',     template: 'interactive', interactive: true },

  { component: S12SectionIdentity,   name: '§ Who controls what',       template: 'section' },
  { component: S13EntraAndIdentities, name: 'Entra ID & identities',    template: 'comparison' },
  { component: S14RBAC,              name: 'RBAC & scope',              template: 'explorer', interactive: true },
  { component: S15RBACvsPolicy,      name: 'RBAC vs Policy',            template: 'comparison' },

  { component: S16SectionGovernance, name: '§ Governance & operations', template: 'section' },
  { component: S17Policy,            name: 'Azure Policy effects',      template: 'explorer', interactive: true },
  { component: S18Ownership,         name: 'Ownership contract',        template: 'table' },
  { component: S19OperatingModel,    name: 'Operating model',           template: 'spectrum', interactive: true },
  { component: S20Roadmap,           name: 'Roadmap & maturity',        template: 'timeline', interactive: true },
  { component: S21Discovery,         name: 'Discovery questions',       template: 'list' },
  { component: S22FiveThings,        name: 'Five things to remember',   template: 'list' },
  { component: S23Closing,           name: 'Closing',                   template: 'closing' },
];
