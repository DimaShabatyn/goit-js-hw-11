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
btn.style.display = 'none';
let page = 1;
const per_page = 40;
//додай відображення підписів до зображень з атрибута alt. Нехай підпис буде знизу
//і з'являється через 250 мілісекунд після відкриття зображення.
const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

form.addEventListener('submit', onSearcherSubmit);
btn.addEventListener('click', onLoadMore);

// function onLoadMore() {
//   const querySearch = form.searchQuery.value;
//   createNextPage();
//   console.log(page);
//   fetchPixabay(querySearch, page)
//     .then(data => {
//       console.log(page);
//       console.log(data);

//       insertGalleryContent(data.hits);
//       galleryLightbox.refresh();
//       if (data.hits.length < 40) {
//         btn.style.display = 'none';
//       } else {
//         btn.style.display = 'block';
//       }
//     })
//     .catch(err => console.error(err));
// }

// function onSearcherSubmit(e) {
//   e.preventDefault();
//   const querySearch = e.currentTarget.searchQuery.value;
//   clearGalleryContent();
//   page = 1;

//   if (querySearch === '') {
//     Notify.info('Please, enter what do you want to search 😉');
//     return;
//   }
//   fetchPixabay(querySearch, page)
//     .then(data => {
//       console.log(data.totalHits);

//       if (data.total === 0) {
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//         return;
//       }
//       Notify.success(`Hooray! We found ${data.totalHits} images.`);
//       insertGalleryContent(data.hits);
//       galleryLightbox.refresh();
//       if (data.hits.length < 40) {
//         btn.style.display = 'none';
//       } else {
//         btn.style.display = 'block';
//       }
//     })
//     .catch(err => console.error(err));
// }

// function fetchPixabay(query, page) {
//   const API_KEY = `31807815-f192f6f9aa73198d509365ba4`;
//   const URL_BASE = `https://pixabay.com/api/`;

//   return fetch(
//     `${URL_BASE}?key=${API_KEY}&q=${query}&image_type=photo&orientation="horizontal"&safesearch=true&page=${page}&per_page=${per_page}`
//   ).then(res => {
//     if (!res.ok) {
//       throw new Error(res.status);
//     }
//     return res.json();
//   });
// }

// //створює розмітку для однієї карточки
// function createMarkup({
//   webformatURL,
//   largeImageURL,
//   tags,
//   likes,
//   views,
//   comments,
//   downloads,
// }) {
//   return `<a href="${largeImageURL}" class="card-link js-card-link"

// ><div class="photo-card">
//         <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo"

// />
//         <div class="info">
//           <p class="info-item">
//             <b>Likes</b> ${likes}
//           </p>
//           <p class="info-item">
//             <b>Views</b> ${views}
//           </p>
//           <p class="info-item">
//             <b>Comments</b> ${comments}
//           </p>
//           <p class="info-item">
//             <b>Downloads</b> ${downloads}
//           </p>
//         </div>
//       </div>
//     </a>`;
// }

// //генеруємо 40 карток
// const generateGalleryContent = array =>
//   array.reduce((acc, item) => acc + createMarkup(item), '');

// //додаємо в DOM галерею
// // const insertGalleryContent = array =>
// //   gallery.insertAdjacentHTML('beforeend', generateGalleryContent(array));
// const insertGalleryContent = array => {
//   const result = generateGalleryContent(array);
//   gallery.insertAdjacentHTML('beforeend', result);
// };

// function clearGalleryContent() {
//   gallery.innerHTML = '';
// }

// function createNextPage() {
//   page += 1;
// }
// //додай відображення підписів до зображень з атрибута alt. Нехай підпис буде знизу
// //і з'являється через 250 мілісекунд після відкриття зображення.
// const lightbox = new SimpleLightbox('.gallery a', {
//     captionsData: 'alt',
//     captionPosition: 'bottom',
//     captionDelay: 250,
// });

// !----AXIOS-----!

async function onLoadMore() {
  const querySearch = form.searchQuery.value;
  createNextPage();
  console.log(page);
  try {
    const data = await fetchPixabay(querySearch, page);
    console.log(page);
    console.log(data);

    insertGalleryContent(data.hits);
    galleryLightbox.refresh();
    if (data.hits.length < 40) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
  }
}

async function onSearcherSubmit(e) {
  e.preventDefault();
  const querySearch = e.currentTarget.searchQuery.value;
  clearGalleryContent();
  page = 1;

  if (querySearch === '') {
    Notify.info('Please, enter what do you want to search 😉');
    return;
  }
  try {
    const data = await fetchPixabay(querySearch, page);

    console.log(data.totalHits);

    if (data.total === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    insertGalleryContent(data.hits);
    galleryLightbox.refresh();
    if (data.hits.length < 40) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchPixabay(query, page) {
  const API_KEY = `31807815-f192f6f9aa73198d509365ba4`;
  const URL_BASE = `https://pixabay.com/api/`;
  const url = `${URL_BASE}?key=${API_KEY}&q=${query}&image_type=photo&orientation="horizontal"&safesearch=true&page=${page}&per_page=${per_page}`;

  try {
      const { data } = await axios.get(url);
      console.log(await axios.get(url));
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

//створює розмітку для однієї карточки
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

function createNextPage() {
  page += 1;
}
//додай відображення підписів до зображень з атрибута alt. Нехай підпис буде знизу
//і з'являється через 250 мілісекунд після відкриття зображення.
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
