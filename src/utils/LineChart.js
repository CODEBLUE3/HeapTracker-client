import ChartNode from "./ChartNode";

const X_PADDING = 25;
const Y_PADDING = 70;
const TOP_PADDING = 15;
const NODE_FLOAT_OFFSET = 10;
const VIEW_NODE_COUNT = 13;
const Y_TICK_COUNT = 7;
const NODE_RADIUS = 4;
const CHART_MARGIN_NODE = 5;

export default class LineChart {
  constructor(id, modalCallback, theme) {
    this.canvas = document.getElementById(id);

    if (!this.canvas) return null;

    this.data = [];
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "0.8rem Arial";

    this.chartWidth = this.canvas.width;
    this.chartHeight = this.canvas.height - X_PADDING - TOP_PADDING;

    this.excuteDurationTime = 0;
    this.intervalID = 0;
    this.currentPosition = 0;

    this.maxMemoryText = 0;
    this.minMemoryText = Infinity;
    this.maxMemoryValue = 0;
    this.minMemoryValue = Infinity;
    this.heightPixelWeights = 0;

    this.snapshotNodes = [];
    this.checkNodeHover = modalCallback;

    this.backgroundColor = theme.boxBackground;
    this.gridColor = theme.gridLine;
    this.lineColor = theme.borderLine;
    this.textColor = theme.unitText;
    this.nodeLineColor = theme.nodeLine;
    this.nodeColor = theme.chartDot;
    this.nodeHoverColor = theme.chartDotHover;

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.intervalID) return;

      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      this.ctx.beginPath();
      this.ctx.rect(Y_PADDING, 0, this.chartWidth, this.canvas.height);
      this.ctx.save();
      this.ctx.clip();

      if (
        this.snapshotNodes.length > 0 &&
        cursorPositionX > Y_PADDING &&
        cursorPositionY < this.chartHeight + TOP_PADDING
      ) {
        this.checkNodeHover(false);

        this.snapshotNodes.forEach((node) => {
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

      this.ctx.restore();
    });

    return this;
  }

  setData = (data, durationTime) => {
    if (!this.canvas) return;

    this.data = [...data];

    if (!this.data.length) return;

    this.minMemoryText = Infinity;
    this.maxMemoryText = 0;
    this.minMemoryValue = Infinity;
    this.maxMemoryValue = 0;

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
      this.chartHeight / (this.maxMemoryValue - this.minMemoryValue);
  };

  setCodeData = (codeData) => {
    if (!this.canvas) return;
  };

  playback = () => {
    if (!this.data) return;
    if (!this.data.length) return;

    if (this.intervalID < 1) {
      this.snapshotNodes = [];

      this.intervalID = setInterval(() => {
        this.updateData();
      }, this.chartDurationTime / this.excuteDurationTime);
    }
  };

  pause = () => {
    this.ctx.restore();
    clearInterval(this.intervalID);
    this.intervalID = 0;
  };

  stop = () => {
    this.ctx.restore();
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.currentPosition = 0;
    this.snapshotNodes.length = 0;
    this.ctx.clearRect(
      Y_PADDING,
      0,
      this.canvasWidth,
      this.canvasHeight - X_PADDING,
    );
  };

  drawChart = () => {
    const { ctx, canvas, chartHeight, chartWidth } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = this.lineColor;

    ctx.moveTo(Y_PADDING, TOP_PADDING - NODE_FLOAT_OFFSET);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.stroke();

    const yInterval =
      (this.maxMemoryValue - this.minMemoryValue) / Y_TICK_COUNT;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    ctx.strokeStyle = this.gridColor;

    for (let i = 0; i <= Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);

      ctx.fillText(
        value ? value : 0,
        Y_PADDING - 3,
        yPoint - NODE_FLOAT_OFFSET,
      );

      ctx.moveTo(Y_PADDING, yPoint - NODE_FLOAT_OFFSET);
      ctx.lineTo(Y_PADDING + canvas.width, yPoint - NODE_FLOAT_OFFSET);
    }

    ctx.stroke();

    ctx.strokeStyle = this.lineColor;
    ctx.moveTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.lineTo(canvas.width, chartHeight + TOP_PADDING);
    ctx.stroke();

    /* Y축 좌측으로 노드가
    그려지지 않게 함 */
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvas.height);
    ctx.save();
    ctx.clip();

    ctx.beginPath();

    const offset = 25;
    this.snapshotNodes = this.data
      .filter(
        (item) =>
          item.timeStamp >
            this.xDistance * (this.currentPosition - CHART_MARGIN_NODE) &&
          item.timeStamp <
            this.xDistance *
              (this.currentPosition + VIEW_NODE_COUNT + CHART_MARGIN_NODE),
      )
      .map((item) => {
        const xPosition =
          (this.chartWidth / (this.xDistance * VIEW_NODE_COUNT)) *
            item.timeStamp -
          (this.chartWidth / VIEW_NODE_COUNT) * this.currentPosition +
          offset;
        const yPosition =
          this.chartHeight +
          5 -
          this.heightPixelWeights * (item.usedMemory - this.baseMemory);

        return new ChartNode(xPosition, yPosition, NODE_RADIUS, ctx, item);
      });

    ctx.beginPath();
    ctx.strokeStyle = this.nodeLineColor;

    this.snapshotNodes.forEach((node, index) => {
      const xPosition = node.x;
      const yPosition = node.y;

      ctx.lineTo(xPosition, yPosition);
      ctx.stroke();

      ctx.moveTo(xPosition, yPosition);
      node.draw(this.nodeColor);
    });

    ctx.fillStyle = this.textColor;
    for (let index = 0; index < VIEW_NODE_COUNT; index += 1) {
      const xPosition = (this.chartWidth / VIEW_NODE_COUNT) * (index + 1);

      const x_guideValue = Math.floor(
        (this.xDistance * this.currentPosition + this.xDistance * index) / 1000,
      );
      ctx.fillText(
        x_guideValue ? x_guideValue : 0,
        xPosition + 40,
        chartHeight + TOP_PADDING + 10,
      );
    }

    ctx.restore();

    return this;
  };

  drawClear = () => {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  updateData = () => {
    if (!this.data.length) return;

    this.drawChart();
    this.currentPosition += 1;

    if (this.currentPosition + VIEW_NODE_COUNT / 2 > this.data.length) {
      clearInterval(this.intervalID);
      this.intervalID = 0;
      this.currentPosition = 0;
    }
  };

  isPlay = () => {
    if (this.intervalID) {
      return true;
    }
    return false;
  };

  setColor = (theme) => {
    this.backgroundColor = theme.boxBackground;
    this.gridColor = theme.gridLine;
    this.lineColor = theme.borderLine;
    this.textColor = theme.unitText;
    this.nodeLineColor = theme.nodeLine;
    this.nodeColor = theme.chartDot;
    this.nodeHoverColor = theme.chartDotHover;

    return this;
  };

  setLineColor = (color) => {
    this.nodeColor = color;
    this.nodeLineColor = color;

    return this;
  };
}
