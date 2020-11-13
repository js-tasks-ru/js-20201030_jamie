export default class ColumnChart {
    constructor({data, label, link, value} = {}) {         
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.chartHeight = 50;
        this.render();
    }

    render() {             
        const colChart = document.createElement('div');
        colChart.className = 'column-chart';
        colChart.innerHTML =   `<div class="column-chart__title">${this.label}
                                    <a href="/sales" class="column-chart__link">${this.link}</a>
                                </div>
                                <div class="column-chart__container">
                                    <div data-element="header" class="column-chart__header">${this.value}</div>
                                    <div data-element="body" class="column-chart__chart"></div>
                                </div>`;
        this.element = colChart;

        if (this.data === undefined) {
            colChart.classList.add('column-chart_loading');
        }
        else {
            this.update(this.data);
        }
    }

    update(newData) {  
        const maxValue = Math.max(...newData);
        const scale = 50 / maxValue;

        const chart = this.element.querySelector('.column-chart__chart'); 
        const arrDivs = chart.querySelectorAll('div');

        arrDivs.forEach(element => {element.remove(); });

        for(let el of newData) {
            const divValue = document.createElement('div');
            divValue.setAttribute('style', `--value: ${Math.floor(el * scale)}`) ;
            divValue.setAttribute('data-tooltip', (el / maxValue * 100).toFixed(0) + '%') ;
            chart.append(divValue);
        }        
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }    
}
