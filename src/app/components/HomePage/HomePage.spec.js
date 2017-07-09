import { expect, shallow, React } from '../../../../tests/config/test.helper';
import HomePage from './HomePage';

const baseProps = {};

describe('Settings Container', () => {
  it('should have an id of home-page', () => {
    const wrapper = shallow(<HomePage { ...baseProps } />);
    expect(wrapper.at(0)).to.have.prop('id', 'home-page');
  });
  //  unit testing goes here
});
