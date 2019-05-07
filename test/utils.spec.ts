'use strict';

import { removeListSingleSlash } from '../src/helper/utils';

describe('utils file', () => {
  describe('removeListSingleSlash function', () => {
    const array = [
      {input: 'test', output: 'test'},
      {input: 'test/', output: 'test'},
      {input: 'test//', output: 'test/'},
      {input: '/test', output: '/test'},
      {input: '/test/', output: '/test'},
      {input: '', output: ''}
    ];

    array.forEach((item) => {
      it(`${item.input} - ${item.output}`, () => {
        expect(removeListSingleSlash(item.input)).toBe(item.output);
      });
    });
  });
});
