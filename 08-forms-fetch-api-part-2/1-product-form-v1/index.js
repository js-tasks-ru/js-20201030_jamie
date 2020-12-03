import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  subElements = {};

  downloadImage = () => {        
    const div = document.createElement('div');
    div.innerHTML = `<input type="file" name="picture" accept="image/*">`;
    const inputFile = div.firstChild;
    
    inputFile.click();

    inputFile.onchange = async () => {
      const [file] = inputFile.files;

      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        this.subElements.productForm.uploadImage.classList.add('is-loading');
        this.subElements.productForm.uploadImage.disable = true;

        try {
          const result = await fetchJson('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
              Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
            },
            body: formData           
          });
         
          this.subElements.imageListContainer.firstElementChild.append(this.createImages(result.data.link, file.name));

          this.subElements.productForm.uploadImage.classList.remove('is-loading');
          this.subElements.productForm.uploadImage.disable = false;

          inputFile.remove();
        }
        catch(error) {
          console.error('error');
          throw error;
        }
      }
    }
  }

  initEventListener() {
    this.subElements.productForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.save();
    } );  

    this.nameElements.uploadImage.addEventListener('click', this.downloadImage);

    this.subElements.imageListContainer.addEventListener('click', event => {
      if (event.target.dataset.deleteHandle != undefined) {
        event.target.closest('li').remove();}
    });
  }

  constructor (productId) {
    this.productId = productId;
  }

  async render () {   
    const div = document.createElement('div');    
    div.innerHTML = this.getTemplate();

    this.subElements = this.getTableContainer(div.firstChild);

    const form = this.subElements.productForm;

    this.nameElements = this.getNameElements(form);

    if (this.productId) {
      const [categories, [product]] = await Promise.all([this.loadCategories(),this.loadById(this.productId)]);

      if (product) {    
        form.elements.subcategory.innerHTML = this.addCategories(categories);

        for (let key in this.nameElements) {
          if (product.hasOwnProperty(key))  this.nameElements[key].value = product[key];
        }
        product.images.map(item => this.subElements.imageListContainer.firstElementChild.append(this.createImages(item.url, item.source)));
        
        this.element = div.firstChild;
      } else {
          this.element = `<h1>Товар не найден</h1>`;
        }
    } else {
      const categories = await this.loadCategories();
      
      form.elements.subcategory.innerHTML = this.addCategories(categories);

      this.element = div.firstChild;       
    }    
    
    this.initEventListener();   

    return this.element;  
  }

  createImages(url, source) {
    const div = document.createElement('div');
    const liElement = `<li class="products-edit__imagelist-item sortable-list__item" style="">
                          <input type="hidden" name="url" value=${escapeHtml(url)}>
                          <input type="hidden" name="source" value=${escapeHtml(source)}>
                          <span>
                            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                            <img class="sortable-table__cell-img" alt="Image" src=${escapeHtml(url)}>
                            <span>${escapeHtml(source)}</span>
                          </span>
                          <button type="button">
                            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                          </button>
                        </li>`;  
    div.innerHTML = liElement;
    return div.firstChild;
  }

  replaceAlpha(id) {
    const alpha = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z','и': 'i', 'й': 'j', 
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 
      'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    for (let w in alpha) {
      if (alpha.hasOwnProperty(w)) id = id.replace(new RegExp(w, 'g'), alpha[w]);
    }
    return id;
  }

  pullDatafromForm() {
    const form = this.subElements.productForm;
    let prodId;

    if (this.productId) prodId = this.productId;
    else {
      prodId = form.title.value.replace(/\s/g, '-').toLowerCase();
      prodId = this.replaceAlpha(prodId);
    }

    const product = {
      id: prodId,
      title: form.title.value,
      description: form.elements.description.value,
      price: parseInt(form.elements.price.value),
      discount: parseInt(form.elements.discount.value),
      quantity: parseInt(form.elements.quantity.value),
      subcategory: form.elements.subcategory.value,
      status: parseInt(form.elements.status.value),
      images: []
    };

    const liElements = document.querySelectorAll('.sortable-table__cell-img');

    liElements.forEach( item => {
      product.images.push({url: item.src, source: item.nextElementSibling.textContent});
    });

    return product;
  }

  async save() {
    const product = this.pullDatafromForm();
    const url = new URL(BACKEND_URL.concat('/api/rest/products'));

    try{
      const result = await fetchJson(url, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      this.dispatchEvent(result.id);
    }
    catch(error) {
      console.error(error);
    }
  }

  getTableContainer(element) {
    const dataElements = {};
    const arrDataElements = element.querySelectorAll('[data-element]');

    for (let el of arrDataElements) {
      dataElements[el.dataset.element] = el;
    }
    return dataElements;
  }

  getNameElements(form) {
    const nameElements = {};
    const arrDataElements = form.querySelectorAll('[name]');

    for (let el of arrDataElements) {
      nameElements[el.name] = el;
    }
    return nameElements;
}

  async loadById() {
    const url = new URL('/api/rest/products', BACKEND_URL);

    url.searchParams.set('id',  this.productId);

    return await fetchJson(url);
  }

  async loadCategories() {
    const url = new URL('/api/rest/categories', BACKEND_URL);

    url.searchParams.set('_sort',  'weight');
    url.searchParams.set('_refs',  'subcategory');

    const categories = await fetchJson(url);
    return categories;
  }

  addCategories(categories) {
    return  categories.map( item => {
      return this.addSubcategories(item)
    } ).join('');
  }

  addSubcategories(item) {    
    return item.subcategories.map( subItem => {
      return `<option value=${subItem.id}>${item.title} &gt; ${subItem.title}</option>`;
    } ).join('');
  }

  getTemplate() {
    return `<div class="product-form">
              <form data-element="productForm" class="form-grid">

                <div class="form-group form-group__half_left">
                  <fieldset>
                    <label class="form-label">Название товара</label>
                    <input required="" type="text" id="title" name="title" class="form-control" placeholder="Название товара">
                  </fieldset>
                </div>

                <div class="form-group form-group__wide">
                  <label class="form-label">Описание</label>
                  <textarea required="" class="form-control" id="description"  name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
                </div>

                <div class="form-group form-group__wide" data-element="sortable-list-container">
                  <label class="form-label">Фото</label>
                  <div data-element="imageListContainer">
                    <ul class="sortable-list"></ul>
                  </div>
                  <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
                </div>

                <div class="form-group form-group__half_left">
                  <label class="form-label">Категория</label>
                  <select id = "subcategory" class="form-control" name="subcategory"></select>
                </div>

                <div class="form-group form-group__half_left form-group__two-col">
                  <fieldset>
                    <label class="form-label">Цена ($)</label>
                    <input required="" type="number" id="price" name="price" class="form-control" placeholder="100">
                  </fieldset>

                  <fieldset>
                    <label class="form-label">Скидка ($)</label>
                    <input required="" type="number" id="discount"  name="discount" class="form-control" placeholder="0">
                  </fieldset>
                </div>

                <div class="form-group form-group__part-half">
                  <label class="form-label">Количество</label>
                  <input required="" type="number" class="form-control" id="quantity" name="quantity" placeholder="1">
                </div>

                <div class="form-group form-group__part-half">
                  <label class="form-label">Статус</label>
                  <select class="form-control" id="status" name="status">
                    <option value="1">Активен</option>
                    <option value="0">Неактивен</option>
                  </select>
                </div>

                <div class="form-buttons">
                  <button type="submit" name="save" class="button-primary-outline">
                    Сохранить товар
                  </button>
                </div>

              </form>

            </div>`;
  }

  dispatchEvent(id) {
    let event;

    if (this.productId) event = new CustomEvent("product-updated", {detail: id}); 
    else event = new CustomEvent("product-saved");

    this.element.dispatchEvent(event);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = null;
  }
}
