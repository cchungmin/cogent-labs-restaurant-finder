import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import './Results.css';

class Results extends Component {
  static getSizeClassName(num) {
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
    return (
      <Masonry options={options} elementType="ul" className="grid">
        <li className="grid-sizer"></li>
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

function SingleResult() {
  const {
    sizeClass,
    name,
    mainCategoryName,
    count,
    onClick,
  } = this.props;
  return (
    <li
      className={sizeClass}
      onClick={onClick}
      onKeyDown={this.handleKeyDown}
      role="menuitem"
    >
      <div className="result-inner">
        <div className="result-inner-container">
          {name}
        </div>
        <p>{mainCategoryName}</p>
        <span>{count} { count <= 1 ? 'Checkin' : 'Checkins'}</span>
      </div>
    </li>
  );
}

export default Results;
