import React from "react";
import { cleanup, render } from "@testing-library/react";
import { expect, test } from "@jest/globals";
import { chartMock } from "../mock/chartMock.js";
import LineChart from "../utils/LineChart.js";

afterEach(cleanup);

describe("line Chart", () => {
  const delay = (seconds) =>
    new Promise((res) => setTimeout(() => res(), seconds));

  describe("init Chart", () => {
    test("line Chart", async () => {
      render(
        <canvas
          id="lineChart"
          data-testid="line-chart"
          width="550px"
          height="400px"
        ></canvas>,
      );

      const lineChart = new LineChart("lineChart");
      lineChart.playback();
    });
  });

  describe("wrong Chart", () => {
    test("line Chart", async () => {
      render(
        <canvas
          id="lineChart"
          data-testid="line-chart"
          width="550px"
          height="400px"
        ></canvas>,
      );

      const wrongChart = new LineChart("wrong-ID");
      expect(wrongChart.canvas).toBeFalsy();
      expect(wrongChart.ctx).toBeFalsy();

      wrongChart.playback();
      expect(wrongChart.isPlay()).toBeFalsy();
    });
  });

  describe("all api test", () => {
    test("line Chart", async () => {
      render(
        <canvas
          id="lineChart"
          data-testid="line-chart"
          width="550px"
          height="400px"
        ></canvas>,
      );

      const lineChart = new LineChart("lineChart");

      expect(lineChart).toBeTruthy();
      expect(lineChart.canvas).toBeTruthy();
      expect(lineChart.ctx).toBeTruthy();

      lineChart.setData(chartMock.result, 2000);

      expect(lineChart.data.length).toBeGreaterThan(1);
      lineChart.playback();
      expect(lineChart.isPlay()).toBe(true);
      await delay(300);
      lineChart.pause();
      expect(lineChart.isPlay()).toBe(false);
      await delay(300);
      lineChart.playback();
      expect(lineChart.isPlay()).toBe(true);
      expect(lineChart.currentPosition).toBeGreaterThan(0);
      await delay(2000);
      expect(lineChart.currentPosition).toBe(0);

      lineChart.playback();
      await delay(300);
      expect(lineChart.currentPosition).toBeGreaterThan(0);
      lineChart.stop();
      expect(lineChart.currentPosition).toBe(0);
      expect(lineChart.isPlay()).toBe(false);
    });
  });
});
