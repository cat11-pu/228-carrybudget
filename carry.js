// carry.js：结算一批
// 可用 = 配额 + 上批结转；用量不超可用时按上限结转、剩余作废；
// 用量超过可用则欠账，结转清零、不作废。
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function settle(capacity, limit, carry, used) {
  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw fail("E_BAD_CAPACITY", "capacity must be a positive integer");
  }
  if (!Number.isInteger(limit) || limit < 0) {
    throw fail("E_BAD_LIMIT", "carry limit must be a non-negative integer");
  }
  if (!Number.isInteger(used) || used < 0) {
    throw fail("E_BAD_USED", "used must be a non-negative integer");
  }
  const available = capacity + carry;
  if (used > available) {
    return { carry: 0, wasted: 0, over: true };
  }
  const remaining = available - used;
  const next = Math.min(remaining, limit);
  return { carry: next, wasted: remaining - next, over: false };
}
