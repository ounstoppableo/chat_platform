import TestView from '@/view/testView/test.tsx';
// import ErrorPage from '@/view/errorPage/errorPage.tsx';
import Layout from '@/layout/index.tsx';
import Card from '@/components/card/card.tsx';
export default [
  {
    path: '/',
    element: <Layout />,
    children: [{ path: '', element: <Card /> }]
  },
  {
    path: '/test',
    element: <TestView />
  }
];
