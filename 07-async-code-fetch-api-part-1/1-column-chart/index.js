import fetchJson from './utils/fetch-json.js';
export default class ColumnChart {
    chartHeight = 50;
    data = [];

    constructor( {  url = 'api/dashboard/orders', range = { from: new Date('2020-04-06'),
                                                            to: new Date('2020-05-06') },
                    label='', link = '', value = 0} = {} ) {  
        this.path = url;
        this.label = label;
        this.link = link;
        this.value = value;
        this.from = range.from;        
        this.to = range.to;        
        this.element = this.template;
        this.render();
    }

    async update(startDate, endDate) { 
        this.from = startDate;
        this.to = endDate;

        await this.render();   

        this.element = document.querySelector('.column-chart');
         
        this.toggleClass();    
    }     

    async render() {  
        this.subElements = this.getChartContainer();

        const url = new URL(`https://course-js.javascript.ru/${this.path}`);
        url.searchParams.set('from', this.from.toISOString());
        url.searchParams.set('to', this.to.toISOString());
        
        const obj1 = await fetchJson(new URL(url));         
        this.data = Object.values(obj1);

        this.toggleClass();        
    }

    toggleClass() {
        if (this.data.length === 0) {
            if ( !this.element.classList.contains('column-chart_loading') ) {
                this.element.classList.add('column-chart_loading');
            }
        }
        else {            
            this.element.classList.remove('column-chart_loading');
            this.getBody();
        }
    }

    get template() {
        const colChart = document.createElement('div');
        colChart.classList.add('column-chart', 'column-chart_loading');
        colChart.setAttribute('style', `--chart-height: ${this.chartHeight}`) ;
        colChart.innerHTML =   `<div class="column-chart__title">
                                    ${this.label}
                                    ${this.checkLink()}
                                </div>
                                <div class="column-chart__container">
                                    <div data-element="header" class="column-chart__header"></div>
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

    getBody() {
        const maxValue = Math.max(...this.data);
        const scale = 50 / maxValue;

        this.value = this.data.reduce( (accum, current) => accum += current, 0);

        const divString = this.data.map( item => {
            return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip=${(item / maxValue * 100).toFixed(0) + '%'}></div>`;
        } ).join('');
        
        this.subElements.header.innerHTML = this.value;
        this.subElements.body.innerHTML = divString;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = null;
    } 
}
