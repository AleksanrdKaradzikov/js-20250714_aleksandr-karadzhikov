import BaseColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";
import fetchJson from "./utils/fetch-json.js";

const BACKEND_BASE_URL = "https://course-js.javascript.ru";

export default class ColumnChart extends BaseColumnChart {
  constructor({
    url = "",
    range = {},
    label = "",
    link = "",
    formatHeading = (value) => value,
  } = {}) {
    super({ link, label, formatHeading });

    this.url = url;
    this.range = this.getFormattedRange(range.from, range.to);
    this.fetchChartData();
  }

  update(startDate, endDate) {
    this.range = this.getFormattedRange(startDate, endDate);
    return this.fetchChartData();
  }

  getFormattedRange(startDate, endDate) {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      return { from: null, to: null };
    }

    return { from: startDate.toISOString(), to: endDate.toISOString() };
  }

  async fetchChartData() {
    if (!this.range.from || !this.range.to) {
      return;
    }

    const { from, to } = this.range;
    const urlParams = new URLSearchParams({ from, to });

    this.setChartLoading(this.element, true);

    try {
      const data = await fetchJson(
        `${BACKEND_BASE_URL}/${this.url}?from=${urlParams.get(
          "from"
        )}&to=${urlParams.get("to")}`,
        {
          method: "GET",
        }
      );

      super.update(Object.values(data));
      return data;
    } catch (error) {
      console.error(
        `Error while fetching data from url: ${this.url}: `,
        error.message
      );
    } finally {
      this.setChartLoading(this.element, false);
    }
  }
}
