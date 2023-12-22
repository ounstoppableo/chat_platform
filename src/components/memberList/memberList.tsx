const MemberList = () => {
  const a = [];
  for (let i = 0; i < 100; i++) {
    a.push(
      <div
        key={i}
        className="hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded"
      >
        <div
          className="tw-w-6 tw-rounded-full tw-relative 
                    after:tw-content-[''] after:tw-w-2 after:tw-h-2 after:tw-bg-onlineGreen after:tw-absolute after:tw-bottom-0 after:tw-right-0 after:tw-rounded-full
                  "
        >
          <img
            src="/src/assets/avatar.jpeg"
            alt=""
            className="tw-object-contain tw-rounded-full"
          />
        </div>
        <div className="no-wrap-ellipsis tw-w-3/5">
          名字名字名字名字名字名字名字
        </div>
      </div>
    );
  }
  return (
    <div className="tw-w-full tw-h-full tw-bg-lightGray tw-rounded-lg tw-text-base tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-gap-4">
      <div>在线人数：81</div>
      <div className="tw-flex tw-flex-col tw-gap-1 tw-overflow-auto">
        <div className="hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center  tw-px-0.5 tw-py-1.5 tw-rounded">
          <div
            className="tw-w-6 tw-rounded-full tw-relative 
                        after:tw-content-[''] after:tw-w-2 after:tw-h-2 after:tw-bg-onlineGreen after:tw-absolute after:tw-bottom-0 after:tw-right-0 after:tw-rounded-full
                      "
          >
            <img
              src="/src/assets/avatar.jpeg"
              alt=""
              className="tw-object-contain tw-rounded-full"
            />
          </div>
          <div className="no-wrap-ellipsis tw-w-3/5">
            名字名字名字名字名字名字名字
          </div>
        </div>
        {a}
      </div>
    </div>
  );
};
export default MemberList;
