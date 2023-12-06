import { Outlet } from 'react-router-dom';
const layout = () => {
  return (
    <>
      <div className={`tw-h-screen tw-relative tw-bg-temple tw-bg-cover`}>
        <div
          className={`tw-absolute tw-inset-x-44 tw-inset-y-20 tw-rounded-2xl tw-flex tw-bg-deepGray tw-overflow-hidden tw-gap-5 tw-p-5`}
        >
          <div style={{ flex: 1 }}>
            <Outlet></Outlet>
          </div>
          <div style={{ flex: 4 }}>
            <Outlet></Outlet>
          </div>
          <div style={{ flex: 8 }}>
            <Outlet></Outlet>
          </div>
          <div style={{ flex: 3 }}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  );
};
export default layout;
