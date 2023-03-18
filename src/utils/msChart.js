import Circle from "./circle";

//축
const X_PADDING = 25;
const Y_PADDING = 50;
const TOP_PADDING = 15;
const VIEW_NODE_COUNT = 10;
const Y_TICK_COUNT = 5;
const NODE_RADIUS = 5;

export default class LineChart {
  constructor(id, durationTime) {
    this.data = [
      { timestamp: 1678950904231, memory: 26.470917318911535 },
      { timestamp: 1678950904232, memory: 94.43471793706901 },
      { timestamp: 1678950904233, memory: 26.309072289398273 },
      { timestamp: 1678950904234, memory: 49.17418730834109 },
      { timestamp: 1678950904235, memory: 31.160896341071865 },
      { timestamp: 1678950904236, memory: 10.269190763446655 },
      { timestamp: 1678950904237, memory: 73.7156142120452 },
      { timestamp: 1678950904238, memory: 26.955150253575553 },
      { timestamp: 1678950904239, memory: 12.170802365140121 },
      { timestamp: 1678950904240, memory: 98.04970776474728 },
      { timestamp: 1678950904241, memory: 5.113529099409275 },
      { timestamp: 1678950904242, memory: 58.346443031677595 },
      { timestamp: 1678950904243, memory: 32.87095783395879 },
      { timestamp: 1678950904244, memory: 99.23909006003522 },
      { timestamp: 1678950904245, memory: 54.654480598596344 },
      { timestamp: 1678950904246, memory: 49.17418730834109 },
      { timestamp: 1678950904247, memory: 31.160896341071865 },
      { timestamp: 1678950904248, memory: 10.269190763446655 },
      { timestamp: 1678950904249, memory: 73.7156142120452 },
      { timestamp: 1678950904250, memory: 26.955150253575553 },
      { timestamp: 1678950904251, memory: 94.43471793706901 },
      { timestamp: 1678950904252, memory: 26.309072289398273 },
      { timestamp: 1678950904253, memory: 49.17418730834109 },
      { timestamp: 1678950904254, memory: 31.160896341071865 },
      { timestamp: 1678950904255, memory: 10.269190763446655 },
      { timestamp: 1678950904256, memory: 73.7156142120452 },
      { timestamp: 1678950904257, memory: 58.346443031677595 },
      { timestamp: 1678950904258, memory: 32.87095783395879 },
      { timestamp: 1678950904259, memory: 99.23909006003522 },
      { timestamp: 1678950904250, memory: 54.654480598596344 },
      { timestamp: 1678950904261, memory: 49.17418730834109 },
    ];

    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.chartWidth = this.canvasWidth - Y_PADDING;
    this.chartHeight = this.canvasHeight - X_PADDING - TOP_PADDING;

    this.durationTime = durationTime; // 재생 시간
    this.intervalID = 0; // 다시 그리기 interval ID
    this.currentPosition = 0; // 차트 그리기 기준 배열 인덱스

    this.maxMemoryValue = 0; // value 최대값
    this.minMemoryValue = Infinity; // value 최소값
    this.maxTimeValue = 0; // Time 최대값
    this.minTimeValue = Infinity; // Time 최소값
    this.heightPixelWeights = 0; // 높이 1 pixel 에 value 표현 가중치
    this.widthPixelWeights = 0; // 너비 1 pixel에 time 표현 가중치

    this.circle = [];

    this.canvas.addEventListener("mousemove", (e) => {
      const cursorPositionX = e.clientX - this.ctx.canvas.offsetLeft;
      const cursorPositionY = e.clientY - this.ctx.canvas.offsetTop;

      if (this.circle.length > 0) {
        this.circle.forEach((item) => {
          if (item.isMouseOver(cursorPositionX, cursorPositionY)) {
            item.reDraw();
          }
        });
      }
    });

    this.parseMemoryArray(); // heightPixelWeights 얻기

    return this;
  }

  playback = () => {
    if (this.intervalID < 1) {
      this.intervalID = setInterval(() => {
        this.updateData();
      }, this.durationTime / (this.data.at(-1).timestamp - this.data.at(0).timestamp));
    }
  };

  pause = () => {
    clearInterval(this.intervalID);
    this.intervalID = 0;
  };

  stop = () => {
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.currentPosition = 0;
  };

  //시간을 실시간으로 세팅하는 함수
  setTime = () => {
    this.startTime = this.data[0].timestamp;
    this.intervalID = setInterval(() => {
      this.updateData();
    }, this.durationTime / (this.data.at(-1).timestamp - this.data.at(0).timestamp));
  };

  parseMemoryArray = () => {
    if (this.data.length) {
      this.data.forEach((item) => {
        this.minMemoryValue = Math.min(this.minMemoryValue, item.memory);
        this.maxMemoryValue = Math.max(this.maxMemoryValue, item.memory);
      });

      this.heightPixelWeights =
        (this.chartHeight - Y_PADDING) /
        (this.maxMemoryValue - this.minMemoryValue);
    }
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
    const yInterval =
      (this.maxMemoryValue - this.minMemoryValue) / (Y_TICK_COUNT - 1);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = Math.floor(i * yInterval + this.minMemoryValue);
      const yPoint =
        TOP_PADDING + chartHeight - i * (chartHeight / Y_TICK_COUNT);
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

    // 데이터를 그리는 로직
    // 1. 새로 패스를 그린다고 선언한다.
    // 2. data(배열)을 돌면서 x의 위치와 y의 위치를 생성
    // 3. data가 없다면? -> 해당 좌표에 시작할 수 있도록 좌표를 옮김
    // 4. data가 있다면? -> x의 위치와 y의 위치를 기반으로 라인을 그림
    ctx.beginPath();

    this.data
      .slice(this.currentPosition, this.currentPosition + VIEW_NODE_COUNT)
      .forEach((item, index) => {
        const xPosition = (this.chartWidth / VIEW_NODE_COUNT) * (index + 1);
        const yPosition =
          TOP_PADDING +
          this.chartHeight -
          this.heightPixelWeights * item.memory;

        ctx.lineTo(xPosition, yPosition);
        ctx.stroke();
        ctx.save();

        this.circle.push(
          new Circle(xPosition, yPosition, NODE_RADIUS, ctx, item).draw(),
        );

        ctx.moveTo(xPosition, yPosition);

        ctx.fillStyle = "black";
        ctx.fillText(
          new Date(item.timestamp).getMilliseconds(),
          xPosition,
          chartHeight + TOP_PADDING + 4,
        );
      });
    ctx.stroke();
    ctx.restore();
  };

  //데이터를 갱신하는 함수
  updateData = () => {
    if (!this.data.length) {
      return;
    }

    this.circle.length = 0;
    this.drawChart();
    this.currentPosition += 1;

    if (this.currentPosition - VIEW_NODE_COUNT / 2 > this.data.length) {
      clearInterval(this.intervalID);
    }
  };
}
