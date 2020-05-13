
import React, { useState, useEffect } from 'react';
import { shallow, mount } from 'enzyme';

function Hello() {
  return <h1>Hello!</h1>;
}


test('renders the heading', () => {
  const result = shallow(<Hello />).contains(<h1>Hello!</h1>);
  expect(result).toBeTruthy();
});


function LoadObjects({ loader }) {
  const [object, setObject] = useState();
  useEffect(() => {
    loader().then(obj => setObject(obj));
  })
  return <h1>{object ? object : 'undefined'}</h1>;
}

test('mounted', async () => {
  const laoder = jest.fn().mockResolvedValue('Loaded');
  const wrapper = mount(<LoadObjects loader={laoder} />);
  expect(wrapper.contains(<h1>undefined</h1>)).toBeTruthy();
  expect(laoder).toBeCalled();
  await new Promise(setImmediate);
  wrapper.update();
  expect(wrapper.contains(<h1>Loaded</h1>)).toBeTruthy();
});