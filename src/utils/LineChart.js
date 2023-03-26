import ChartNode from "./ChartNode";
import { color } from "../styles/styleCode";

const X_PADDING = 25;
const Y_PADDING = 70;
const TOP_PADDING = 15;
const VIEW_NODE_COUNT = 13;
const Y_TICK_COUNT = 7;
const NODE_RADIUS = 4;
const CHART_MARGIN_NODE = 5;

export default class LineChart {
  constructor(id, modalCallback) {
    this.canvas = document.getElementById(id);

    if (!this.canvas) return null;

    this.data = [];
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "0.7rem Arial";

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

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.intervalID) return;

      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

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
            node.draw(color.chartDotHover);
          } else {
            node.draw(color.chartDot);
          }
        });
      }
    });

    return this;
  }

  setData = (data, durationTime) => {
    if (!this.canvas) return;

    this.data = [...data];

    if (!this.data.length) return;

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
    clearInterval(this.intervalID);
    this.intervalID = 0;
  };

  stop = () => {
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.currentPosition = 0;
    this.snapshotNodes.length = 0;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight - X_PADDING);
  };

  drawChart = () => {
    const { ctx, canvas, chartHeight, chartWidth } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = color.defalutChartLine;
    ctx.moveTo(Y_PADDING, TOP_PADDING);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.stroke();

    const yInterval =
      (this.maxMemoryValue - this.minMemoryValue) / Y_TICK_COUNT;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    ctx.beginPath();
    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);
      ctx.fillText(value ? value : 0, Y_PADDING - 3, yPoint - TOP_PADDING);

      ctx.strokeStyle = color.defalutGridLine;
      ctx.moveTo(Y_PADDING, yPoint - TOP_PADDING);
      ctx.lineTo(Y_PADDING + canvas.width, yPoint - TOP_PADDING);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = color.defalutChartLine;
    ctx.moveTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.lineTo(canvas.width, chartHeight + TOP_PADDING);
    ctx.stroke();

    /* Y축 좌측으로 노드가
    그려지지 않게 함 */
    ctx.save();
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvas.height);
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
          this.chartHeight -
          TOP_PADDING -
          this.heightPixelWeights * (item.usedMemory - this.baseMemory);

        return new ChartNode(xPosition, yPosition, NODE_RADIUS, ctx, item);
      });

    this.snapshotNodes.forEach((node, index) => {
      const xPosition = node.x;
      const yPosition = node.y;

      ctx.lineTo(xPosition, yPosition);
      ctx.stroke();
      ctx.save();

      ctx.moveTo(xPosition, yPosition);
      node.draw(color.chartDot);
    });

    /* x축 좌표 ns 표현 */
    for (let index = 0; index < VIEW_NODE_COUNT; index += 1) {
      const xPosition = (this.chartWidth / VIEW_NODE_COUNT) * (index + 1);

      const x_guideValue = Math.floor(
        (this.xDistance * this.currentPosition + this.xDistance * index) / 1000,
      );
      ctx.fillStyle = "black";
      ctx.fillText(
        x_guideValue ? x_guideValue : 0,
        xPosition + 40,
        chartHeight + TOP_PADDING + 10,
      );
    }

    ctx.stroke();
    ctx.restore();
    return this;
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
}
