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

  fetchCountries(cauntryName).then(renderData).catch(statusError);
}

function renderData(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    console.info(
      `%c 🔵 Too many matches found. Please enter a more specific name.`,
      'color: blue;'
    );
    return;
  }

  if (data.length === 1) {
    const { name, capital, population, flags, languages } = data[0];

    resetUI();

    const marcup = `
      <img src="${flags.svg}" width="70" heigth="25" />
      <h2>${name.official}</h2>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages).join(', ')}</p>
    `;

    refs.countryInfo.insertAdjacentHTML('beforeend', marcup);
  } else {
    resetUI();

    data.forEach(({ name, flags }) => {
      const marcup = `
    <li>
      <img src="${flags.svg}" width="50" heigth="20" />
      <h2>${name.official}</h2>
    </li>
    `;

      refs.countryList.insertAdjacentHTML('beforeend', marcup);
    });
  }
}

function resetUI() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function statusError(err) {
  resetUI();
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}
