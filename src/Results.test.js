import React from 'react';
import ReactDOM from 'react-dom';
import Results, {SingleResult} from './Results';

it('should render Results without crashing', () => {
  const onClick = sinon.spy();
  const results = [];
  const wrapper = shallow(
    <Results onClick={onClick} results={results}/>
  );
  const div = document.createElement('div');

  ReactDOM.render(<Results onClick={onClick} results={results}/>, div);
});

it('should fire click event', () => {
  const onClick = sinon.spy();
  const results = [];
  const wrapper = shallow(
    <Results onClick={onClick} results={results}/>
  );

  wrapper.simulate('click');
  expect(onClick.calledOnce).toEqual(true);
});
