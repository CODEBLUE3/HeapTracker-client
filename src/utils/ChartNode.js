const PI = Math.PI;
const mousePositionOffset = 0;
const radiusSizeOffset = 3;

module.exports = class ChartNode {
  constructor(x, y, radius, ctx, data) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.data = data;

    this.draw = (color) => {
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();

      return this;
    };

    this.getPosition = () => {
      const position = {
        x: this.x,
        y: this.y,
      };

      return position;
    };

    this.isMouseOver = (x, y) => {
      const position = this.getPosition();
      const radius = this.radius + radiusSizeOffset;
      const centerX = position.x - mousePositionOffset;
      const centerY = position.y - mousePositionOffset;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
      );

      if (Math.round(distance) <= radius) return true;

      return false;
    };

    return this;
  }
};
