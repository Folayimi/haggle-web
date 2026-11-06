import { City, Country, State } from "country-state-city";

export function getCountries() {
  return Country.getAllCountries();
}

export function getStates(countryCode: string) {
  return State.getStatesOfCountry(countryCode);
}

export function getCities(countryCode: string, stateCode: string) {
  return City.getCitiesOfState(countryCode, stateCode);
}

export function getCountry(countryCode: string) {
  return Country.getCountryByCode(countryCode);
}
