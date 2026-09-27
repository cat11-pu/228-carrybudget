// app.js：渲染结果
import { settle } from "./carry.js";
import { planBatches } from "./budget.js";

export function render(spec) {
  const capacity = spec.capacity || 0;
  const limit = spec.carry_max || 0;
  const batches = spec.batches || [];
  const view = planBatches(spec);
  const carry = view.carry_end || 0;
  const overs = view.over_positions || [];
  return { carry_end: carry, wasted_total: view.wasted_total || 0,
           overdrafts: view.overdrafts || 0, over_positions: overs,
           first_over_at: overs.length ? overs[0] : 0, used_total: view.used_total || 0,
           count: batches.length, carry_ok: carry >= 0 && carry <= limit,
           tail: settle(10, 3, 0, 6).carry };
}
