import { searchApi } from './searchApi';
import { calcScrollValue } from './scroll';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.replace('load-more', 'load-more-hidden');

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

const search = new searchApi();
let sumPages = 0;
form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  close: true,
  closeText: '×',
  nav: true,
  navText: ['←', '→'],
  overlay: true,
  overlayOpacity: 0.5,
  showCounter: true,
  animationSlide: true,
  widthRatio: 0.8,
  heightRatio: 0.8,
});

function onSubmit(e) {
  e.preventDefault();
  clearPage();
  search.query = e.target.searchQuery.value.trim().toLowerCase();
  if (search.query === '') {
    // loadMoreBtn.disabled = true;
    loadMoreBtn.classList.replace('load-more', 'load-more-hidden');

    setTimeout(() => {
      Notiflix.Notify.failure(
        'The search string cannot be empty. Please specify your search query.'
      );
      //   loadMoreBtn.classList.replace('load-more-hidden', 'load-more');

      //   loadMoreBtn.disabled = false;
    }, 1000);
    return;
  }
  searchImages().then(data => {
    if (data) {
      Notiflix.Notify.success(`Hooray! We found ${data} images.`);
    }
  });
}

function onLoadMore() {
  search.increasePage();
  searchImages();
  scrollPage();
}

async function searchImages() {
  const images = await search.onSearchPhoto();
  const { hits, total, totalHits } = images;
  console.log(totalHits);
  sumPages = hits.length;
  try {
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    } else {
      loadMoreBtn.disabled = false;
    }
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    simpleLightBox.refresh();
    if (sumPages < total) {
      loadMoreBtn.classList.replace('load-more-hidden', 'load-more');
      loadMoreBtn.disabled = false;
    }
    if (sumPages >= total) {
      loadMoreBtn.classList.replace('load-more', 'load-more-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    console.log(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    form.reset();
  }
  return hits, total, totalHits;
}

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
  return markup;
}

function clearPage() {
  search.resetPage();
  gallery.innerHTML = '';
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
