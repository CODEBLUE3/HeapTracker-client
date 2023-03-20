import Circle from "./circle";

const X_PADDING = 25;
const Y_PADDING = 50;
const TOP_PADDING = 15;
const VIEW_NODE_COUNT = 13;
const Y_TICK_COUNT = 7;
const NODE_RADIUS = 5;

export default class LineChart {
  constructor(id, data, durationTime) {
    this.data = data;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_PADDING;
    this.chartHeight = this.canvasHeight - X_PADDING - TOP_PADDING;

    this.chartDurationTime = durationTime; // 재생 시간
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

    this.canvas.addEventListener("mousemove", (e) => {
      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      if (this.circle.length > 0) {
        this.circle.forEach((item) => {
          if (item.isMouseOver(cursorPositionX, cursorPositionY)) {
            item.reDraw();
          }
        });
      }
    });

    this.parseMemoryArray(); // heightPixelWeights 얻기
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
      const baseTime = this.data[0].timeStamp;
      const baseMemory = this.data[0].usedMemory;

      this.data.forEach((item) => {
        this.minMemoryText = Math.min(this.minMemoryText, item.usedMemory);
        this.maxMemoryText = Math.max(this.maxMemoryText, item.usedMemory);
      });

      this.data = this.data.map((item) => {
        item.timeStamp = item.timeStamp - baseTime;
        item.memGap = item.usedMemory - baseMemory;
        item.usedMemory = (item.usedMemory - this.minMemoryText) / 100;
        return item;
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

  //차트를 그리는 함수
  drawChart = () => {
    const { ctx, canvasWidth, canvasHeight, chartHeight, chartWidth } = this;

    //이전에 그려진 함수를 제거하는 로직(동적인 움직임을 위해)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //데이터를 그리기 시작
    ctx.beginPath();
    ctx.moveTo(Y_PADDING, TOP_PADDING);

    //draw Y
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

    ctx.save();
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvasHeight);
    ctx.clip();

    ctx.beginPath();

    this.data
      .slice(this.currentPosition, this.currentPosition + VIEW_NODE_COUNT)
      .forEach((item, index) => {
        const xPosition = (this.chartWidth / VIEW_NODE_COUNT) * (index + 1);
        const yPosition =
          TOP_PADDING +
          this.chartHeight -
          this.heightPixelWeights * item.usedMemory;

        ctx.lineTo(xPosition, yPosition);
        ctx.stroke();
        ctx.save();

        this.circle.push(
          new Circle(xPosition, yPosition, NODE_RADIUS, ctx, item),
        );

        ctx.moveTo(xPosition, yPosition);

        ctx.fillStyle = "black";
        ctx.fillText(item.timeStamp, xPosition, chartHeight + TOP_PADDING + 4);
      });
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
