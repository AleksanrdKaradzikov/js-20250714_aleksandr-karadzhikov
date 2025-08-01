export default class NotificationMessage {
  static currentNotification = null;

  constructor(message = "", { duration = 1000, type = "success" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
     <div class="notification ${
       this.type
     }" style="--value:${this.msToSecondsString(this.duration)}">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
                ${this.message}
            </div>
        </div>
    </div>
    `;
  }

  startRemoveTimeout() {
    this.timer = setTimeout(() => {
      this.remove();
      clearTimeout(this.timer);
    }, this.duration);
  }

  msToSecondsString(ms) {
    return `${(ms / 1000).toFixed(1)}s`;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
  }

  show(target = document.body) {
    if (NotificationMessage.currentNotification) {
      NotificationMessage.currentNotification.remove();
    }

    target.appendChild(this.element);
    NotificationMessage.currentNotification = this.element;
    this.startRemoveTimeout();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
