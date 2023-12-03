import { render } from '@testing-library/react';
import TestView from '@/view/testView/test';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import user from '@testing-library/user-event';

test('点击测试完成', async () => {
  const { container } = render(
    <Provider store={store}>
      <TestView />
    </Provider>
  );
  const incrementButton = await container.querySelector(
    '[aria-label="Increment value"]'
  );
  const decrementButton = await container.querySelector(
    '[aria-label="Decrement value"]'
  );
  const span = await container.querySelector('span');
  expect(span?.innerHTML).toBe('0');
  await user.click(incrementButton as any);
  expect(span?.innerHTML).toBe('1');
  await user.click(decrementButton as any);
  expect(span?.innerHTML).toBe('0');
});
