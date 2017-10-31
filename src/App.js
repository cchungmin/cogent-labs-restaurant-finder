import React, { Component } from 'react';
import logo from './logo.svg';
import Search from './Search';
import Results from './Results';
import './App.css';

var foursquare = require('react-foursquare')({
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
       keyword: '',
       isPanelVisible: false
     };
   }

  getVenuesByKeyword() {
    if (this.state.keyword.length > 0) {
      params.query = this.state.keyword;
    }

    foursquare.venues.getVenues(params)
      .then(res => {
        let venues = res.response.venues;
        this.setState({
          venues: venues,
          pickedVenue: venues[Math.floor(Math.random() * venues.length)]　||
              { name: 'Sorry, no result...' },
          keyword: this.state.keyword
        });
      });
  }

  componentDidMount() {
    this.getVenuesByKeyword();
  }

  keyDownHandler() {
    this.setState({ isPanelVisible: true });
    this.getVenuesByKeyword();
  }

  changeHandler(event) {
    this.setState({ keyword: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cogent Labs Restaurant Finder</h1>
        </header>
        <div className="App-intro">
          <h2>Hey, how about this one?</h2>
          <p>{ this.state.pickedVenue.name }</p>
          <h3>Or, type something here:</h3>
          <Search
             onChange={ (event) => this.changeHandler(event) }
             onKeyDown={ () => this.keyDownHandler() }
          />
        </div>
        <div className="results-panel">
          { this.state.isPanelVisible ? <Results results={ this.state.venues }></Results>: null }
        </div>
      </div>
    );
  }
}

export default App;
