/* flow */

import React from 'react';
import './Search.css';

type Props = {
  keyword: string,
  onSearchChange: Function,
  onSearchKeyUp: Function,
}

class Search extends React.Component<Props> {
  handleChange = (event) => {
    const { onSearchChange } = this.props;
    onSearchChange(event.target.value);
  }

  handleKeyUp = (event) => {
    const { onSearchKeyUp } = this.props;
    onSearchKeyUp(event.target.value);
  }

  render() {
    const { keyword } = this.props;
    return (
      <div className="mdl-textfield mdl-js-textfield">
        <label
          className="mdl-textfield__label"
          htmlFor="search-bar"
        >
          Your favorite food type?
          <input
            id="search-bar"
            type="text"
            className="App-search-bar mdl-textfield__input"
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            value={keyword}
          />
        </label>
      </div>
    );
  }
}

export default Search;
