// budget.js：整批结转，一次扫描，每批只结算一次
import { settle } from "./carry.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function planBatches(spec) {
  const capacity = spec.capacity;
  const limit = spec.carry_max;
  const batches = Array.isArray(spec.batches) ? spec.batches : [];

  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw fail("E_BAD_CAPACITY", "capacity must be a positive integer");
  }
  if (!Number.isInteger(limit) || limit < 0) {
    throw fail("E_BAD_LIMIT", "carry limit must be a non-negative integer");
  }

  let carry = 0;
  let wastedTotal = 0;
  let overdrafts = 0;
  let usedTotal = 0;
  const overPositions = [];

  for (let index = 0; index < batches.length; index += 1) {
    const used = batches[index];
    if (!Number.isInteger(used) || used < 0) {
      throw fail("E_BAD_USED", "used must be a non-negative integer");
    }
    const result = settle(capacity, limit, carry, used);
    carry = result.carry;
    wastedTotal += result.wasted;
    usedTotal += used;
    if (result.over) {
      overdrafts += 1;
      overPositions.push(index + 1);
    }
  }

  return {
    carry_end: carry,
    wasted_total: wastedTotal,
    overdrafts: overdrafts,
    over_positions: overPositions,
    used_total: usedTotal
  };
}
