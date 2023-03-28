module.exports = class BarNode {
  constructor(x, y, width, height, ctx, data) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.data = data;
    this.color = "blue";

    return this;
  }

  draw = (color) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
  };

  setHeight = (height) => {
    this.height = height;
  };

  getHeight = () => {
    return this.height;
  };

  setColor = (color) => {
    this.color = color;
    this.ctx.fillStyle = this.color;
  };

  getPosition = () => {
    const position = {
      x: this.x,
      y: this.y,
    };

    return position;
  };

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
