import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';

it('should fire change event', () => {
  const onInputChange = sinon.spy();
  const searchBox = shallow(
    <Search onChange={onInputChange} />
  );

  searchBox.find('input').simulate('change');
  expect(onInputChange.calledOnce).toEqual(true);
});

it('should fire keyDown event', () => {
  const onInputKeyUp = sinon.spy();
  const searchBox = shallow(
    <Search onKeyUp={onInputKeyUp} />
  );

  searchBox.find('input').simulate('keyUp');
  expect(onInputKeyUp.calledOnce).toEqual(true);
});
