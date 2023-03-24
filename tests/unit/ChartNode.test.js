import ChartNode from "../utils/ChartNode";

describe("ChartNode util test", () => {
  let chartNode;

  beforeEach(() => {
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");
    const data = {
      count: 10,
      totalMemory: 8798208,
      usedMemory: 6970864,
      timeStamp: 207875,
      codePosition: 268,
      codeType: null,
    };

    chartNode = new ChartNode(50, 50, 5, ctx, data);
  });

  describe("draw", () => {
    test("", () => {
      const color = "#ff0000";

      chartNode.draw(color);

      expect(chartNode.ctx.beginPath).toHaveBeenCalledTimes(1);
      expect(chartNode.ctx.arc).toHaveBeenCalledWith(50, 50, 5, 0, 2 * Math.PI);
      expect(chartNode.ctx.fillStyle).toBe("#ff0000");
      expect(chartNode.ctx.fill).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPosition", () => {
    test("x, y 좌표를 반환해야 합니다.", () => {
      const position = chartNode.getPosition();

      expect(position).toEqual({ x: 50, y: 50 });
    });
  });

  describe("clearModal", () => {
    test("띄운 Modal창 초기화", () => {
      const modal = document.createElement("div");

      modal.classList.add("modal");
      document.body.appendChild(modal);
      chartNode.modal = modal;

      chartNode.clearModal();

      expect(document.body.contains(modal)).toBe(false);
      expect(chartNode.modal).toBe(null);
    });
  });

  describe("isMouseOver", () => {
    test("마우스 좌표가 설정한 범위 내에 있으면 true를 반환합니다.", () => {
      const x = 50;
      const y = 50;

      const result = chartNode.isMouseOver(x, y);

      expect(result).toBe(true);
    });

    test("마우스 좌표가 설정한 범위 내에 없으면 false를 반환합니다.", () => {
      const x = 100;
      const y = 100;

      const result = chartNode.isMouseOver(x, y);

      expect(result).toBe(false);
    });
  });
});
