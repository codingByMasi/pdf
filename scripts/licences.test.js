// Tests for the licence list: every shipped package is listed and none uses a licence that is not allowed.
import { describe, expect, it } from 'vitest';
import { SHIPPED, collectLicences, renderLicences } from './licences.js';

const BLOCKED = /GPL|AGPL|LGPL|SSPL|Commons Clause|CC-BY-NC|NonCommercial|UNLICENSED/i;

describe('licences', () => {
  const entries = collectLicences();
  it('lists every shipped package with some licence text', () => {
    expect(entries.length).toBeGreaterThanOrEqual(SHIPPED.length);
    for (const e of entries) expect(e.text.length).toBeGreaterThan(20);
  });
  it('has no blocked licence', () => {
    for (const e of entries) expect(e.licence, e.name).not.toMatch(BLOCKED);
  });
  it('writes a readable text file', () => {
    expect(renderLicences(entries)).toContain('pdf-lib');
  });
});
