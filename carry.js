// carry.js：结算一批（基线：原样返回、不作废）
export function settle(capacity, limit, carry, used) {
  return { carry: carry, wasted: 0, over: false };
}
