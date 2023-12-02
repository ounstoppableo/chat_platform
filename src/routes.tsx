import ErrorPage from '@/view/errorPage/errorPage.tsx';
export default [
  {
    path: '/',
    element: <div>Hello world!</div>,
    errorElement: <ErrorPage />
  }
];
