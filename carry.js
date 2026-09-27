// carry.js：结算一批。可用 = 配额 + 上批结转；用量不超可用时结转取剩余与上限的较小者，
// 超出上限的部分作废；用量超过可用时记欠账，结转清零。
function bad(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function validateCapacity(capacity) {
  if (!Number.isInteger(capacity) || capacity <= 0) throw bad("E_BAD_CAPACITY", "capacity must be a positive integer");
}

export function validateLimit(limit) {
  if (!Number.isInteger(limit) || limit < 0) throw bad("E_BAD_LIMIT", "carry limit must be a non-negative integer");
}

export function validateUsed(used) {
  if (!Number.isInteger(used) || used < 0) throw bad("E_BAD_USED", "used must be a non-negative integer");
}

export function settle(capacity, limit, carry, used) {
  validateCapacity(capacity);
  validateLimit(limit);
  validateUsed(used);
  const available = capacity + carry;
  if (used > available) return { carry: 0, wasted: 0, over: true };
  const rest = available - used;
  const next = Math.min(rest, limit);
  return { carry: next, wasted: rest - next, over: false };
}
