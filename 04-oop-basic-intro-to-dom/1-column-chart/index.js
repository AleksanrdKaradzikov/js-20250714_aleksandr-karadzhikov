const MAX_CHART_HEIGHT = 50;

export default class ColumnChart {
  constructor({ data = [], label, link, value, formatHeading } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.element = this.renderChart();
    this.chartHeight = MAX_CHART_HEIGHT;
  }

  update(newData = []) {
    if (this.element) {
      this.data = newData;

      const chartBody = this.element.querySelector('[data-element="body"]');
      chartBody.innerHTML = "";
      chartBody.innerHTML = this.renderChartData(this.calculateChartData());
    }
  }

  destroy() {
    this.remove();
  }

  renderChart() {
    const chart = document.createElement("div");
    chart.className =
      this.data.length === 0
        ? "column-chart column-chart_loading"
        : "column-chart";
    chart.style.setProperty("--chart-height", MAX_CHART_HEIGHT);

    const chartHtml = [this.getChartTitleHtml(), this.getChartContainerHtml()];
    chart.innerHTML = chartHtml.join(" ");

    return chart;
  }

  getChartTitleHtml() {
    return `
        <div class="column-chart__title">
            ${this.label}
            ${
              this.link
                ? `<a href="${this.link}" class="column-chart__link">View all</a>`
                : ""
            }
        </div>
    `;
  }

  getChartContainerHtml() {
    return `
        <div class="column-chart__container">
            ${this.getChartHeaderHtml()}
            <div data-element="body" class="column-chart__chart">
             ${this.renderChartData(this.calculateChartData())}
            </div>
         </div>
    `;
  }

  getChartHeaderHtml() {
    return `
        <div data-element="header" class="column-chart__header">${
          this.formatHeading ? this.formatHeading(this.value) : this.value
        }</div>
    `;
  }

  calculateChartData() {
    const data = this.data;
    const maxValue = Math.max(...(data ?? []));
    const scale = MAX_CHART_HEIGHT / maxValue;

    return data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }

  renderChartData(chartData) {
    return chartData
      .map(
        ({ value, percent }) =>
          `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
      )
      .join("\n");
  }

  remove() {
    this.element.remove();
  }
}
