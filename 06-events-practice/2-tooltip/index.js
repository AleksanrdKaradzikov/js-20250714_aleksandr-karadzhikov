class Tooltip {
  static #instance;
  static defaultIndent = { x: 10, y: 10 };

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }

    Tooltip.#instance = this;
    this.createTooltipElement();
  }

  get tooltipTemplate() {
    return `<div class="tooltip"></div>`;
  }

  createTooltipElement() {
    const containerElement = document.createElement("div");
    containerElement.innerHTML = this.tooltipTemplate;
    this.element = containerElement.firstElementChild;
  }

  handleTooltipOver = (event) => {
    if (!event.target.dataset.tooltip || this.element.isConnected) {
      return;
    }

    const tooltipText = event.target.dataset.tooltip;
    const { x, y } = event;

    this.render(tooltipText, { x, y });
    this.currentExposedElement = event.target;

    document.addEventListener("pointerout", this.handleTooltipOut);
  };

  handleTooltipMove = (event) => {
    if (!this.currentExposedElement) {
      return;
    }

    const tooltipText = this.currentExposedElement.dataset.tooltip;
    const { x, y } = event;
    this.render(tooltipText, { x, y });
  };

  handleTooltipOut = () => {
    this.remove();
    this.currentExposedElement = null;

    document.removeEventListener("pointerout", this.handleTooltipOut);
  };

  createListeners() {
    document.addEventListener("pointerover", this.handleTooltipOver);
    document.addEventListener("mousemove", this.handleTooltipMove);
  }

  destroyListeners() {
    document.removeEventListener("mousemove", this.handleTooltipMove);
    document.removeEventListener("pointerover", this.handleTooltipOver);
    document.removeEventListener("pointerout", this.handleTooltipOut);
  }

  initialize() {
    this.createListeners();
  }

  render(text, { x = 0, y = 0 } = {}) {
    this.element.innerHTML = text;

    document.body.append(this.element);
    this.element.style.top = `${y + Tooltip.defaultIndent.y}px`;
    this.element.style.left = `${x + Tooltip.defaultIndent.y}px`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
