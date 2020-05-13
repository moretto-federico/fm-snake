
import React from 'react';
import { shallow } from 'enzyme';

describe('ES6', () => {
  test('Default Parameter Values', () => {
    const defaultParameterValues = (x = 1) => {
      return x;
    };
    expect(defaultParameterValues()).toBe(1);
  });

  test('Rest Parameter', () => {
    const testParameter = (x, ...others) => {
      return others;
    };
    expect(testParameter(1, 2, 3)).toEqual([2, 3]);
  });

  test('Spread Operator', () => {
    const arr1 = [1, 2, 3];
    expect([...arr1, 4]).toEqual([1, 2, 3, 4]);
  });
})