import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
// axios.get('/users').then(res => {
//   console.log(res.data);
// });

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.load-more');

let lastSearchQuery = '';
//додай відображення підписів до зображень з атрибута alt. Нехай підпис буде знизу
//і з'являється через 250 мілісекунд після відкриття зображення.
const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

class SearchesPixabay {
  constructor() {
    this.page = 1;
    this.per_page = 40;
    this.searchQuery = '';
  }

  fetchPixabay() {
    const API_KEY = `31807815-f192f6f9aa73198d509365ba4`;
    const URL_BASE = `https://pixabay.com/api/`;

    return fetch(
      `${URL_BASE}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation="horizontal"&safesearch=true&page=${this.page}&per_page=${this.per_page}`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(
            'Sorry, there are no images matching your search. Please try again.'
          );
        }
        return res.json();
      })
      .then(data => {
        this.nextPage();
        return data;
      });
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

//! екземпляр класу
const searchesPixabay = new SearchesPixabay();
console.log(searchesPixabay);
// searchesPixabay.fetchPixabay();

form.addEventListener('submit', onSearcherSubmit);
btn.addEventListener('click', getPhotos);

function onSearcherSubmit(e) {
  e.preventDefault();
  const value = e.currentTarget.searchQuery.value.trim().toLowerCase();
  console.log(value);

  btn.classList.add('is-hidden');

  if (value === '') {
    Notify.info('Please, enter what do you want to search');
    return;
  }
  if (value === searchesPixabay.query) {
    Notify.warning(
      `We already found images for "${value.toUpperCase()}.
      Please, enter another phrase`
    );
    return;
  }

  searchesPixabay.query = value;
  searchesPixabay.resetPage();
  clearGalleryContent();
  getPhotos();
}

function getPhotos() {
  searchesPixabay
    .fetchPixabay()
    .then(data => {
      if (data.total === 0) {
        Notify.failure(
          `Sorry, there are no images matching your search. Please try again.`
        );
        return;
      }
      if (data.hits.length < 40) {
        Notify.info('These are all the images we found for your search query.');
        btn.classList.add('is-hidden');
      } else {
        btn.classList.remove('is-hidden');
      }
      btn.classList.remove('is-hidden');
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      insertGalleryContent(data.hits);
      galleryLightbox.refresh();
    })
    .catch(err => console.error(err));
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a href="${largeImageURL}" class="card-link js-card-link"

><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo"

/>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>
    </a>`;
}

//генеруємо 40 карток
const generateGalleryContent = array =>
  array.reduce((acc, item) => acc + createMarkup(item), '');

//додаємо в DOM галерею
// const insertGalleryContent = array =>
//   gallery.insertAdjacentHTML('beforeend', generateGalleryContent(array));
const insertGalleryContent = array => {
  const result = generateGalleryContent(array);
  gallery.insertAdjacentHTML('beforeend', result);
};

function clearGalleryContent() {
  gallery.innerHTML = '';
}
