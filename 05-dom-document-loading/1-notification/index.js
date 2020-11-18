export default class NotificationMessage {
    static elNotification = null;

    constructor(string = '', {duration = 1000, type = 'success'} = {}) {
        this.string = string;
        this.duration = duration;
        this.type = type;
        this.render();
    }

    render() {
        this.element = this.template.firstChild;
    }

    show(targetElement = document.body) {
        if (!NotificationMessage.elNotification) {
            this.addElement(targetElement);
        } else {
            NotificationMessage.elNotification.remove();
            
            this.addElement(targetElement);
        }             
    }

    addElement(targetElement) {
        targetElement.append(this.element);
        NotificationMessage.elNotification = this.element;

        setTimeout( () => this.remove(), this.duration );
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
        this.remove();
        NotificationMessage.elNotification = null;
    }
}
