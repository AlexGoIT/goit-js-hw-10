import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function search({ target: { value } }) {
  const cauntryName = value.trim();

  if (!cauntryName) {
    resetUI();
    return;
  }
  
  fetchCountries(cauntryName).then(renderData).catch(statusError);
}

function renderData(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (data.length > 1) {
    resetUI();

    data.forEach(({ name, flags }) => {
      const marcup = `
      <li class="cauntry-item">
        <img src="${flags.svg}" alt="${name.official}" width="50" />
        <p class="cauntry-name">${name.official}</p>
      </li>
      `;

      refs.countryList.insertAdjacentHTML('beforeend', marcup);
    });
  } else {
    const { name, capital, population, flags, languages } = data[0];

    resetUI();

    const marcup = `
    <div class="cauntry-title">
      <img src="${flags.svg}" alt="${name.official}" width="50" />
      <p class="cauntry-name">${name.official}</p>
    </div>
      <p><span class="cauntry-capital">Capital: </span>${capital}</p>
      <p><span class="cauntry-population">Population: </span>${population}</p>
      <p><span class="cauntry-languages">Languages: </span>${Object.values(
        languages
      ).join(', ')}</p>
    `;

    refs.countryInfo.insertAdjacentHTML('beforeend', marcup);
  }
}

function resetUI() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function statusError() {
  resetUI();
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}
