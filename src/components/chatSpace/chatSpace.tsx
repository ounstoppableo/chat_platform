const ChatSpace = () => {
  const a = [];
  for (let i = 0; i < 100; i++) {
    const rand = Math.random();
    a.push(
      <div className="tw-flex tw-gap-2">
        <div className="tw-w-10">
          {rand > 0.5 ? (
            <img
              src="http://8.130.54.105/assets/avatar.jpeg"
              alt=""
              className="tw-w-10 tw-rounded-full tw-object-contain"
            />
          ) : (
            <></>
          )}
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-overflow-hidden">
          <div
            className={`tw-text-textGrayColor tw-text-xs ${
              rand > 0.5 ? '' : 'tw-self-end'
            } tw-flex tw-flex-row${rand > 0.5 ? '' : '-reverse'}`}
          >
            <span>unstoppable</span>&nbsp;<span>{`(${'北京'})`}</span>
          </div>
          <div
            className={`tw-bg-messageBackground tw-py-2 tw-px-4 ${
              rand > 0.5 ? '' : 'tw-self-end'
            } tw-w-fit tw-max-w-full tw-break-words tw-rounded-2xl ${
              rand > 0.5 ? 'tw-rounded-tl-none' : 'tw-rounded-tr-none'
            }`}
          >
            {i}
          </div>
        </div>
        <div className="tw-w-10">
          {rand < 0.5 ? (
            <img
              src="http://8.130.54.105/assets/avatar.jpeg"
              alt=""
              className="tw-w-10 tw-rounded-full tw-object-contain"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="tw-flex tw-flex-col tw-bg-lightGray tw-w-full tw-h-full tw-rounded-lg tw-overflow-hidden tw-pb-14 tw-relative">
      <div className="tw-h-12 tw-w-full tw-bg-chatSpaceHeader tw-text-base tw-flex tw-items-center tw-pl-2">
        全员总群
      </div>
      <div className="tw-flex-1 tw-flex tw-gap-5 tw-flex-col tw-px-5 tw-overflow-y-auto tw-pt-4 tw-pb-4">
        {a}
      </div>
      <div className="tw-h-10 tw-absolute tw-inset-x-5 tw-bottom-4 tw-bg-chatSpaceFooter tw-rounded-lg"></div>
    </div>
  );
};
export default ChatSpace;
