import { color } from "../styles/styleCode";
import BarNode from "./BarNode";
import { getPositionCodeInfo } from "./codeParser";

const X_PADDING = 25;
const Y_PADDING = 70;
const TOP_PADDING = 15;
const Y_TICK_COUNT = 7;
const X_AXIS_OFFSET = 10;
const BAR_WIDTH_RATIO = 0.8;

export default class VariableBarChart {
  constructor(id, modalCallbacks) {
    this.canvas = document.getElementById(id);

    if (!this.canvas) return null;

    this.data = [];
    this.codeData = "";
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "1.2rem Arial";

    this.chartWidth = this.canvas.width;
    this.chartHeight = this.canvas.height - X_PADDING - TOP_PADDING;

    this.excuteDurationTime = 0;
    this.intervalID = 0;
    this.currentPosition = 0;

    this.heightPixelWeights = 0;

    this.barNodeArray = [];
    this.codePositionArray = [];
    this.variableArray = [];
    this.codePositionCount = {};
    this.maxCodePositionCount = 0;

    this.checkNodeHover = modalCallbacks;

    this.canvas.addEventListener("mousemove", (e) => {
      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      this.checkNodeHover(false);
      this.barNodeArray.forEach((node) => {
        if (node.isMouseOver(cursorPositionX, cursorPositionY)) {
          const chartModalData = {
            variableCount: node.data.variableCount,
            variableName: node.data.variableName,
          };
          const chartModalStyles = {
            visibility: true,
            top: e.pageY,
            left: e.pageX,
          };
          this.checkNodeHover(true, chartModalData, chartModalStyles);
        }
      });
    });

    return this;
  }

  setData = (data, durationTime) => {
    if (!this.canvas) return;

    this.data = [...data];

    if (!this.data.length) return;

    this.chartDurationTime = durationTime;
    this.excuteDurationTime = this.data.length;

    this.codePositionArray = this.data.map((element) => {
      return element.codePosition;
    });
    this.codePositionArray = [...new Set(this.codePositionArray)].filter(
      (element) => element !== null,
    );

    this.variableArray = this.codePositionArray.map((element) => {
      return getPositionCodeInfo(this.codeData, element);
    });

    this.data.forEach((element) => {
      const position = element.codePosition;

      if (position !== null) {
        if (this.codePositionCount[position] === undefined) {
          this.codePositionCount[position] = 1;
        } else {
          this.codePositionCount[position] += 1;
        }
      }
    });

    for (let key in this.codePositionCount) {
      const count = this.codePositionCount[key];

      if (this.maxCodePositionCount < count) {
        this.maxCodePositionCount = count;
      }
    }

    const xDistance = this.codePositionArray.length + 2;

    for (let i = 0; i < this.codePositionArray.length; i += 1) {
      const xPosition = (this.chartWidth / xDistance) * i;
      const variableName = this.variableArray[i].left.name;
      const variableCount = this.codePositionCount[this.codePositionArray[i]];

      this.barNodeArray.push(
        new BarNode(
          Y_PADDING + xPosition + X_AXIS_OFFSET,
          TOP_PADDING + this.chartHeight - this.currentPosition,
          (this.chartWidth / xDistance) * BAR_WIDTH_RATIO,
          this.currentPosition,
          this.ctx,
          { variableName, variableCount },
        ),
      );
    }

    this.drawAxis();
  };

  setCodeData = (codeData) => {
    this.codeData = codeData;
  };

  playback = () => {
    if (this.intervalID < 1 && this.currentPosition === 0) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.fillTextX();
      this.fillTextY();
      this.drawAxis();

      this.intervalID = setInterval(() => {
        this.updateData();
      }, this.chartDurationTime / this.excuteDurationTime);
    }
  };

  // TODO: 멈춘 순간의 데이터가 필요 없기에 구현하지 않았지만 남겨놓았습니다.
  pause = () => {};

  stop = () => {
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.currentPosition = 0;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.fillTextX();
    this.fillTextY();
    this.drawAxis();

    for (let i = 0; i < this.codePositionArray.length; i += 1) {
      this.barNodeArray[i].setHeight(0);
    }
  };

  drawChart = () => {
    const {
      chartHeight,
      maxCodePositionCount,
      data,
      currentPosition,
      codePositionArray,
      barNodeArray,
    } = this;

    const heightPerUnit = chartHeight / maxCodePositionCount;

    for (let i = 0; i < codePositionArray.length; i += 1) {
      if (data[currentPosition].codePosition === codePositionArray[i]) {
        const height = barNodeArray[i].getHeight() + heightPerUnit;

        barNodeArray[i].setHeight(height);
        barNodeArray[i].draw();
      }
    }
  };

  updateData = () => {
    if (!this.data.length) return;

    this.drawChart();
    this.currentPosition += 1;

    if (this.currentPosition === this.data.length) {
      clearInterval(this.intervalID);
      this.currentPosition = 0;
    }
  };

  drawAxis = () => {
    const { ctx, chartHeight, chartWidth } = this;

    ctx.beginPath();
    ctx.strokeStyle = color.defalutChartLine;
    ctx.moveTo(Y_PADDING, TOP_PADDING);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = color.defalutChartLine;
    ctx.moveTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.lineTo(chartWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    return this;
  };

  fillTextX = () => {
    const { ctx, chartWidth, chartHeight } = this;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "Variable Name (Hover for details)",
      (chartWidth - Y_PADDING) / 2,
      chartHeight + TOP_PADDING + 15,
    );
  };

  fillTextY = () => {
    const { ctx, chartHeight, chartWidth, maxCodePositionCount } = this;

    const yInterval = maxCodePositionCount / Y_TICK_COUNT;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";

    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);
      ctx.fillText(value ? value : 0, Y_PADDING - 3, yPoint - TOP_PADDING + 20);

      ctx.strokeStyle = color.defalutGridLine;
      ctx.moveTo(Y_PADDING, yPoint);
      ctx.lineTo(Y_PADDING + chartWidth, yPoint);
      ctx.stroke();
    }
  };

  isPlay = () => {
    if (this.intervalID) {
      return true;
    }
    return false;
  };
}
