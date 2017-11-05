import React, { Component } from 'react';
import logo from './logo.svg';
import Search from './Search';
import Results from './Results';
import QueryString from 'query-string';
import './App.css';

const DEFAULT_CONFIG = {
  apiUrl: 'https://api.foursquare.com/v2',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=',
  locale: 'en'
};

const CREDENTIALS = {
  v: '20171001',
  client_id: '42WJHV4VEVBQBUBZG41UYRSAQVGPB5TFRRGJLTE3WUDYAUNC',
  client_secret: 'RYLXL42G0DK2NFXW0FGWCTH21C53EPXMOD1W1VGFEZWBPSZH'
};

var params = {
  ll: '35.648795,139.702237',
  radius: 1000,
  categoryId: '4d4b7105d754a06374d81259',
  query: ''
};

class App extends Component {
  constructor(props) {
     super(props);

     this.API = FourSquareAPI();
     this.state = {
       venues: [],
       pickedVenue: {},
       isPanelVisible: false,
       keyword: ''
     };
   }

  getVenuesByKeyword() {
    if (this.state.keyword.length > 0) {
      params.query = this.state.keyword;
    }

    this.API.search(params)
      .then(res => {
        let venues = res.response.venues;
        let pickedVenue = venues[Math.floor(Math.random() * venues.length)];
        let pickedVenueMapUrl;
        console.log(venues);

        if (typeof pickedVenue === 'undefined') {
          pickedVenue = { name: 'Sorry, no result...' };
          pickedVenueMapUrl = params.ll;
        } else {
          this.setPickedVenue(pickedVenue);
          pickedVenueMapUrl = pickedVenue.location.lat + ',' +
                pickedVenue.location.lng;
        }

        this.setState({
          venues: venues,
          pickedVenueMapUrl: DEFAULT_CONFIG.mapUrl + pickedVenueMapUrl
        });
      });
  }

  setPickedVenue(item) {
    this.API.getVenueDetail({ venue_id: item.id })
      .then(res => {
        this.setState({
          pickedVenue: res.response.venue
        });
      });
  }

  closePanel(item) {
    this.setState({
      isPanelVisible: false
    });

    this.setPickedVenue(item);
  }

  componentDidMount() {
    this.getVenuesByKeyword();
  }

  keyUpHandler() {
    this.setState({ isPanelVisible: true });
    this.getVenuesByKeyword();
  }

  changeHandler(event) {
    this.setState({ keyword: event.target.value });
  }

  render() {
    return (
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cogent Labs Restaurant Finder</h1>
        </header>
        <section className="App-intro">
          <h2>Hey, how about this one?</h2>
          <div className="picked-card mdl-card mdl-shadow--4dp">
            <div className="mdl-card__media">
              { typeof this.state.pickedVenue.bestPhoto !== 'undefined' ?
                <img src={ this.state.pickedVenue.bestPhoto.prefix + 'width300' + this.state.pickedVenue.bestPhoto.suffix } alt={this.state.pickedVenue.name}/> : null
              }
            </div>
            <div className="mdl-card__supporting-text">
              <h5>{ this.state.pickedVenue.name }</h5>
              <h4>{ this.state.pickedVenue.rating || 'N/A' }</h4>
              <p>{ typeof this.state.pickedVenue.hours !== 'undefined' ? `In service. ${this.state.pickedVenue.hours.status}` : 'Out of service' }</p>
            </div>
            <div className="mdl-card__supporting-text">
                {
                  typeof this.state.pickedVenue.categories !== 'undefined' ?
                    this.state.pickedVenue.categories.map(item => {
                      return (
                        <span key={item.id}>
                          <img className="picked-venue-icon"
                               src={item.icon.prefix + '64' + item.icon.suffix}
                               alt={item.icon.name} />
                        </span>
                      )
                    }) : null
                }
            </div>
          </div>
          { typeof this.state.pickedVenue.contact !== 'undefined'?
            <CtaContainer phone={ this.state.pickedVenue.contact.phone }
                          mapUrl={ this.state.pickedVenueMapUrl }>
            </CtaContainer>: null }
        </section>
        <section className="search-panel">
          <h3>Or, type something here</h3>
          <Search
             onChange={ (event) => this.changeHandler(event) }
             onKeyUp={ () => this.keyUpHandler() }
          />
        </section>
        <section className="results-panel">
          { this.state.isPanelVisible ?
            <Results results={ this.state.venues }
                     onClick={ (item) => this.closePanel(item) }>
            </Results>: null }
        </section>
      </main>
    );
  }
}

function CtaContainer(props) {
  return (
    <div className="cta-container">
      { typeof props.phone !== 'undefined'?
        <PhoneCta phone={ props.phone }>
        </PhoneCta>: null }
      <a className={`mdl-button mdl-js-button mdl-button--raised ${ typeof props.phone === 'undefined' ? 'mdl-button--colored' : ''}`}
         target="_blank"
         href={ props.mapUrl }>
        Show Me the Map
      </a>
    </div>
  );
}

function PhoneCta(props) {
  return (
    <span>
      <a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
         href={ `tel:${props.phone}` }>
        Call Now
      </a>
      &nbsp; or &nbsp;
    </span>
  );
}

function Request(urlString) {
  return new Promise(
    function(resolve, reject) {
      fetch(urlString)
        .then((response) => response.json())
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    }
  )
}

function FourSquareAPI() {
  return {
    search: function(params) {
      let urlString = DEFAULT_CONFIG.apiUrl + '/venues/search?' +
        QueryString.stringify(params) + '&' + QueryString.stringify(CREDENTIALS);

      return Request(urlString);
    },
    getVenueDetail: function(params) {
      let urlString = DEFAULT_CONFIG.apiUrl + '/venues/' +
          params.venue_id + '?' + QueryString.stringify(CREDENTIALS);

      return Request(urlString);
    }
  }
}

export default App;
