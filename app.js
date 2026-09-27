// app.js：渲染结果（返回结构固定九个键，不可增删改）
import { settle } from "./carry.js";
import { planBatches } from "./budget.js";

export function render(spec) {
  const limit = Number.isInteger(spec.carry_max) ? spec.carry_max : 0;
  const batches = Array.isArray(spec.batches) ? spec.batches : [];
  const view = planBatches(spec);
  const overs = view.over_positions;
  return {
    carry_end: view.carry_end,
    wasted_total: view.wasted_total,
    overdrafts: view.overdrafts,
    over_positions: overs,
    first_over_at: overs.length ? overs[0] : 0,
    used_total: view.used_total,
    count: batches.length,
    carry_ok: view.carry_end >= 0 && view.carry_end <= limit,
    tail: settle(10, 3, 0, 6).carry
  };
}
