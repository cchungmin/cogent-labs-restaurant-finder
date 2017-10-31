import React, { Component } from 'react';
import logo from './logo.svg';
import Search from './Search';
import Results from './Results';
import './App.css';

const foursquare = require('react-foursquare')({
  clientID: '42WJHV4VEVBQBUBZG41UYRSAQVGPB5TFRRGJLTE3WUDYAUNC',
  clientSecret: 'RYLXL42G0DK2NFXW0FGWCTH21C53EPXMOD1W1VGFEZWBPSZH'
});

var params = {
  ll: '35.648795,139.702237',
  radius: 1000,
  categoryId: '4d4b7105d754a06374d81259',
  query: ''
};

class App extends Component {
  constructor(props) {
     super(props);

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

    foursquare.venues.getVenues(params)
      .then(res => {
        let venues = res.response.venues;
        let pickedVenue = venues[Math.floor(Math.random() * venues.length)];
        let pickedVenueMapUrl = (typeof pickedVenue === 'undefined') ?
            params.ll : pickedVenue.location.lat + ',' +
                pickedVenue.location.lng;

        this.setState({
          venues: venues,
          pickedVenue: pickedVenue || { name: 'Sorry, no result...' },
          pickedVenueMapUrl: 'https://www.google.com/maps/search/?api=1&query=' +
              pickedVenueMapUrl
        });
      });
  }

  setPickedVenue(item) {
    this.setState({
      isPanelVisible: false,
      pickedVenue: item
    });

    foursquare.venues.getVenue({ venue_id: item.id })
      .then(res => {
        console.log(res);
      });
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
    let t = this.state.pickedVenue.contact;
    console.log(t);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cogent Labs Restaurant Finder</h1>
        </header>
        <div className="App-intro">
          <h2>Hey, how about this one?</h2>
          <p>{ this.state.pickedVenue.name }</p>
          { typeof this.state.pickedVenue.contact !== 'undefined'?
            <CtaContainer phone={ this.state.pickedVenue.contact.phone }
                          mapUrl={ this.state.pickedVenueMapUrl }>
            </CtaContainer>: null }
          <h3>Or, type something here:</h3>
          <Search
             onChange={ (event) => this.changeHandler(event) }
             onKeyUp={ () => this.keyUpHandler() }
          />
        </div>
        <div className="results-panel">
          { this.state.isPanelVisible ?
            <Results results={ this.state.venues }
                     onClick={ (item) => this.setPickedVenue(item) }>
            </Results>: null }
        </div>
      </div>
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

export default App;
