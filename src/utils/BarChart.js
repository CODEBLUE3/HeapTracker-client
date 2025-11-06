import BaseChart, { X_PADDING, Y_PADDING, TOP_PADDING } from "./BaseChart";
import BarNode from "./BarNode";

const LAST_BAR_X_POS_OFFSET = 10;
const VIEW_NODE_COUNT = 10;
const Y_TICK_COUNT = 7;

export default class BarChart extends BaseChart {
  constructor(id, modalCallback, theme) {
    super(id, modalCallback, theme);

    if (!this.canvas) return null;

    // BarChart-specific state
    this.barNodes = [];
    this.maxMemoryText = 0;
    this.minMemoryText = Infinity;
    this.maxMemoryValue = 0;
    this.minMemoryValue = Infinity;
    this.heightPixelWeights = 0;
    this.runTime = 0;
    this.minGap = Infinity;

    // Override chartWidth for BarChart
    this.chartWidth = this.canvas.width - Y_PADDING - 5;

    return this;
  }

  /**
   * Override: Handle mouse move for bar chart nodes
   * @protected
   */
  _handleMouseMove(cursorPositionX, cursorPositionY, event) {
    if (
      this.data.length > 0 &&
      cursorPositionX > Y_PADDING &&
      cursorPositionY < this.chartHeight + TOP_PADDING
    ) {
      this.checkNodeHover(false);

      this.barNodes.forEach((node) => {
        if (node.isMouseOver(cursorPositionX, cursorPositionY)) {
          const chartModalData = this._createChartModalData(node);
          const chartModalStyles = this._createChartModalStyles(
            event.pageX,
            event.pageY,
          );

          this.checkNodeHover(true, chartModalData, chartModalStyles);
          node.draw(this.nodeHoverColor);
        } else {
          node.draw(this.nodeColor);
        }
      });
    }
  }

  /**
   * Override: Stop and clear bar chart state
   * @public
   */
  stop = () => {
    super.stop();
    this.barNodes.length = 0;
  };

  /**
   * Set data for bar chart
   * @public
   */
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
      this.chartHeight / (this.maxMemoryValue - this.minMemoryValue);

    this.runTime =
      (this.data[this.data.length - 1].timeStamp - this.data[0].timeStamp) /
      1000;

    for (let i = 0; i < this.data.length - 1; i += 1) {
      this.minGap = Math.min(
        this.minGap,
        this.data[i + 1].timeStamp - this.data[i].timeStamp,
      );
    }
  };

  /**
   * Draw bar chart
   * @public
   */
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

    for (let i = 0; i <= Y_TICK_COUNT; i++) {
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
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvas.height);
    ctx.save();

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
        ((this.chartWidth - LAST_BAR_X_POS_OFFSET) /
          this.data[this.data.length - 1].timeStamp) *
          node.timeStamp +
        Y_PADDING;
      const startY = this.chartHeight + TOP_PADDING - 2;
      const width =
        Math.floor(this.minGap) /
        Math.floor(this.data[this.data.length - 1].timeStamp / this.chartWidth);
      const height =
        this.heightPixelWeights * (node.usedMemory - this.baseMemory);

      return new BarNode(startX, startY, width, height, ctx, node);
    });

    ctx.stroke();

    return this;
  };

  /**
   * Override: Playback for bar chart with custom animation
   * @public
   */
  playback = () => {
    if (!this.data) return;

    if (!this.data.length) return;

    this.drawChart();

    this.intervalID = setInterval(() => {
      if (this.barNodes.length <= this.currentPosition) {
        return;
      }

      this.barNodes[this.currentPosition++].draw(this.nodeColor);
      this.ctx.stroke();
      this.ctx.restore();
    }, this.chartDurationTime / this.excuteDurationTime);
  };

  /**
   * Override: Pause bar chart animation
   * @public
   */
  pause = () => {
    if (!this.data) return;

    if (!this.data.length) return;

    this.ctx.restore();
    clearInterval(this.intervalID);
    this.intervalID = 0;
  };

  /**
   * Update animation data for bar chart
   * Note: BarChart uses different playback mechanism,
   * so this method is less critical than other charts
   * @protected
   */
  updateData = () => {
    // BarChart uses different animation in playback()
    // This method is kept for consistency with base class
  };
}
