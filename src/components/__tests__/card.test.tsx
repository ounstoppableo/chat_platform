import {create} from 'react-test-renderer';
import Card from '../card/card';

it('renders correctly', () => {
  const tree = create(<Card />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});