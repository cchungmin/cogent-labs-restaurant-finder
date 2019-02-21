/* @flow */

import * as React from 'react';
import QueryString from 'query-string';
import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import Search from './Search';
import Results from './Results';
import settings from './settings.json';
import './App.css';

const DEFAULT_CONFIG = {
  apiUrl: 'https://api.foursquare.com/v2',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=',
  locale: 'en',
};

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

type CtaProps = {
  phone: number,
  mapUrl?: string,
};

type PhoneCtaProps = {
  phone: number,
};

const CtaContainer = ({ phone, mapUrl }: CtaProps) => (
  <div className="cta-container">
    {
      typeof phone !== 'undefined' ?
        <PhoneCta phone={phone} /> : null
    }
    <a
      className={`mdl-button mdl-js-button mdl-button--raised ${typeof phone === 'undefined' ? 'mdl-button--colored' : ''}`}
      target="_blank"
      rel="noopener noreferrer"
      href={mapUrl}
    >
      Show Me the Map
    </a>
  </div>
);

CtaContainer.defaultProps = {
  mapUrl: '',
};

const PhoneCta = ({ phone }: PhoneCtaProps) => (
  <span>
    <a
      className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
      href={`tel:${phone}`}
      rel="noopener noreferrer"
    >
      Call Now
    </a>
    &nbsp; or &nbsp;
  </span>
);

function Request(urlString) {
  return new Promise<void>((resolve, reject) => {
    fetch(urlString)
      .then(response => response.json())
      .then(response => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
}

function GeolocationAPI() {
  return {
    getLocation() {
      return fetch(BASE_URL + API_KEY, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    },
  };
}

function FourSquareAPI() {
  return {
    search() {
      const urlString = `${DEFAULT_CONFIG.apiUrl}/venues/search?` +
      `${QueryString.stringify(params)}&${QueryString.stringify(CREDENTIALS)}`;

      return Request(urlString);
    },
    getVenueDetail({ venue_id: venueId }: Object) {
      const urlString = `${DEFAULT_CONFIG.apiUrl}/venues/` +
      `${venueId}?${QueryString.stringify(CREDENTIALS)}`;

      return Request(urlString);
    },
  };
}

type Props = {};

type State = {
  venues: Array<string>,
  pickedVenue: Object,
  isPanelVisible: boolean,
  keyword: string,
  pickedVenueMapUrl: string,
};

class App extends React.Component<Props, State> {
  static defautProps = {
    mapUrl: '',
  }

  state = {
    venues: [],
    pickedVenue: {},
    isPanelVisible: false,
    keyword: '',
    pickedVenueMapUrl: '',
  };

  API = FourSquareAPI();

  GeolocationAPI = GeolocationAPI();

  componentDidMount() {
    this._getGeoLocation();
  }

  getVenuesByKeyword() {
    const { keyword } = this.state;
    if (keyword.length > 0) params.query = keyword;

    this.API.search()
      .then((res) => {
        if (res && res.response) {
          const { venues } = res.response;
          let pickedVenue = venues[Math.floor(Math.random() * venues.length)];
          let pickedVenueMapUrl;

          if (typeof pickedVenue === 'undefined') {
            pickedVenue = { name: 'Sorry, no result...' };
            pickedVenueMapUrl = params.ll;
          } else {
            this.setPickedVenue(pickedVenue);
            pickedVenueMapUrl = `${pickedVenue.location.lat},${
              pickedVenue.location.lng}`;
          }

          this.setState({
            venues,
            pickedVenueMapUrl: DEFAULT_CONFIG.mapUrl + pickedVenueMapUrl,
          });
        }
      });
  }

  setPickedVenue(item: Object) {
    this.API.getVenueDetail({ venue_id: item.id })
      .then((res) => {
        if (res && res.response) {
          this.setState({
            pickedVenue: res.response.venue,
          });
        }
      });
  }

  keyUpHandler = () => {
    this.setState({ isPanelVisible: true });
    this.getVenuesByKeyword();
  }

  changeHandler = (keyword: string) => {
    this.setState({ keyword });
  }

  closePanel(item: Object) {
    this.setState({
      isPanelVisible: false,
    });

    this.setPickedVenue(item);
  }

  _getGeoLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        params.ll = `${pos.lat},${pos.lng}`;
        this.getVenuesByKeyword();
      });
    } else {
      // Browser doesn't support Geolocation
    }
  }

  render() {
    const {
      pickedVenue,
      pickedVenueMapUrl,
      keyword,
      isPanelVisible,
      venues,
    } = this.state;
    return (
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Restaurant Finder</h1>
        </header>
        <section className="App-intro">
          <h2>Hey, how about this one?</h2>
          <div className="picked-card mdl-card mdl-shadow--4dp">
            <div className="mdl-card__media">
              { typeof pickedVenue.bestPhoto !== 'undefined' ?
                <img src={`${pickedVenue.bestPhoto.prefix}width300${pickedVenue.bestPhoto.suffix}`} alt={pickedVenue.name} /> : null
              }
            </div>
            <div className="mdl-card__supporting-text">
              <h5>{ pickedVenue.name }</h5>
              <h4>{ pickedVenue.rating || 'N/A' }</h4>
              <p>{ typeof pickedVenue.hours !== 'undefined' ? `In service. ${pickedVenue.hours.status}` : 'Out of service' }</p>
            </div>
            <div className="mdl-card__supporting-text">
              {
                typeof pickedVenue.categories !== 'undefined' ?
                  pickedVenue.categories.map(item => (
                    <span key={item.id}>
                      <img
                        className="picked-venue-icon"
                        src={`${item.icon.prefix}64${item.icon.suffix}`}
                        alt={item.icon.name}
                      />
                    </span>
                  )) : null
              }
            </div>
          </div>
          {
            typeof pickedVenue.contact !== 'undefined' ?
              (
                <CtaContainer
                  phone={pickedVenue.contact.phone}
                  mapUrl={pickedVenueMapUrl}
                />
              ) : null
          }
        </section>
        <section className="search-panel">
          <h3>Or, type something here</h3>
          <Search
            keyword={keyword}
            onSearchChange={this.changeHandler}
            onSearchKeyUp={this.keyUpHandler}
          />
        </section>
        <section className="results-panel">
          {
            isPanelVisible ?
              (
                <Results
                  results={venues}
                  onClick={item => this.closePanel(item)}
                />
              ) : null
          }
        </section>
      </main>
    );
  }
}

export default App;
