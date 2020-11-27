import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    data = [];
    subElements = {};
    paramStart = 0;
    paramEnd = 30;
    loading = false;
    isClientSorting = false;

    constructor(header = [], {url = ""}) {
        this.header = header;
        this.path = url;
        this.column = 'title';
        this.orderSort = 'asc';

        this.render();
    }

    async render() {
        const divElement = document.createElement('div');
        divElement.innerHTML = this.template;
        this.element = divElement.firstChild;  
        this.subElements = this.getTableContainer(this.element);   

        this.element.classList.add('sortable-table_loading');

        await this.requestData(this.column, this.orderSort);           

        this.element.classList.remove('sortable-table_loading');

        this.getTableBody(this.data);                 

        this.initEventListeners();
    }


    async requestData(sortColumn, orderSort) {
        const url = new URL(this.path, BACKEND_URL) ;

        url.searchParams.set('_embed', 'subcategory.category');
        url.searchParams.set('_sort', sortColumn);
        url.searchParams.set('_order', orderSort);
        url.searchParams.set('_start', this.paramStart);
        url.searchParams.set('_end', this.paramEnd);

        const arrData = await fetchJson(url);

        if (this.loading) this.data = this.data.concat(arrData);
        else this.data = arrData;
    }


    initEventListeners() {
        this.subElements.header.addEventListener('pointerdown', this.clickMouse);  
        document.addEventListener('scroll', this.scrollDoc);  
    }

    scrollDoc = async (event) => {
        const windHeight = document.documentElement.clientHeight;
        const coordBottom = this.element.getBoundingClientRect().bottom;        

        if ((coordBottom < windHeight + 100) && (this.loading === false)) {

            this.loading = true;

            this.addGroupGoods();

            await this.requestData(this.column, this.orderSort);

            this.getTableBody(this.data);    

            this.loading = false;
        }
    }

    addGroupGoods() {
        this.paramStart += 30;
        this.paramEnd += 30;
    }

    clickMouse = (event) => {
        const divTarget = event.target.closest('div'); 

        if (divTarget.dataset.id === 'images') return;
        this.column = divTarget.dataset.id;
        this.toggleOrder(this.orderSort);

        if (!this.isClientSorting) this.sortOnServer(this.column, this.orderSort);     
        else this.sortClient();
    }     

    async sortOnServer(column, orderSort) {

        this.paramStart = 0;
        this.paramEnd = 30;

        await this.requestData(column, orderSort);

        this.getTableBody(this.data);    
        
        this.setOrder(this.column, this.orderSort) ;
    }

    toggleOrder(lastOrder) {
        const orders = {
            asc: 'desc',
            desc: 'asc'
        };
        this.orderSort = orders[lastOrder];
    }

    getTableContainer(foundElement) {
        const tableContainer = {};
        const dataElements = foundElement.querySelectorAll('[data-element]');

        for (let el of dataElements) {
            tableContainer[el.dataset.element] = el;
        }
        return tableContainer;
    }

    get template() {        
        return `<div class="sortable-table">
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${this.getHeader()}    
                    </div>                                
                    <div data-element="body" class="sortable-table__body">
                    </div>
                    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                        <div>
                            <p>No products satisfies your filter criteria</p>                            
                        </div>
                    </div>
                </div>`;
    }

    getHeader() {        
        const headerElements = this.header.map( item => {
            return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
                        <span>${item.title}</span>
                        <span data-element="arrow" class="sortable-table__sort-arrow">
                            <span class="sort-arrow"></span>
                        </span>
                    </div>`;
        }).join('');
        return headerElements;        
    }

    getTableBody(dataElements) {
        const bodyElements = dataElements.map( item => { 
            return `<a href="#" class="sortable-table__row">               
                        ${this.getTableCell(item)}
                        
                    </a>`
        }).join('');

        this.subElements.body.innerHTML = bodyElements;
    }

    getTableCell(item) {
        const cells = this.header.map( ({ id, template }) => {
            if (template) return template(item[id]);
            return `<div class="sortable-table__cell">${item[id]}</div>`;  
        }).join('');
        return cells;
    }    
    
    sortClient() {
        const index = this.header.findIndex( obj => obj.id === this.column);
        const sortType = this.header[index].sortType;
        const direction = {
            asc: 1,
            desc: -1
        }        
        const arrSort = this.data.sort( (obj1, obj2) => {
            const comp1 = obj1[this.column];
            const comp2 = obj2[this.column];

            switch(sortType) {
                case 'string': 
                    return direction[this.orderSort] * comp1.localeCompare(comp2, ['ru', 'en'], {caseFirst: 'upper'}) ;
                    
                case 'number': 
                    return direction[this.orderSort] * (comp1 - comp2);                
            }
        } );

        this.setOrder(this.column, this.orderSort) ;
        this.getTableBody(arrSort);
    }

    setOrder(fieldValue,orderValue) {
        this.subElements.header.querySelectorAll('div').forEach(element => {
            element.dataset.order = "";
            if (element.dataset.id === fieldValue && element.dataset.id != 'images') {
                element.dataset.order = orderValue;
            }
        });
    }   

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = null;
    }
}
