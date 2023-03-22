const PI = Math.PI;

module.exports = class Circle {
  constructor(x, y, radius, ctx, data) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.data = data;
    this.modal = null;

    this.draw = (color) => {
      this.ctx.beginPath();
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
      const radius = this.radius;
      const centerX = position.x + radius;
      const centerY = position.y + radius;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
      );

      if (Math.round(distance) <= radius) {
        if (!this.modal) {
          this.modal = document.createElement("div");
          this.modal.id = `chartModal-${this.data.timestamp}`;
          document.body.appendChild(this.modal);
        }

        return true;
      } else {
        if (this.modal) {
          document.body.removeChild(this.modal);
          this.modal = null;
        }
      }

      return false;
    };

    return this;
  }
};
