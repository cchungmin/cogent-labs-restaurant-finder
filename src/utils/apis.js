/* @flow */

import QueryString from 'query-string';
import settings from '../settings.json';
import Request from './request';

const CREDENTIALS = {
  v: settings.foursquare.v,
  client_id: settings.foursquare.client_id,
  client_secret: settings.foursquare.client_secret,
};

const params = {
  ll: '',
  radius: 1000,
  categoryId: '4d4b7105d754a06374d81259',
  query: '',
};

const BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=';
const API_KEY = settings.googleMap.apiKey;

export const urlConfig = {
  apiUrl: 'https://api.foursquare.com/v2',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=',
  locale: 'en',
};

export const getGeolocation = () => (
  fetch(BASE_URL + API_KEY, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
);

export const searchRestaurants = (query: string, ll: string) => {
  const newParams = { ...params, query, ll };
  const urlString = `${urlConfig.apiUrl}/venues/search?` +
  `${QueryString.stringify(newParams)}&${QueryString.stringify(CREDENTIALS)}`;
  return Request(urlString);
};

export const getRestaurantDetail = ({ venue_id: venueId }: Object) => {
  const urlString = `${urlConfig.apiUrl}/venues/` +
  `${venueId}?${QueryString.stringify(CREDENTIALS)}`;
  return Request(urlString);
};
