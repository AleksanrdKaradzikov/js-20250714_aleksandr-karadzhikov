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

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get template() {
    return `
       <div class="sortable-table">
           <div
              data-element="header"
              class="sortable-table__header sortable-table__row"
            >
               ${this.getHeaderCells()}
            </div>

            <div data-element="body" class="sortable-table__body">
              ${this.getBodyCells()}
            </div>
       </div>
    `;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getHeaderCells({ sortId, sortOrder = "asc" } = {}) {
    return this.headerConfig
      .map(({ id, title, sortable = false }) => {
        const isSorted = sortable && sortId === id;
        return `
          <div
            class="sortable-table__cell"
            data-id="${id}"
            ${sortable ? 'data-sortable="true"' : ""}
            ${isSorted ? `data-order="${sortOrder}"` : ""}
          >
            <span>${title}</span>
            ${
              isSorted
                ? `
              <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>
            `
                : ""
            }
          </div>
        `;
      })
      .join("");
  }

  getBodyCells() {
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

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      result[subElement.dataset.element] = subElement;
    }

    return result;
  }

  sort(sortId, sortOrder) {
    const column = this.headerConfig.find((col) => col.id === sortId);
    if (!column) return;

    const { sortType = "string" } = column;

    this.data = sortData(this.data, sortId, sortOrder, sortType);

    this.subElements.header.innerHTML = this.getHeaderCells({
      sortId,
      sortOrder,
    });

    this.subElements.body.innerHTML = this.getBodyCells();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
