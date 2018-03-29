import React, { Component } from 'react';
import QueryString from 'query-string';
import fetch from 'isomorphic-fetch';
import logo from './logo.svg';
import Search from './Search';
import Results from './Results';
import './App.css';

const DEFAULT_CONFIG = {
  apiUrl: 'https://api.foursquare.com/v2',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=',
  locale: 'en',
};

const CREDENTIALS = {
  v: '20171001',
  client_id: '42WJHV4VEVBQBUBZG41UYRSAQVGPB5TFRRGJLTE3WUDYAUNC',
  client_secret: 'RYLXL42G0DK2NFXW0FGWCTH21C53EPXMOD1W1VGFEZWBPSZH',
};

const params = {
  ll: '35.648795,139.702237',
  radius: 1000,
  categoryId: '4d4b7105d754a06374d81259',
  query: '',
};

const CtaContainer = props => (
  <div className="cta-container">
    { typeof props.phone !== 'undefined' ?
      <PhoneCta phone={props.phone} /> : null }
    <a
      className={`mdl-button mdl-js-button mdl-button--raised ${typeof props.phone === 'undefined' ? 'mdl-button--colored' : ''}`}
      target="_blank"
      href={props.mapUrl}
    >
      Show Me the Map
    </a>
  </div>
);

const PhoneCta = props => (
  <span>
    <a
      className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
      href={`tel:${props.phone}`}
    >
      Call Now
    </a>
    &nbsp; or &nbsp;
  </span>
);

function Request(urlString) {
  return new Promise((resolve, reject) => {
    fetch(urlString)
      .then(response => response.json())
      .then(response => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
}

function GeolocationAPI() {
  const BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=';
  const API_KEY = 'AIzaSyD7Jo1KupTPmsJ4OkVZ2zGsXwK2cHFkfHM';

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
    getVenueDetail({ venue_id: venueId }) {
      const urlString = `${DEFAULT_CONFIG.apiUrl}/venues/` +
      `${venueId}?${QueryString.stringify(CREDENTIALS)}`;

      return Request(urlString);
    },
  };
}

class App extends Component {
  constructor(props) {
    super(props);

    this.API = FourSquareAPI();
    this.GeolocationAPI = GeolocationAPI();
  }

  state = {
    venues: [],
    pickedVenue: {},
    isPanelVisible: false,
    keyword: '',
  };

  componentDidMount() {
    this.getVenuesByKeyword();
  }

  getVenuesByKeyword() {
    if (this.state.keyword.length > 0) {
      params.query = this.state.keyword;
    }

    this.API.search(params)
      .then((res) => {
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
      });
  }

  setPickedVenue(item) {
    this.API.getVenueDetail({ venue_id: item.id })
      .then((res) => {
        this.setState({
          pickedVenue: res.response.venue,
        });

        console.log(item);
      });
  }

  closePanel(item) {
    this.setState({
      isPanelVisible: false,
    });

    this.setPickedVenue(item);
  }

  keyUpHandler() {
    this.setState({ isPanelVisible: true });
    this.getVenuesByKeyword();
  }

  changeHandler(keyword) {
    this.setState({ keyword });
  }

  render() {
    const {
      pickedVenue,
      pickedVenueMapUrl,
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
          { typeof pickedVenue.contact !== 'undefined' ?
            <CtaContainer
              phone={pickedVenue.contact.phone}
              mapUrl={pickedVenueMapUrl}
            /> : null }
        </section>
        <section className="search-panel">
          <h3>Or, type something here</h3>
          <Search
            keyword={this.state.keyword}
            onSearchChange={event => this.changeHandler(event)}
            onSearchKeyUp={event => this.keyUpHandler(event)}
          />
        </section>
        <section className="results-panel">
          { this.state.isPanelVisible ?
            <Results
              results={this.state.venues}
              onClick={item => this.closePanel(item)}
            /> : null }
        </section>
      </main>
    );
  }
}

export default App;
