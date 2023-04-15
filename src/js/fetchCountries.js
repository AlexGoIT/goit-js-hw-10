const URL = 'https://restcountries.com/v3.1/name/';
const params = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export function fetchCountries(name) {
  return fetch(`${URL}${name}?${params}`).then(res => {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    } else {
      return res.json();
    }
  });
}
