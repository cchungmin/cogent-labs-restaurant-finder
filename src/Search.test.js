import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';

it('renders without crashing', () => {
  const searchBox = shallow(
    <Search labelOn="On" labelOff="Off" />
  );

  searchBox.text('Off')

  expect(searchBox.text()).toEqual('Your favorite food type?');
  //searchBox.find('input').simulate('keyDown');
  // expect(searchBox.text()).toEqual('On');
});
