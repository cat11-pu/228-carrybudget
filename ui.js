// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "配额 " + (spec.capacity || 0) + "，结转上限 " + (spec.carry_max || 0)
    + "，批次 " + (spec.batches || []).length + " 批。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (spec.batches || []).forEach(function (used, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "第 " + (spot + 1) + " 批 用 " + used;
      row.appendChild(head);
      const bar = document.createElement("span");
      bar.className = "bar";
      const fill = document.createElement("i");
      fill.style.width = Math.min(100, used * 6) + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      const mark = document.createElement("span");
      const over = (view.over_positions || []).indexOf(spot + 1) !== -1;
      mark.className = "chip" + (over ? " bad" : " ok");
      mark.textContent = over ? "欠账" : "在配额内";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "收尾结转 " + view.carry_end + "，作废额度合计 " + view.wasted_total
      + "，欠账 " + view.overdrafts + " 批";
    parts.log.textContent = view.count + " 批，" + (view.carry_ok ? "结转合法" : "结转不合法");
  }

  const usedInput = document.createElement("input");
  usedInput.type = "number";
  usedInput.value = "7";
  parts.controls.appendChild(usedInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "算结转";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一批";
  addButton.addEventListener("click", function () {
    const used = Number(usedInput.value);
    spec.batches = (spec.batches || []).concat([Number.isFinite(used) ? used : 0]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一批";
  dropButton.addEventListener("click", function () {
    spec.batches = (spec.batches || []).slice(0, Math.max(0, (spec.batches || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const limitButton = document.createElement("button");
  limitButton.textContent = "结转上限加一";
  limitButton.addEventListener("click", function () {
    spec.carry_max = (spec.carry_max || 0) + 1;
    draw();
  });
  parts.controls.appendChild(limitButton);

  draw();
}
