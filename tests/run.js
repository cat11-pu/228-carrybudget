import assert from "node:assert";
import { settle } from "../carry.js";
import { planBatches } from "../budget.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("settle returns a carry", () => {
  assert.strictEqual(typeof settle(10, 3, 0, 6).carry, "number");
});

check("settle returns a flag", () => {
  assert.strictEqual(typeof settle(10, 3, 0, 6).over, "boolean");
});

check("planBatches returns over positions", () => {
  assert.ok(Array.isArray(planBatches({ capacity: 1, carry_max: 0, batches: [] }).over_positions));
});

check("render counts batches", () => {
  assert.strictEqual(typeof render({ capacity: 1, carry_max: 0, batches: [] }).count, "number");
});

check("render exposes carry flag", () => {
  assert.strictEqual(typeof render({ capacity: 1, carry_max: 0, batches: [] }).carry_ok, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
