export default class DoubleSlider {
  element;
  subElements = {};

  constructor({
    min = 0,
    max = 100,
    formatValue = (value) => "$" + value,
    selected = {
      from: min,
      to: max,
    },
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.render();
    this.createEventListeners();
  }

  get sliderTemplate() {
    return `
        <div class="range-slider">
            <span data-element="from">${this.formatValue(this.min)}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress"></span>
                <span class="range-slider__thumb-left"></span>
                <span class="range-slider__thumb-right"></span>
            </div>
            <span data-element="to">${this.formatValue(this.max)}</span>
        </div>
    `;
  }

  get selectedRange() {
    return {
      from: Math.round(this.selected.from),
      to: Math.round(this.selected.to),
    };
  }

  handleSliderPointerDown = (event) => {
    event.preventDefault();
    const { target } = event;

    if (
      target.classList.contains("range-slider__thumb-left") ||
      target.classList.contains("range-slider__thumb-right")
    ) {
      const sliderRect = this.subElements.inner.getBoundingClientRect();
      const isLeftThumb = target.classList.contains("range-slider__thumb-left");
      const rangeTotal = this.max - this.min;

      this.element.classList.add("range-slider_dragging");
      document.removeEventListener(
        "pointermove",
        this._handleSliderPointerMove
      );
      document.removeEventListener("pointerup", this._handleSliderPointerUp);

      this._handleSliderPointerMove = (moveEvent) => {
        const shift = (moveEvent.clientX - sliderRect.left) / sliderRect.width;
        const rawValue = this.min + shift * rangeTotal;
        const newValue = Math.round(
          Math.min(this.max, Math.max(this.min, rawValue))
        );

        if (isLeftThumb) {
          this.selected.from = Math.min(newValue, this.selected.to);
        } else {
          this.selected.to = Math.max(newValue, this.selected.from);
        }

        this.update();
      };

      this._handleSliderPointerUp = () => {
        this.element.classList.remove("range-slider_dragging");

        const rangeSelectEvent = new CustomEvent("range-select", {
          detail: this.selectedRange,
          bubbles: true,
        });

        this.element.dispatchEvent(rangeSelectEvent);

        document.removeEventListener(
          "pointermove",
          this._handleSliderPointerMove
        );
        document.removeEventListener("pointerup", this._handleSliderPointerUp);
      };

      document.addEventListener("pointermove", this._handleSliderPointerMove);
      document.addEventListener("pointerup", this._handleSliderPointerUp);
    }
  };

  render() {
    const containerElement = document.createElement("div");
    containerElement.innerHTML = this.sliderTemplate;
    this.element = containerElement.firstElementChild;

    this.setSubElements();
    this.update();
  }

  setSubElements() {
    this.subElements = {
      inner: this.element.querySelector(".range-slider__inner"),
      progress: this.element.querySelector(".range-slider__progress"),
      thumbLeft: this.element.querySelector(".range-slider__thumb-left"),
      thumbRight: this.element.querySelector(".range-slider__thumb-right"),
      from: this.element.querySelector('[data-element="from"]'),
      to: this.element.querySelector('[data-element="to"]'),
    };
  }

  update() {
    const { from, to } = this.selected;
    const range = this.max - this.min;

    const leftPercent = ((from - this.min) / range) * 100;
    const rightPercent = ((this.max - to) / range) * 100;

    this.subElements.thumbLeft.style.left = `${leftPercent}%`;
    this.subElements.thumbRight.style.right = `${rightPercent}%`;
    this.subElements.progress.style.left = `${leftPercent}%`;
    this.subElements.progress.style.right = `${rightPercent}%`;

    this.subElements.from.textContent = this.formatValue(Math.round(from));
    this.subElements.to.textContent = this.formatValue(Math.round(to));
  }

  createEventListeners() {
    this.element.addEventListener("pointerdown", this.handleSliderPointerDown);
  }

  removeEventListeners() {
    this.element.removeEventListener(
      "pointerdown",
      this.handleSliderPointerDown
    );
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}
