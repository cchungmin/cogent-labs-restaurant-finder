import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Search.css';

class Search extends Component {
  static propTypes = {
    keyword: PropTypes.string,
    onSearchChange: PropTypes.func,
    onSearchKeyUp: PropTypes.func,
  };

  static defaultProps = {
    keyword: '',
    onSearchChange: () => ('Hello'),
    onSearchKeyUp: () => ('World'),
  };

  handleChange = (event) => {
    this.props.onSearchChange(event.target.value);
  }

  handleKeyUp = (event) => {
    this.props.onSearchKeyUp(event.target.value);
  }

  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield">
        <input
          id="search-bar"
          type="text"
          className="App-search-bar mdl-textfield__input"
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          value={this.props.keyword}
        />
        <label
          className="mdl-textfield__label"
          htmlFor="search-bar"
        >
          Your favorite food type?
        </label>
      </div>
    );
  }
};

export default Search;
