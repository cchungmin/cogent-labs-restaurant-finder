/* @flow */

import * as React from 'react';
import debounce from 'lodash.debounce';

import {
  searchRestaurants,
  getRestaurantDetail,
  urlConfig,
} from '../utils/apis';
import logo from './logo.svg';
import LuckyPicked from './LuckyPicked';
import Search from './Search';
import Results from './Results';
import './App.css';

type Props = {};

type State = {
  venues: Array<string>,
  pickedVenue: Object,
  isPanelVisible: boolean,
  keyword: string,
  pickedVenueMapUrl: string,
  ll: string,
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
    ll: '',
  };

  componentDidMount() {
    this._init();
  }

  getVenuesByKeyword = () => {
    const { keyword, ll } = this.state;
    searchRestaurants(keyword, ll)
      .then((res) => {
        if (res && res.response) {
          const { venues } = res.response;
          let pickedVenue = venues[Math.floor(Math.random() * venues.length)];
          let pickedVenueMapUrl;

          if (typeof pickedVenue === 'undefined') {
            pickedVenue = { name: 'Sorry, no result...' };
            pickedVenueMapUrl = ll;
          } else {
            this.setPickedVenue(pickedVenue);
            pickedVenueMapUrl = `${pickedVenue.location.lat},${
              pickedVenue.location.lng}`;
          }

          this.setState({
            venues,
            pickedVenueMapUrl: urlConfig.mapUrl + pickedVenueMapUrl,
          });
        }
      });
  }

  setPickedVenue = (item: Object) => {
    getRestaurantDetail({ venue_id: item.id })
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
    debounce(() => this.getVenuesByKeyword(), 800);
  }

  changeHandler = (keyword: string) => {
    this.setState({ keyword });
  }

  closePanel = (item: Object) => {
    this.setState({
      isPanelVisible: false,
    });

    this.setPickedVenue(item);
  }

  _init() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({
          ll: `${pos.lat},${pos.lng}`,
        });
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
          <LuckyPicked
            pickedVenue={pickedVenue}
            pickedVenueMapUrl={pickedVenueMapUrl}
          />
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
