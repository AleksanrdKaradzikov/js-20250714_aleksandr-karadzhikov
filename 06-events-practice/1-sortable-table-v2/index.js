import SortableTableBase from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableBase {
  static ascOrder = "asc";
  static descOrder = "desc";

  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    super(headersConfig, data, sorted);

    this.createListeners();
  }

  handleHeaderCellClick = (event) => {
    const cellElement = event.target.closest(".sortable-table__cell");

    if (!cellElement || !cellElement?.hasAttribute("data-sortable")) {
      return;
    }

    const sortId = cellElement.dataset.id;
    const sortOrder = this.getSortOder(cellElement.dataset.order);
    this.sort(sortId, sortOrder);
  };

  getSortOder(order) {
    if (!order) {
      return SortableTable.ascOrder;
    }

    return order === SortableTable.ascOrder
      ? SortableTable.descOrder
      : SortableTable.ascOrder;
  }

  createListeners() {
    this.subElements.header.addEventListener(
      "click",
      this.handleHeaderCellClick
    );
  }

  destroyListeners() {
    this.subElements.header.removeEventListener(
      "click",
      this.handleHeaderCellClick
    );
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
