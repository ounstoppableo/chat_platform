import TestView from '@/view/testView/test.tsx';
// import ErrorPage from '@/view/errorPage/errorPage.tsx';
import Layout from '@/layout/index.tsx';
export default [
  {
    path: '/',
    element: <Layout />
  },
  {
    path: '/test',
    element: <TestView />
  }
];
