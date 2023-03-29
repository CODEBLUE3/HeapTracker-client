import BarNode from "./BarNode";

const X_PADDING = 25;
const Y_PADDING = 70;
const TOP_PADDING = 15;
const VIEW_NODE_COUNT = 10;
const Y_TICK_COUNT = 7;

export default class LineChart {
  constructor(id, modalCallback, theme) {
    this.canvas = document.getElementById(id);

    if (!this.canvas) return null;

    this.data = [];
    this.barNodes = [];
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "0.7rem Arial";

    this.chartWidth = this.canvas.width - Y_PADDING - 5;
    this.chartHeight = this.canvas.height - TOP_PADDING - X_PADDING;

    this.excuteDurationTime = 0;
    this.currentPosition = 0;

    this.maxMemoryText = 0;
    this.minMemoryText = Infinity;
    this.maxMemoryValue = 0;
    this.minMemoryValue = Infinity;
    this.heightPixelWeights = 0;

    this.checkNodeHover = modalCallback;

    this.runTime = 0;

    this.minGap = Infinity;

    this.backgroundColor = theme.boxBackground;
    this.gridColor = theme.gridLine;
    this.lineColor = theme.borderLine;
    this.textColor = theme.unitText;
    this.nodeColor = theme.chartDot;
    this.nodeHoverColor = theme.chartDotHover;

    this.canvas.addEventListener("mousemove", (e) => {
      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      if (
        this.data.length > 0 &&
        cursorPositionX > Y_PADDING &&
        cursorPositionY < this.chartHeight + TOP_PADDING
      ) {
        this.checkNodeHover(false);

        this.barNodes.forEach((node) => {
          if (node.isMouseOver(cursorPositionX, cursorPositionY)) {
            const chartModalData = {
              codeCount: node.data.count,
              codeType: node.data.codeType,
              codePosition: node.data.codePosition,
              usedMemory: node.data.usedMemory,
              timeStamp: node.data.timeStamp,
            };
            const chartModalStyles = {
              visibility: true,
              top: e.pageY,
              left: e.pageX,
            };

            this.checkNodeHover(true, chartModalData, chartModalStyles);
            node.draw(this.nodeHoverColor);
          } else {
            node.draw(this.nodeColor);
          }
        });
      }
    });

    return this;
  }

  drawChart = () => {
    const { ctx, canvas, chartHeight, chartWidth } = this;

    /**
     * 이전 차트 삭제
     */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = this.gridColor.defalutChartLine;
    ctx.moveTo(Y_PADDING, TOP_PADDING);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.stroke();

    /**
     * y 기준 축
     */
    ctx.beginPath();

    const yInterval =
      (this.maxMemoryValue - this.minMemoryValue) / Y_TICK_COUNT;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.textColor;

    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval);
      const yPoint =
        chartHeight - i * (chartHeight / Y_TICK_COUNT) + TOP_PADDING;
      ctx.fillText(value ? value : 0, Y_PADDING - 3, yPoint);

      ctx.strokeStyle = this.gridColor;
      ctx.moveTo(Y_PADDING, yPoint);
      ctx.lineTo(Y_PADDING + canvas.width, yPoint);
      ctx.stroke();
    }

    /**
     * y축 좌측 생략
     */
    ctx.save();
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvas.height);
    ctx.clip();

    ctx.beginPath();
    ctx.strokeStyle = this.lineColor;
    ctx.moveTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.lineTo(canvas.width, chartHeight + TOP_PADDING);
    ctx.stroke();

    /**
     * x축 : ns를 기준
     */
    ctx.beginPath();

    for (let index = 0; index < VIEW_NODE_COUNT; index += 1) {
      const xPosition = (this.chartWidth / VIEW_NODE_COUNT) * (index + 1);

      const x_guideValue = Math.floor(
        (this.runTime / VIEW_NODE_COUNT) * (index + 1),
      );

      ctx.fillStyle = this.textColor;
      ctx.fillText(
        x_guideValue ? x_guideValue : 0,
        xPosition + Y_PADDING,
        chartHeight + TOP_PADDING + 10,
      );
    }

    /**
     * bar 만들기
     */
    this.barNodes = this.data.map((node, index) => {
      const startX =
        (this.chartWidth / this.data[this.data.length - 1].timeStamp) *
          node.timeStamp +
        Y_PADDING;
      const startY = this.chartHeight + TOP_PADDING;
      const width =
        Math.floor(this.minGap) /
        Math.floor(this.data[this.data.length - 1].timeStamp / this.chartWidth);
      const height =
        this.heightPixelWeights * (node.usedMemory - this.baseMemory);

      return new BarNode(startX, startY, width, height, ctx, node);
    });

    this.barNodes.forEach((node, index) => {
      setTimeout(() => node.draw(this.nodeColor), 30 * index);
    });

    ctx.stroke();
    ctx.restore();

    return this;
  };

  setData = (data, durationTime) => {
    this.data = [...data];

    if (!this.data.length) return;

    this.maxMemoryText = 0;
    this.minMemoryText = Infinity;
    this.maxMemoryValue = 0;
    this.minMemoryValue = Infinity;
    this.heightPixelWeights = 0;

    this.baseMemory = this.data[0].usedMemory;
    this.chartDurationTime = durationTime;
    this.excuteDurationTime = this.data.length;

    this.xDistance =
      this.data[this.data.length - 1].timeStamp / this.data.length;

    this.data.forEach((item) => {
      this.minMemoryText = Math.min(this.minMemoryText, item.usedMemory);
      this.maxMemoryText = Math.max(this.maxMemoryText, item.usedMemory);
    });

    this.data.forEach((item) => {
      this.minMemoryValue = Math.min(this.minMemoryValue, item.usedMemory);
      this.maxMemoryValue = Math.max(this.maxMemoryValue, item.usedMemory);
    });

    this.heightPixelWeights =
      (this.chartHeight - Y_PADDING) /
      (this.maxMemoryValue - this.minMemoryValue);

    this.runTime =
      (this.data[this.data.length - 1].timeStamp - this.data[0].timeStamp) /
      1000;

    for (let i = 0; i < this.data.length - 1; i += 1) {
      this.minGap = Math.min(
        this.minGap,
        this.data[i + 1].timeStamp - this.data[i].timeStamp,
      );
    }

    this.drawChart();
  };

  setColor = (theme) => {
    this.backgroundColor = theme.boxBackground;
    this.gridColor = theme.gridLine;
    this.lineColor = theme.borderLine;
    this.textColor = theme.unitText;
    this.nodeColor = theme.chartDot;
    this.nodeHoverColor = theme.chartDotHover;

    return this;
  };
}
