import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryListContainer: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function search({ target: { value } }) {
  const countryName = value.trim();

  if (!countryName) {
    resetUI();
    return;
  }

  fetchCountries(countryName).then(renderData).catch(statusError);
}

function renderData(countryList) {
  if (countryList.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (countryList.length > 1) {
    resetUI();

    refs.countryListContainer.insertAdjacentHTML(
      'beforeend',
      createCountryListMarkup(countryList)
    );
  } else {
    resetUI();

    refs.countryInfoContainer.insertAdjacentHTML(
      'beforeend',
      createCountryInfoMarkup(countryList)
    );
  }
}

function statusError() {
  resetUI();
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}

function resetUI() {
  refs.countryListContainer.innerHTML = '';
  refs.countryInfoContainer.innerHTML = '';
}

function createCountryListMarkup(countryList) {
  return countryList
      .map(
        ({ name : { official }, flags: { svg } }) => 
          `
      <li class="country-item" data-country="${official}">
        <img src="${svg}" alt="${official}" width="50" />
        <p class="country-name">${official}</p>
      </li>
      `
      )
      .join('');
}

function createCountryInfoMarkup(countryList) {
  const {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  } = countryList[0];

  return `
    <div class="country-info-title">
      <img src="${svg}" alt="${official}" width="50" />
      <p class="country-info-name">${official}</p>
    </div>
      <ul class="country-info-list">
        <li class="country-info-item"><span class="card-field-name">Capital: </span>${capital}</li>
        <li class="country-info-item"><span class="card-field-name">Population: </span>${population}</li>
        <li class="country-info-item"><span class="card-field-name">Languages: </span>${Object.values(
          languages
        ).join(', ')}</li>
      </ul>
    `;
}
