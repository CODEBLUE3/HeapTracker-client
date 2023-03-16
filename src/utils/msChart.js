//축
const X_PADDING = 25;
const Y_PADDING = 50;
const TOP_PADDING = 15;
const DURATION = 1000 * 30;
const MAX_VALUE = 100;
const Y_TICK_COUNT = 5;
const EX_TEXT = "00:00";

export default class LineChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_PADDING;
    this.chartHeight = this.canvasHeight - X_PADDING - TOP_PADDING;

    this.data = [];

    this.xFormatWidth = this.ctx.measureText(EX_TEXT).width;
    this.setTime();
    this.drawChart();
  }

  //시간을 실시간으로 세팅하는 함수
  setTime = () => {
    this.endTime = Date.now();
    this.startTime = this.endTime - DURATION;
    this.setXInterval();
  };

  setXInterval = () => {
    let xPoint = 0;
    let timeInterval = 1000;
    const test = true;
    while (test) {
      xPoint = (timeInterval / DURATION) * this.chartWidth;
      if (xPoint > this.xFormatWidth) {
        break;
      }
      timeInterval *= 2;
    }

    this.xTimeInterval = timeInterval;
  };

  //차트를 그리는 함수
  drawChart = () => {
    const { ctx, canvasWidth, canvasHeight, chartHeight, chartWidth } = this;

    //이전에 그려진 함수를 제거하는 로직(동적인 움직임을 위해)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //데이터를 그리기 시작
    ctx.beginPath();
    ctx.moveTo(Y_PADDING, TOP_PADDING);

    //draw Y
    ctx.lineTo(Y_PADDING, chartHeight + TOP_PADDING);
    const yInterval = MAX_VALUE / (Y_TICK_COUNT - 1);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = i * yInterval;
      const yPoint =
        TOP_PADDING + chartHeight - (value / MAX_VALUE) * chartHeight;
      ctx.fillText(value, Y_PADDING - 3, yPoint);
    }

    //draw X
    ctx.lineTo(canvasWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    // 차트 안 데이터만 보이게 하는 로직 -> store과 연관된다.
    // x축과 y축이 시작되는 곳이 위치가 된다.
    ctx.save();
    ctx.beginPath();
    ctx.rect(Y_PADDING, 0, chartWidth, canvasHeight);
    ctx.clip();

    let currentTime = this.startTime - (this.startTime % this.xTimeInterval);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    while (currentTime < this.endTime + this.xTimeInterval) {
      const xpoint = ((currentTime - this.startTime) / DURATION) * chartWidth;
      const date = new Date(currentTime);
      const text = date.getMinutes() + ":" + date.getSeconds();

      ctx.fillText(text, xpoint, chartHeight + TOP_PADDING + 4);
      currentTime += this.xTimeInterval;
    }

    // 데이터를 그리는 로직
    // 1. 새로 패스를 그린다고 선언한다.
    // 2. data(배열)을 돌면서 x의 위치와 y의 위치를 생성
    // 3. data가 없다면? -> 해당 좌표에 시작할 수 있도록 좌표를 옮김
    // 4. data가 있다면? -> x의 위치와 y의 위치를 기반으로 라인을 그림
    ctx.beginPath();
    this.data.forEach((item, index) => {
      const [time, value] = item;

      const xPosition = ((time - this.startTime) / DURATION) * this.chartWidth;
      const yPosition =
        TOP_PADDING + this.chartHeight - (value / MAX_VALUE) * this.chartHeight;

      if (!index) {
        ctx.moveTo(xPosition, yPosition);
      } else {
        ctx.lineTo(xPosition, yPosition);
      }
    });
    ctx.stroke();
    ctx.restore();
  };

  //데이터를 갱신하는 함수
  updateData = (data) => {
    this.data.push(data);
    this.setTime();
    this.drawChart();
  };
}
