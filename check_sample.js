import fs from "node:fs";
import { settle } from "./carry.js";
import { planBatches } from "./budget.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/batches.json", "utf8"));
const view = render(spec);

emit("收尾结转 =", view.carry_end);
emit("作废额度合计 =", view.wasted_total);
emit("欠账批数 =", view.overdrafts);
emit("欠账位置列表 =", JSON.stringify(view.over_positions));
emit("首次欠账位置 =", view.first_over_at);
emit("用量合计 =", view.used_total);
emit("批次条数 =", view.count);
emit("结转复核 =", view.carry_ok);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  planBatches({ capacity: 0, carry_max: 1, batches: [] });
  emit("配额写错的错误码", "没有报错");
} catch (error) {
  emit("配额写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  planBatches({ capacity: 4, carry_max: -1, batches: [] });
  emit("上限写错的错误码", "没有报错");
} catch (error) {
  emit("上限写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  planBatches({ capacity: 4, carry_max: 1, batches: [-2] });
  emit("用量写错的错误码", "没有报错");
} catch (error) {
  emit("用量写错的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "收尾结转": 3,
  "作废额度合计": 7,
  "欠账批数": 1,
  "欠账位置列表": [
    3
  ],
  "首次欠账位置": 3,
  "用量合计": 31,
  "批次条数": 4,
  "结转复核": true,
  "配额写错的错误码": "E_BAD_CAPACITY",
  "上限写错的错误码": "E_BAD_LIMIT",
  "用量写错的错误码": "E_BAD_USED"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
