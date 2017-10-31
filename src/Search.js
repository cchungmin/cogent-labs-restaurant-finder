import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
  render() {
    return (
      <input type="text"
             className="App-search-bar"
             placeholder="Your favorite food type?"
             onChange={ (event) => this.props.onChange(event) }
             onKeyDown={ () => this.props.onKeyDown() }/>
    );
  }
};

export default Search;
