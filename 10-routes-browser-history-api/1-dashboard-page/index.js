import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    subElements = {};
    components = {};

    render() {       
      this.element = this.getTemplate();

      this.getRangePicker();    
      
      this.from = this.components.rangePicker.selected.from;
      this.to = this.components.rangePicker.selected.to;

      this.getChartColumns();

      this.getSortableTable();        
      
      this.initEventListeners();

      return this.element;
  }

  initEventListeners() {
    this.components.rangePicker.element.addEventListener('date-select', event => {

      this.from = event.detail.from;
      this.to = event.detail.to;

      this.update();
      });   
    }

    async update() {
      this.components.sortableTable.url.searchParams.set('from', this.from.toISOString());
      this.components.sortableTable.url.searchParams.set('to', this.to.toISOString());

      this.components.sortableTable.update() ;      

      this.components.ordersChart.update(this.from, this.to);
      this.components.salesChart.update(this.from, this.to);
      this.components.customersChart.update(this.from, this.to);
    }

    getRangePicker() {
      const monthInMs = 2592000000;
      const rangePicker = new RangePicker({from: new Date(Date.now() - monthInMs), to: new Date()});

      this.element.querySelector('.content__top-panel').append(rangePicker.element);

      this.components.rangePicker = rangePicker;
      this.subElements.rangePicker = rangePicker.element;        
    }

    getSortableTable() {
      const sortableTable = new SortableTable(header, {url: `api/dashboard/bestsellers?from=${this.from.toISOString()}&to=${this.to.toISOString()}`, step: 30, start: 0});// ?from=2020-11-06T04%3A52%3A44.929Z&to=2020-12-06T04%3A52%3A44.929Z
      
      this.element.append(sortableTable.element);

      this.components.sortableTable = sortableTable;
      this.subElements.sortableTable = sortableTable.element;   
    }

    getChartColumns() {
      const dChart = this.element.querySelector('.dashboard__charts');

      const ordersChart = new ColumnChart({
        url: 'api/dashboard/orders',
        range: {
          from: this.from,
          to: this.to,
        },
        label: 'orders',
        link: '/sales'
      });

      ordersChart.element.classList.add('dashboard__chart_orders');
      this.components.ordersChart = ordersChart;
      this.subElements.ordersChart = ordersChart.element;   

      const salesChart = new ColumnChart({
        url: 'api/dashboard/sales',
        range: {
        from: this.from,
        to: this.to,
        },
        label: 'sales',
        formatHeading: data => `$${data}`
      });

      salesChart.element.classList.add('dashboard__chart_sales');
      this.components.salesChart = salesChart;
      this.subElements.salesChart = salesChart.element;  

      const customersChart = new ColumnChart({
        url: 'api/dashboard/customers',
        range: {
          from: this.from,
          to: this.to,
        },
        label: 'customers',
      });

      customersChart.element.classList.add('dashboard__chart_customers');
      this.components.customersChart = customersChart;
      this.subElements.customersChart = customersChart.element;  

      dChart.append(ordersChart.element);
      dChart.append(salesChart.element);
      dChart.append(customersChart.element);
    }

    getTemplate() {
      const div = document.createElement('div');

      div.innerHTML = `<div class="dashboard full-height flex-column">
                          <div class="content__top-panel">
                              <h2 class="page-title">Панель управления</h2>
                          </div>
                          <div class="dashboard__charts"></div>
                          <h3 class="block-title">Лидеры продаж</h3>
                      </div>`;
      return div.firstChild;
    }

    remove() {
      this.element.remove();
    }

    destroy() {
      this.remove();
      this.subElements = null;
      this.components = null;
    }
}
