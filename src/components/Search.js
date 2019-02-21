/* flow */

import React from 'react';
import {
  Input,
  InputLabel,
  Grid,
} from '@material-ui/core';
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
      <Grid container direction="column">
        <Grid item>
          <InputLabel
            htmlFor="search-bar"
          >
            Your favorite food type?
          </InputLabel>
        </Grid>
        <Grid item>
          <Input
            id="search-bar"
            type="text"
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            value={keyword}
          />
        </Grid>
      </Grid>
    );
  }
}

export default Search;
