export default class NotificationMessage {
    static objNotification = null;

    constructor(string = '', {duration = 1000, type = 'success'} = {}) {
        this.string = string;
        this.duration = duration;
        this.type = type;
        this.render();
    }

    render() {
        this.element = this.template.firstChild;
    }

    show(targetElement) {
        if (targetElement) this.element = targetElement;

        if (!NotificationMessage.objNotification) {
            this.addElement();
        } else {
            NotificationMessage.objNotification.destroy();
            this.addElement();
        }             
    }

    addElement() {
        document.body.append(this.element);
        NotificationMessage.objNotification = this;

        setTimeout( () => this.destroy(), this.duration );
    }

    get template() {
        const divNotif = document.createElement('div');
        divNotif.innerHTML =   `<div class="notification ${this.type}" style="--value:${this.duration}ms">
                                    <div class="timer"></div>
                                    <div class="inner-wrapper">
                                    <div class="notification-header">${this.type}</div>
                                    <div class="notification-body">
                                        ${this.string}
                                    </div>
                                    </div>
                                </div>`;
        return divNotif;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        if (!this.element) return;
        this.remove();
        this.element = null;
        NotificationMessage.objNotification = null;
    }
}
