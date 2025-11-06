/**
 * BaseChart - Abstract base class for all chart types
 *
 * Provides common functionality for canvas initialization,
 * mouse event handling, theme management, and playback controls.
 *
 * Subclasses must implement:
 * - drawChart(): Chart-specific drawing logic
 * - setData(): Chart-specific data initialization
 * - updateData(): Chart-specific animation update logic
 */

const X_PADDING = 25;
const Y_PADDING = 70;
const TOP_PADDING = 15;

export { X_PADDING, Y_PADDING, TOP_PADDING };

export default class BaseChart {
  constructor(id, modalCallback, theme) {
    this.canvas = document.getElementById(id);

    if (!this.canvas) return null;

    // Canvas setup
    this.data = [];
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "0.8rem Arial";

    this.chartWidth = this.canvas.width;
    this.chartHeight = this.canvas.height - X_PADDING - TOP_PADDING;

    // Animation state
    this.intervalID = 0;
    this.currentPosition = 0;
    this.excuteDurationTime = 0;
    this.chartDurationTime = 0;

    // Modal callback
    this.checkNodeHover = modalCallback;

    // Theme colors
    this._initializeTheme(theme);

    // Setup mouse event listener
    this._setupMouseEventListener();

    return this;
  }

  /**
   * Initialize theme colors
   * @private
   */
  _initializeTheme(theme) {
    this.backgroundColor = theme.boxBackground;
    this.gridColor = theme.gridLine;
    this.lineColor = theme.borderLine;
    this.textColor = theme.unitText;
    this.nodeColor = theme.chartDot;
    this.nodeHoverColor = theme.chartDotHover;

    // Optional: nodeLineColor (used by LineChart)
    if (theme.nodeLine) {
      this.nodeLineColor = theme.nodeLine;
    }
  }

  /**
   * Setup mouse event listener for node hover detection
   * Subclasses can override this method for custom behavior
   * @protected
   */
  _setupMouseEventListener() {
    this.canvas.addEventListener("mousemove", (e) => {
      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      this._handleMouseMove(cursorPositionX, cursorPositionY, e);
    });
  }

  /**
   * Handle mouse move event
   * Subclasses should override this to provide chart-specific hover logic
   * @protected
   */
  _handleMouseMove(cursorPositionX, cursorPositionY, event) {
    // To be overridden by subclasses
    // Each chart has different node collections and hover detection logic
  }

  /**
   * Create modal data object from node data
   * @protected
   */
  _createChartModalData(node) {
    return {
      codeCount: node.data.count,
      codeType: node.data.codeType,
      codePosition: node.data.codePosition,
      usedMemory: node.data.usedMemory,
      timeStamp: node.data.timeStamp,
    };
  }

  /**
   * Create modal styles object
   * @protected
   */
  _createChartModalStyles(pageX, pageY) {
    return {
      visibility: true,
      top: pageY,
      left: pageX,
    };
  }

  /**
   * Set theme colors
   * @public
   */
  setColor = (theme) => {
    this.backgroundColor = theme.boxBackground;
    this.gridColor = theme.gridLine;
    this.lineColor = theme.borderLine;
    this.textColor = theme.unitText;
    this.nodeColor = theme.chartDot;
    this.nodeHoverColor = theme.chartDotHover;

    if (theme.nodeLine) {
      this.nodeLineColor = theme.nodeLine;
    }

    return this;
  };

  /**
   * Set line color
   * @public
   */
  setLineColor = (color) => {
    this.nodeColor = color;

    if (this.nodeLineColor !== undefined) {
      this.nodeLineColor = color;
    }

    return this;
  };

  /**
   * Start chart playback animation
   * @public
   */
  playback = () => {
    if (!this.data || !this.data.length) return;

    if (this.intervalID < 1) {
      this._beforePlayback();

      this.intervalID = setInterval(() => {
        this.updateData();
      }, this.chartDurationTime / this.excuteDurationTime);
    }
  };

  /**
   * Hook called before playback starts
   * Subclasses can override to add custom initialization
   * @protected
   */
  _beforePlayback() {
    // To be overridden by subclasses if needed
  }

  /**
   * Pause chart playback
   * @public
   */
  pause = () => {
    this.ctx.restore();
    clearInterval(this.intervalID);
    this.intervalID = 0;
  };

  /**
   * Stop chart playback and reset state
   * @public
   */
  stop = () => {
    this.ctx.restore();
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.currentPosition = 0;

    this._clearChartArea();
  };

  /**
   * Clear chart drawing area
   * @protected
   */
  _clearChartArea() {
    this.ctx.clearRect(
      Y_PADDING,
      0,
      this.canvasWidth,
      this.canvasHeight - X_PADDING,
    );
  }

  /**
   * Clear entire canvas
   * @public
   */
  drawClear = () => {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  /**
   * Check if chart is currently playing
   * @public
   * @returns {boolean}
   */
  isPlay = () => {
    return this.intervalID > 0;
  };

  /**
   * Set code data (optional, used by some charts)
   * @public
   */
  setCodeData = (codeData) => {
    if (!this.canvas) return;
    // Can be overridden by subclasses
  };

  /**
   * Abstract method: Draw the chart
   * Must be implemented by subclasses
   * @abstract
   * @public
   */
  drawChart = () => {
    throw new Error("drawChart() must be implemented by subclass");
  };

  /**
   * Abstract method: Set chart data
   * Must be implemented by subclasses
   * @abstract
   * @public
   */
  setData = (data, durationTime) => {
    throw new Error("setData() must be implemented by subclass");
  };

  /**
   * Abstract method: Update animation data
   * Must be implemented by subclasses
   * @abstract
   * @protected
   */
  updateData = () => {
    throw new Error("updateData() must be implemented by subclass");
  };
}
