class Tooltip {
    static instance;

    constructor() {
        if (Tooltip.instance) return this;
        else Tooltip.instance = this;
    }

    movePointer = (event) => {
        this.element.style.left = event.clientX + 10 + 'px';
        this.element.style.top = event.clientY + 10 + 'px';
    }

    hoverPointer = (event) => {
        const tooltipStr = event.target.dataset.tooltip;

        if (tooltipStr != undefined) {
            this.render(tooltipStr);
            event.target.addEventListener('pointermove', this.movePointer);          
        }
    }

    removePointer = () => {
        this.remove();        
    }

    initialize() {              
        document.addEventListener('pointerover', this.hoverPointer);
        document.addEventListener('pointerout', this.removePointer);
    }

    render(str) {
        const tooltipElement = document.createElement('div');

        tooltipElement.innerHTML = `<div class="tooltip">${str}</div>`;
        tooltip.element = tooltipElement.firstChild;

        document.body.append(this.element);
    };

    remove() {
        if (this.element) this.element.remove();
    }

    destroy() {
        document.removeEventListener('pointerover', this.overPointer);
        document.removeEventListener('pointerover', this.overPointer); 
        this.remove();      
    };
}

const tooltip = new Tooltip();

export default tooltip;
