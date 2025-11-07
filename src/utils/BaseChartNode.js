/**
 * BaseChartNode - Abstract base class for chart node types
 *
 * Provides common functionality for position tracking and data storage.
 * Subclasses must implement drawing and mouse hover detection logic.
 *
 * @abstract
 */
module.exports = class BaseChartNode {
  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} data - Node data
   */
  constructor(x, y, ctx, data) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.data = data;
  }

  /**
   * Get node position
   * @returns {Object} Position object with x and y coordinates
   */
  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Get node data
   * @returns {Object} Node data
   */
  getData() {
    return this.data;
  }

  /**
   * Draw the node on canvas
   * Must be implemented by subclasses
   * @abstract
   * @param {string} color - Fill color
   */
  draw(color) {
    throw new Error("draw() must be implemented by subclass");
  }

  /**
   * Check if mouse is over the node
   * Must be implemented by subclasses
   * @abstract
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   * @returns {boolean} True if mouse is over the node
   */
  isMouseOver(x, y) {
    throw new Error("isMouseOver() must be implemented by subclass");
  }
};
