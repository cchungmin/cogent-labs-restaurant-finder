/* @flow */

import React from 'react';
// $FlowFixMe
import Masonry from 'react-masonry-component';
import './Results.css';

type Props = {
  results: Array<Object>,
  onClick: Function,
};

class Results extends React.Component<Props> {
  static getSizeClassName(num: number) {
    const className = 'grid-item';

    if (num > 10000) {
      return `${className} very-popular`;
    } else if (num < 10000 && num > 5000) {
      return `${className} popular`;
    }

    return className;
  }

  render() {
    const { results, onClick } = this.props;
    const options = {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
    };
    const SingleResult = props => (
      <li
        className={props.sizeClass}
        onClick={props.onClick}
        onKeyDown={props.onClick}
        role="menuitem"
      >
        <div className="result-inner">
          <div className="result-inner-container">
            {props.name}
          </div>
          <p>{props.mainCategoryName}</p>
          <span>{props.count} { props.count <= 1 ? 'Checkin' : 'Checkins'}</span>
        </div>
      </li>
    );
    return (
      <Masonry options={options} elementType="ul" className="grid">
        <li className="grid-sizer">&nbsp;</li>
        {results.map(item => (
          <SingleResult
            key={item.id}
            name={item.name}
            mainCategoryName={item.categories[0].name}
            count={item.stats.checkinsCount}
            sizeClass={Results.getSizeClassName(item.stats.checkinsCount)}
            onClick={() => onClick(item)}
          />
        ))}
      </Masonry>
    );
  }
}

export default Results;
