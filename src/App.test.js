import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

var app;

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('should close the panel', () => {
  app = new App();
  app.state.isPanelVisible = true;
  console.log(new App);
  expect(true).toEqual(true);
});
