function sortData(arr = [], sortId, order = "asc", type = "string") {
  const directions = {
    asc: 1,
    desc: -1,
  };
  const direction = directions[order];

  if (direction === undefined) {
    throw new Error(`Invalid sort order: "${order}"`);
  }

  return arr.slice().sort((a, b) => {
    const aValue = a[sortId];
    const bValue = b[sortId];

    if (type === "number") {
      return direction * (aValue - bValue);
    }

    return (
      direction *
      String(aValue).localeCompare(String(bValue), ["ru", "en"], {
        caseFirst: "upper",
      })
    );
  });
}

export default class SortableTable {
  static basePath = "/products";

  constructor(headerConfig = [], data = [], initalSorting = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.createArrowElement();
    this.render();

    if (initalSorting.id && initalSorting.order) {
      this.sort(initalSorting.id, initalSorting.order);
    }
  }

  createElement(template) {
    const containerElement = document.createElement("div");
    containerElement.innerHTML = template;

    return containerElement.firstElementChild;
  }

  createArrowElement() {
    this.arrowElement = this.createElement(this.createArrowTemplate());
  }

  createArrowTemplate() {
    return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
    `;
  }

  get tableTemplate() {
    return `
       <div class="sortable-table">
           <div
              data-element="header"
              class="sortable-table__header sortable-table__row"
            >
               ${this.createHeaderTemplate()}
            </div>

            <div data-element="body" class="sortable-table__body">
              ${this.createBodyTemplate()}
            </div>
       </div>
    `;
  }

  createHeaderTemplate({ sortId, sortOrder = "asc" } = {}) {
    return this.headerConfig
      .map(({ id, title, sortable = false }) => {
        return `
          <div
            class="sortable-table__cell"
            data-id="${id}"
            ${sortable ? "data-sortable" : ""}
          >
            <span>${title}</span>
          </div>
        `;
      })
      .join("");
  }

  createBodyTemplate() {
    return this.data
      .map(({ id: rowId, ...rest }) => {
        const cells = this.headerConfig
          .map(({ id, template }) => {
            const content = rest[id] ?? "";

            return template
              ? template(content)
              : `<div class="sortable-table__cell">${content}</div>`;
          })
          .join("");

        return `<a href="${SortableTable.basePath}/${rowId}" class="sortable-table__row">${cells}</a>`;
      })
      .join("");
  }

  sort(sortId, sortOrder) {
    const column = this.headerConfig.find((col) => col.id === sortId);

    if (!column) return;

    const { sortType = "string" } = column;
    const columnElement = this.subElements.header.querySelector(
      `[data-id="${column.id}"]`
    );

    this.data = sortData(this.data, sortId, sortOrder, sortType);

    this.subElements.body.innerHTML = this.createBodyTemplate();
    columnElement.setAttribute("data-order", sortOrder);
    columnElement.append(this.arrowElement);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      result[subElement.dataset.element] = subElement;
    }

    return result;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.tableTemplate;

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
