import ChartNode from "./ChartNode";
import { color } from "../styles/styleCode";

const X_PADDING = 25;
const Y_PADDING = 50;
const TOP_PADDING = 15;
const VIEW_NODE_COUNT = 13;
const Y_TICK_COUNT = 7;
const NODE_RADIUS = 4;
const CHART_MARGIN_NODE = 5;

export default class LineChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_PADDING;
    this.chartHeight = this.canvasHeight - X_PADDING - TOP_PADDING;

    this.excuteDurationTime = 0;
    this.intervalID = 0;
    this.currentPosition = 0;

    this.maxMemoryText = 0;
    this.minMemoryText = Infinity;
    this.maxMemoryValue = 0;
    this.minMemoryValue = Infinity;
    this.heightPixelWeights = 0;

    this.snapshotNodes = [];
    this.removeCodeTypeArray = ["Statement", "Declaration", "Expression"];

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.intervalID) return;

      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      if (
        this.snapshotNodes.length > 0 &&
        cursorPositionX > Y_PADDING &&
        cursorPositionY < this.chartHeight + TOP_PADDING
      ) {
        this.snapshotNodes.forEach((node) => {
          if (node.isMouseOver(cursorPositionX, cursorPositionY)) {
            const modal = document.getElementById(`${node.modal.id}`);

            modal.style.visibility = "visible";
            modal.style.position = "absolute";
            modal.style.left = e.pageX + "px";
            modal.style.top = e.pageY + "px";
            modal.style.backgroundColor = `${color.chartModal}`;
            modal.style.borderRadius = "10px";
            modal.style.padding = "10px 20px";
            modal.style.fontSize = "1rem";
            modal.innerText = `${node.data.count}th node
            ${
              node.data.codeType
                ? `Type : ` +
                  this.removeCodeTypeArray
                    .map((type) => {
                      if (node.data.codeType.includes(type)) {
                        return node.data.codeType.replace(type, "");
                      }
                    })
                    .filter((node) => node)
                : `Code Position : ` + node.data.codePosition
            }
            Used Memory : ${node.data.usedMemory}
            Time : ${Math.floor(Number(node.data.timeStamp)) / 1000} us`;

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
    if (this.intervalID < 1) {
      this.snapshotNodes.forEach((node) => {
        node.clearModal();
      });
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
    const { ctx, canvasWidth, canvasHeight, chartHeight, chartWidth } = this;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.strokeStyle = color.defalutChartLine;
    ctx.moveTo(Y_PADDING, TOP_PADDING);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.stroke();

    const yInterval =
      (this.maxMemoryText - this.minMemoryText) / (Y_TICK_COUNT - 1);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    ctx.beginPath();
    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval + this.minMemoryText);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);
      ctx.fillText(value, Y_PADDING - 3, yPoint - TOP_PADDING);

      ctx.strokeStyle = color.defalutGridLine;
      ctx.moveTo(Y_PADDING, yPoint - TOP_PADDING);
      ctx.lineTo(Y_PADDING + canvasWidth, yPoint - TOP_PADDING);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = color.defalutChartLine;
    ctx.moveTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.lineTo(canvasWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    /* Y축 좌측으로 노드가
    그려지지 않게 함 */
    ctx.save();
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvasHeight);
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

      ctx.fillStyle = "black";
      ctx.fillText(
        Math.floor(
          (this.xDistance * this.currentPosition + this.xDistance * index) /
            1000,
        ),
        xPosition,
        chartHeight + TOP_PADDING + 10,
      );
    }

    ctx.stroke();
    ctx.restore();
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
}
