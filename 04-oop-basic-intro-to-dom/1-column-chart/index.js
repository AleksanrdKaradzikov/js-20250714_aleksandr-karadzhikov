const MAX_CHART_HEIGHT = 50;

export default class ColumnChart {
  constructor({
    data = [],
    label,
    link,
    value,
    formatHeading = (value) => value,
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.chartHeight = MAX_CHART_HEIGHT;
    this.renderChart();
  }

  update(newData = []) {
    if (this.element) {
      this.data = newData;

      const { body, header } = this.subElements;
      const value = this.data.reduce((acc, value) => acc + value, 0);
      this.value = value;
      header.textContent = this.formatHeading(value);
      body.innerHTML = this.renderChartData(this.calculateChartData());
    }
  }

  destroy() {
    this.remove();
  }

  setChartLoading(chart, loading = false) {
    if (chart) {
      chart.className = loading
        ? "column-chart column-chart_loading"
        : "column-chart";
    }
  }

  renderChart() {
    const chart = document.createElement("div");
    chart.style.setProperty("--chart-height", MAX_CHART_HEIGHT);
    this.setChartLoading(chart, this.data.length === 0);

    const chartHtml = [this.getChartTitleHtml(), this.getChartContainerHtml()];
    chart.innerHTML = chartHtml.join(" ");

    this.element = chart;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      result[subElement.dataset.element] = subElement;
    }

    return result;
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
        <div data-element="header" class="column-chart__header">${this.formatHeading(
          this.value
        )}</div>
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
