import React from 'react';
import ReactDOM from 'react-dom';
import Results, {SingleResult} from './Results';

it('should fire click event', () => {
  const onClick = sinon.spy();
  const results = [];
  const wrapper = shallow(
    <Results onClick={onClick} results={results}/>
  );

  wrapper.simulate('click');
  expect(onClick.calledOnce).toEqual(true);
});
