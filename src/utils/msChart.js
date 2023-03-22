import Circle from "./circle";
import { color } from "../styles/styleCode";

const X_PADDING = 25;
const Y_PADDING = 50;
const TOP_PADDING = 15;
const VIEW_NODE_COUNT = 13;
const Y_TICK_COUNT = 7;
const NODE_RADIUS = 2;

export default class LineChart {
  constructor(id, data, durationTime) {
    this.data = [...data];
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.xDistance =
      this.data[this.data.length - 1].timeStamp / this.data.length;
    this.baseMemory = this.data[0].usedMemory;

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_PADDING;
    this.chartHeight = this.canvasHeight - X_PADDING - TOP_PADDING;

    this.chartDurationTime = durationTime;
    this.excuteDurationTime = 0;
    this.intervalID = 0;
    this.currentPosition = 0;

    this.maxMemoryText = 0;
    this.minMemoryText = Infinity;
    this.maxMemoryValue = 0;
    this.minMemoryValue = Infinity;
    this.maxTimeValue = 0;
    this.minTimeValue = Infinity;
    this.heightPixelWeights = 0;
    this.widthPixelWeights = 0;

    this.circle = [];
    this.snapshotCircle = [];

    this.canvas.addEventListener("mousemove", (e) => {
      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      if (
        this.snapshotCircle.length > 0 &&
        cursorPositionX > Y_PADDING &&
        cursorPositionY < this.chartHeight + TOP_PADDING
      ) {
        this.snapshotCircle.forEach((item) => {
          if (item.isMouseOver(cursorPositionX, cursorPositionY)) {
            const modal = document.getElementById(`${item.modal.id}`);

            modal.style.visibility = "visible";
            modal.style.position = "absolute";
            modal.style.left = e.pageX + "px";
            modal.style.top = e.pageY + "px";
            modal.style.backgroundColor = `${color.chartModal}`;
            modal.style.borderRadius = "10px";
            modal.style.padding = "10px 20px";
            modal.innerText = `${item.data.codeType}`;

            item.draw(color.chartDotHover);
          } else {
            item.draw(color.chartDot);
          }
        });
      }
    });
    this.parseMemoryArray();

    return this;
  }

  playback = () => {
    if (this.intervalID < 1) {
      this.intervalID = setInterval(() => {
        this.updateData();
      }, this.chartDurationTime / this.excuteDurationTime);
    }
  };

  pause = () => {
    this.circle.every((item) => item.draw());
    clearInterval(this.intervalID);
    this.intervalID = 0;
  };

  stop = () => {
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.currentPosition = 0;
  };

  setTime = () => {
    this.startTime = this.data[0].timeStamp;
    this.intervalID = setInterval(() => {
      this.updateData();
    }, this.chartDurationTime / this.excuteDurationTime);
  };

  parseMemoryArray = () => {
    if (this.data.length) {
      this.data.forEach((item) => {
        this.minMemoryText = Math.min(this.minMemoryText, item.usedMemory);
        this.maxMemoryText = Math.max(this.maxMemoryText, item.usedMemory);
      });

      this.excuteDurationTime = this.data.length;

      this.data.forEach((item) => {
        this.minMemoryValue = Math.min(this.minMemoryValue, item.usedMemory);
        this.maxMemoryValue = Math.max(this.maxMemoryValue, item.usedMemory);
      });

      this.heightPixelWeights =
        (this.chartHeight - Y_PADDING) /
        (this.maxMemoryValue - this.minMemoryValue);
    }
  };

  drawChart = () => {
    const { ctx, canvasWidth, canvasHeight, chartHeight, chartWidth } = this;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(Y_PADDING, TOP_PADDING);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);

    const yInterval =
      (this.maxMemoryText - this.minMemoryText) / (Y_TICK_COUNT - 1);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval + this.minMemoryText);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);
      ctx.fillText(value, Y_PADDING - 3, yPoint);
    }

    ctx.lineTo(canvasWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    /* Y축 좌측으로 노드가
    그려지지 않게 함 */
    ctx.save();
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvasHeight);
    ctx.clip();

    ctx.beginPath();

    const createCircleInChart = () => {
      const offset = 25;
      const merginNode = 5;
      this.snapshotCircle = this.data
        .filter(
          (item) =>
            item.timeStamp >
              this.xDistance * (this.currentPosition - merginNode) &&
            item.timeStamp <
              this.xDistance *
                (this.currentPosition + VIEW_NODE_COUNT + merginNode),
        )
        .map((item) => {
          const xPosition =
            (this.chartWidth / (this.xDistance * VIEW_NODE_COUNT)) *
              item.timeStamp -
            (this.chartWidth / VIEW_NODE_COUNT) * this.currentPosition +
            offset;
          const yPosition =
            TOP_PADDING +
            this.chartHeight -
            this.heightPixelWeights * (item.usedMemory - this.baseMemory);

          return new Circle(xPosition, yPosition, NODE_RADIUS, ctx, item);
        });
    };

    createCircleInChart();

    /* 노드들을 연결하는 선 */
    // FIXME: 노드가 x축과 겹치는 현상 해결 필요
    this.snapshotCircle.forEach((item, index) => {
      const xPosition = item.x;
      const yPosition = item.y;

      ctx.lineTo(xPosition, yPosition);
      ctx.stroke();
      ctx.save();

      ctx.moveTo(xPosition, yPosition);
      item.draw(color.chartDot);
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
    if (!this.data.length) {
      return;
    }

    this.circle.length = 0;
    this.drawChart();
    this.currentPosition += 1;

    if (this.currentPosition - VIEW_NODE_COUNT / 2 > this.data.length) {
      clearInterval(this.intervalID);
      this.intervalID = 0;
      this.currentPosition = 0;
    }
  };
}
