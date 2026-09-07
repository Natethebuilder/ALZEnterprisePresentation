import { describe, expect, it } from 'vitest';
import { NODES, SCENARIOS } from '../slides/azure/city3d/scenarios';

describe('Azure landing zone walkthrough data', () => {
  it('keeps every scenario connected to valid city nodes', () => {
    expect(new Set(SCENARIOS.map((scenario) => scenario.id)).size).toBe(SCENARIOS.length);

    for (const scenario of SCENARIOS) {
      expect(scenario.hops.length).toBeGreaterThan(1);
      expect(scenario.hops[0].status).toBe('start');

      for (const hop of scenario.hops) {
        expect(NODES[hop.node], `${scenario.id}: missing node ${hop.node}`).toBeDefined();
        if (hop.from) {
          expect(NODES[hop.from], `${scenario.id}: missing source ${hop.from}`).toBeDefined();
        }
        if (hop.flow === 'lookup') {
          expect(hop.from, `${scenario.id}: lookup needs an explicit source`).toBeDefined();
        }
      }
    }
  });

  it('models lookup, ingress, egress and denial as distinct decisions', () => {
    const eastWest = SCENARIOS.find((scenario) => scenario.id === 'east-west');
    const ingress = SCENARIOS.find((scenario) => scenario.id === 'ingress');
    const denied = SCENARIOS.find((scenario) => scenario.id === 'blocked');

    expect(eastWest?.hops.some((hop) => hop.flow === 'lookup')).toBe(true);
    expect(ingress?.hops.some((hop) => hop.node === 'appGateway')).toBe(true);
    expect(denied?.hops.at(-1)?.node).toBe('firewall');
    expect(denied?.hops.at(-1)?.status).toBe('deny');
  });

  it('contains no en dash or em dash characters', () => {
    expect(JSON.stringify({ NODES, SCENARIOS })).not.toMatch(/[\u2013\u2014]/);
  });
});
