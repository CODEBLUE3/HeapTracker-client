const BaseChartNode = require("./BaseChartNode");

const PI = Math.PI;
const mousePositionOffset = 0;
const radiusSizeOffset = 3;

/**
 * ChartNode - Circular node for line charts
 * Extends BaseChartNode with circle-specific rendering and hit detection
 */
module.exports = class ChartNode extends BaseChartNode {
  constructor(x, y, radius, ctx, data) {
    super(x, y, ctx, data);
    this.radius = radius;
  }

  /**
   * Draw circular node
   * @param {string} color - Fill color for the circle
   * @returns {ChartNode} this for chaining
   */
  draw(color) {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    return this;
  }

  /**
   * Check if mouse is over circular node using distance calculation
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   * @returns {boolean} True if mouse is within circle radius
   */
  isMouseOver(x, y) {
    const position = this.getPosition();
    const radius = this.radius + radiusSizeOffset;
    const centerX = position.x - mousePositionOffset;
    const centerY = position.y - mousePositionOffset;
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
    );

    return Math.round(distance) <= radius;
  }
};
