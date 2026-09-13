import assert from "node:assert/strict";
import test from "node:test";
import { calculateExperienceDuration } from "../src/lib/experienceDuration.ts";

const september2026 = new Date(2026, 8, 12);

test("calculates an ongoing experience through the current month", () => {
  assert.equal(calculateExperienceDuration("10/2025", "Now", september2026), "1 year");
});

test("calculates a fixed range using inclusive calendar months", () => {
  assert.equal(calculateExperienceDuration("08/2026", "11/2026", september2026), "4 months");
});

test("formats combined years and months", () => {
  assert.equal(calculateExperienceDuration("12/2024", "02/2026", september2026), "1 year 3 months");
});

test("treats the same start and end month as one month", () => {
  assert.equal(calculateExperienceDuration("09/2026", "09/2026", september2026), "1 month");
});

test("waits for the client reference date before calculating Now", () => {
  assert.equal(calculateExperienceDuration("10/2025", "Now", null), null);
});

test("returns readable validation messages for invalid values", () => {
  assert.equal(calculateExperienceDuration("[START]", "Now", september2026), "Check start date");
  assert.equal(calculateExperienceDuration("12/2026", "11/2026", september2026), "Invalid date range");
});
