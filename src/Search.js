/* flow */

import React from 'react';
import './Search.css';

type Props = {
  keyword: string,
  onSearchChange: Function,
  onSearchKeyUp: Function,
}

class Search extends React.Component<Props> {
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
