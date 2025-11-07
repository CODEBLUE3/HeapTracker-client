const BaseChartNode = require("./BaseChartNode");

/**
 * BarNode - Rectangular node for bar charts
 * Extends BaseChartNode with rectangle-specific rendering and hit detection
 */
module.exports = class BarNode extends BaseChartNode {
  constructor(x, y, width, height, ctx, data) {
    super(x, y, ctx, data);
    this.width = width;
    this.height = height;
    this.color = "blue";
  }

  /**
   * Draw rectangular bar
   * @param {string} color - Fill color for the rectangle
   */
  draw = (color) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
  };

  /**
   * Set bar height
   * @param {number} height - New height value
   */
  setHeight = (height) => {
    this.height = height;
  };

  /**
   * Get current bar height
   * @returns {number} Current height
   */
  getHeight = () => {
    return this.height;
  };

  /**
   * Set bar color
   * @param {string} color - Color value
   */
  setColor = (color) => {
    this.color = color;
    this.ctx.fillStyle = this.color;
  };

  /**
   * Check if mouse is over rectangular bar using boundary detection
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   * @returns {boolean} True if mouse is within rectangle bounds
   */
  isMouseOver = (x, y) => {
    const position = this.getPosition();

    if (
      x > position.x &&
      x < position.x + this.width &&
      y > position.y - this.height &&
      y < position.y
    ) {
      return true;
    }

    return false;
  };
};
