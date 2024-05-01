// import ErrorPage from '@/view/errorPage/errorPage.tsx';
import Layout from '@/layout/index.tsx';
import { Navigate } from 'react-router-dom';

export default [
  {
    path: '/',
    element: <Layout />
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
];
