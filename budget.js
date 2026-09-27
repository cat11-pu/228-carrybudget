// budget.js：整批结转（基线：一律给零）
import { settle } from "./carry.js";

export function planBatches(spec) {
  return { carry_end: 0, wasted_total: 0, overdrafts: 0, over_positions: [], used_total: 0 };
}
