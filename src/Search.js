import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield">
        <input id="search-bar"
               type="text"
               className="App-search-bar mdl-textfield__input"
               onChange={ (event) => this.props.onChange(event) }
               onKeyUp={ () => this.props.onKeyUp() }/>
        <label className="mdl-textfield__label" htmlFor="search-bar">Your favorite food type?</label>
      </div>
    );
  }
};

export default Search;
