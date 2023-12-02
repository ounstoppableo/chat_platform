import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>抱歉，你输入的网页找不到！</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
