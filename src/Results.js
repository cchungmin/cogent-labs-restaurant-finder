import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import './Results.css';

class Results extends Component {
  getSizeClassName(num) {
    let className = 'grid-item'

    if (num > 10000) {
      return className + ' very-popular';
    } else if (num < 10000 && num > 5000){
      return className + ' popular';
    }

    return className;
  }

  render() {
    let options = {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true
    };

    return (
      <Masonry options={options} elementType={'ul'} className="grid">
        <li className="grid-sizer"></li>
        {this.props.results.map(item => {
          return (
              <SingleResult
                key={item.id}
                name={item.name}
                sizeClass={this.getSizeClassName(item.stats.checkinsCount)}
                onClick={() => this.props.onClick(item)}/>
          )
        })}
      </Masonry>
    );
  }
};

function SingleResult(props) {
  return (
    <li className={props.sizeClass} onClick={props.onClick}>
      <div className="result-inner">
        <div className="result-inner-container">
          {props.name}
        </div>
      </div>
    </li>
  );
}

export default Results;
