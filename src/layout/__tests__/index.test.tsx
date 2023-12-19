import {create} from 'react-test-renderer';
import Layout from '..';

it('renders Layout correct', () => {
  const tree = create(<Layout />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});