// budget.js：整批结转，一次扫描，每批只算一次。
import { settle, validateCapacity, validateLimit, validateUsed } from "./carry.js";

export function planBatches(spec) {
  const capacity = spec.capacity;
  const limit = spec.carry_max;
  const batches = spec.batches || [];
  validateCapacity(capacity);
  validateLimit(limit);
  let carry = 0;
  let wastedTotal = 0;
  let usedTotal = 0;
  const overPositions = [];
  for (let index = 0; index < batches.length; index += 1) {
    const used = batches[index];
    validateUsed(used);
    usedTotal += used;
    const step = settle(capacity, limit, carry, used);
    carry = step.carry;
    wastedTotal += step.wasted;
    if (step.over) overPositions.push(index + 1);
  }
  return { carry_end: carry, wasted_total: wastedTotal, overdrafts: overPositions.length,
           over_positions: overPositions, used_total: usedTotal };
}
