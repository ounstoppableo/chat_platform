const ChatRelation = () => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      <div className="tw-h-16 tw-rounded-lg tw-bg-chatRelationActive tw-flex tw-p-3 tw-gap-3 tw-items-center">
        <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
          <img
            src="http://8.130.54.105/assets/avatar.jpeg"
            alt=""
            className="tw-w-full tw-h-full tw-object-contain"
          />
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
          <div className="no-wrap-ellipsis">全员总群</div>
          <div className="no-wrap-ellipsis tw-text-textGrayColor tw-text-xs">
            22222222222222222222222222222222222222222222222222222222222
          </div>
        </div>
        <div className="tw-w-14 tw-text-textGrayColor tw-text-xs tw-flex tw-items-center">
          12月04日
        </div>
      </div>
    </div>
  );
};
export default ChatRelation;
