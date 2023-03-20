const PI = Math.PI;

module.exports = class Circle {
  constructor(x, y, radius, ctx, data) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.data = data;

    this.draw = () => {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);
      this.ctx.fillStyle = "red";
      this.ctx.fill();

      return this;
    };

    this.reDraw = () => {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);
      this.ctx.fillStyle = "blue";
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
      const radius = this.radius;
      const centerX = position.x + radius;
      const centerY = position.y + radius;

      return (
        Math.round(
          Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)),
        ) <= radius
      );
    };

    return this;
  }
};
