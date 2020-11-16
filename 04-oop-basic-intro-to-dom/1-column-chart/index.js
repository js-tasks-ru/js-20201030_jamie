export default class ColumnChart {
    constructor({data=[], label='', link='', value=0} = {}) {         
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.chartHeight = 50;
        this.render();
    }

    render() {    
        this.element = this.template;        
        this.chartContainer = this.getChartContainer();

        if (this.data.length === 0) {
            this.element.classList.add('column-chart_loading');
        }
        else {
            this.update(this.data);
        }
    }

    get template() {
        const colChart = document.createElement('div');
        colChart.className = 'column-chart';
        colChart.setAttribute('style', `--chart-height: ${this.chartHeight}`) ;
        colChart.innerHTML =   `<div class="column-chart__title">
                                    ${this.label}
                                    ${this.checkLink()}
                                </div>
                                <div class="column-chart__container">
                                    <div data-element="header" class="column-chart__header">${this.value}</div>
                                    <div data-element="body" class="column-chart__chart"></div>
                                </div>`;
        return colChart;
    }

    checkLink() {
        if (this.link) return `<a href="${this.link}" class="column-chart__link">View all</a>`;
        else return '';
    }

    getChartContainer() {
        const chartContainer = {};
        const dataElements = this.element.querySelectorAll('[data-element]');

        for (let el of dataElements) {
            chartContainer[el.dataset.element] = el;
        }
        return chartContainer;
    }

    update(newData) {  
        const maxValue = Math.max(...newData);
        const scale = 50 / maxValue;

        let divString = ``;

        for(let el of newData) {
            divString += `<div style="--value: ${Math.floor(el * scale)}" data-tooltip=${(el / maxValue * 100).toFixed(0) + '%'}></div>`;
        }        
        this.chartContainer.body.innerHTML = divString;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.element = null;
        this.chartContainer = null;
    }    
}
