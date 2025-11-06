import BaseChart, { X_PADDING, Y_PADDING, TOP_PADDING } from "./BaseChart";
import BarNode from "./BarNode";
import { getPositionCodeInfo } from "./codeParser";

const Y_TICK_COUNT = 7;
const X_AXIS_OFFSET = 10;
const BAR_WIDTH_RATIO = 0.8;

export default class VariableBarChart extends BaseChart {
  constructor(id, modalCallbacks, theme) {
    super(id, modalCallbacks, theme);

    if (!this.canvas) return null;

    // VariableBarChart-specific state
    this.codeData = "";
    this.barNodeArray = [];
    this.codePositionArray = [];
    this.variableArray = [];
    this.codePositionCount = {};
    this.maxCodePositionCount = 0;

    return this;
  }

  /**
   * Override: Handle mouse move for variable bar chart
   * @protected
   */
  _handleMouseMove(cursorPositionX, cursorPositionY, event) {
    this.checkNodeHover(false);

    this.barNodeArray.forEach((node) => {
      if (node.isMouseOver(cursorPositionX, cursorPositionY)) {
        const chartModalData = {
          variableCount: node.data.variableCount,
          variableName: node.data.variableName,
        };

        const chartModalStyles = this._createChartModalStyles(
          event.pageX,
          event.pageY,
        );

        this.checkNodeHover(true, chartModalData, chartModalStyles);
      }
    });
  }

  /**
   * Override: Prepare for playback
   * @protected
   */
  _beforePlayback() {
    this.drawClear();
    this.fillTextX();
    this.fillTextY();
    this.drawAxis();
  }

  /**
   * Override: Stop and clear variable bar chart state
   * @public
   */
  stop = () => {
    super.stop();

    this.data.length = 0;
    this.barNodeArray.length = 0;
    this.codePositionArray.length = 0;
    this.codePositionCount = {};
    this.maxCodePositionCount = 0;
    this.variableArray = [];

    for (const node of this.barNodeArray) {
      node.setHeight(0);
    }
  };

  /**
   * Override: Set code data
   * @public
   */
  setCodeData = (codeData) => {
    this.codeData = codeData;
  };

  /**
   * Set data for variable bar chart
   * @public
   */
  setData = (data, durationTime) => {
    if (!this.canvas) return;

    this.data = [...data];

    if (!this.data.length) return;

    this.chartDurationTime = durationTime;
    this.excuteDurationTime = this.data.length;

    this.codePositionArray = this.data.map((node) => {
      return node.codePosition;
    });
    this.codePositionArray = [...new Set(this.codePositionArray)].filter(
      (node) => node !== null,
    );

    this.variableArray = this.codePositionArray.map((node) => {
      return getPositionCodeInfo(this.codeData, node);
    });

    this.data.forEach((node) => {
      const position = node.codePosition;

      if (!position) return;

      if (this.codePositionCount[position] === undefined) {
        this.codePositionCount[position] = 1;
      } else {
        this.codePositionCount[position] += 1;
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
          TOP_PADDING + this.chartHeight,
          (this.chartWidth / xDistance) * BAR_WIDTH_RATIO,
          0,
          this.ctx,
          { variableName, variableCount },
        ),
      );
    }

    this.drawAxis();
  };

  /**
   * Draw variable bar chart
   * @public
   */
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
        barNodeArray[i].draw(this.nodeColor);
      }
    }

    this.ctx.restore();
  };

  /**
   * Update animation data for variable bar chart
   * @protected
   */
  updateData = () => {
    if (!this.data.length) return;

    this.drawChart();
    this.currentPosition += 1;

    if (this.currentPosition === this.data.length) {
      clearInterval(this.intervalID);
      this.currentPosition = 0;
    }
  };

  /**
   * Draw chart axis
   * @public
   */
  drawAxis = () => {
    const { ctx, chartHeight, chartWidth } = this;

    ctx.beginPath();
    ctx.strokeStyle = this.lineColor;
    ctx.moveTo(Y_PADDING, TOP_PADDING);
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    ctx.lineTo(chartWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    return this;
  };

  /**
   * Fill X-axis text
   * @public
   */
  fillTextX = () => {
    const { ctx, chartWidth, chartHeight } = this;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = this.textColor;
    ctx.fillText(
      "Variable Name (Hover for details)",
      (chartWidth - Y_PADDING) / 2,
      chartHeight + TOP_PADDING + 15,
    );

    return this;
  };

  /**
   * Fill Y-axis text
   * @public
   */
  fillTextY = () => {
    const { ctx, chartHeight, chartWidth, maxCodePositionCount } = this;

    const yInterval = maxCodePositionCount / Y_TICK_COUNT;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = this.textColor;

    for (let i = 0; i <= Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);

      ctx.fillText(value ? value : 0, Y_PADDING - 3, yPoint - TOP_PADDING + 20);

      ctx.strokeStyle = this.gridColor;
      ctx.moveTo(Y_PADDING, yPoint);
      ctx.lineTo(Y_PADDING + chartWidth, yPoint);
      ctx.stroke();
    }

    return this;
  };

  /**
   * Reset background
   * @public
   */
  resetBackround = () => {
    const { ctx, canvasWidth, canvasHeight } = this;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    this.fillTextX();
    this.fillTextY();
    this.drawAxis();

    return this;
  };

  /**
   * Override: Set color with additional redraw logic
   * @public
   */
  setColor = (theme) => {
    super.setColor(theme);

    this.fillTextX();
    this.fillTextY();
    this.drawAxis();

    for (const node of this.barNodeArray) {
      node.setHeight(node.getHeight());
      node.draw(this.nodeColor);
    }

    return this;
  };

  /**
   * Override: Pause (no-op for VariableBarChart)
   * @public
   */
  pause = () => {
    this.ctx.restore();
    // TODO: 멈춘 순간의 데이터가 필요 없기에 구현하지 않았지만 남겨놓았습니다.
  };
}
