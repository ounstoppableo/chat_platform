import socketContext from '@/context/socketContext';
import { addGroupMember, getFriends } from '@/service/addRelationLogic';
import { Modal, Transfer, message } from 'antd';
import { useContext, useEffect, useState } from 'react';

const useRelationCtrl = (props: any) => {
  const { groupMember, groupId, groupName, authorBy } = props;
  const [data, setData] = useState([]);
  const [modal, setModal] = useState<any>(null);
  const [targetKeys, setTargetKeys] = useState([]);
  const socket = useContext(socketContext);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const onChange = (nextTargetKeys: any) => {
    setTargetKeys(nextTargetKeys);
  };
  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const reset = () => {
    setData([]);
    setModal(null);
    setTargetKeys([]);
    setSelectedKeys([]);
  };
  const onCancel = () => {
    modal.destroy();
    reset();
  };
  const onConfirm = () => {
    socket.current.emit('addGroupMember', {
      groupId,
      targetsUsernames: targetKeys,
      groupName,
      authorBy
    });
    modal.destroy();
    reset();
  };

  const modalOptions = {
    icon: null,
    className: 'customModal',
    content: (
      <Transfer
        className="customTransfer"
        dataSource={data}
        rowKey={(record) => record.username}
        titles={['Source', 'Target']}
        onChange={onChange}
        onSelectChange={onSelectChange}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        listStyle={{
          width: 250,
          height: 300,
          backgroundColor: '#1d1e1f'
        }}
        selectionsIcon={<></>}
        locale={{ itemUnit: '项', itemsUnit: '项' }}
        render={(item: any) => {
          return (
            <div className="menberListItem hover:tw-bg-chatSpaceHeader tw-flex tw-gap-2 tw-items-center tw-px-0.5 tw-py-1.5 tw-rounded">
              <div
                className={`tw-w-6 tw-rounded-full tw-relative 
              after:tw-content-[''] after:tw-w-2 after:tw-h-2 after:tw-bg-onlineGreen ${
                item.isOnline ? '' : 'tw-grayscale'
              } after:tw-absolute after:tw-bottom-0 after:tw-right-0 after:tw-rounded-full
            `}
              >
                <img
                  src={'/public' + item.avatar}
                  alt=""
                  className={`tw-object-contain tw-rounded-full`}
                />
              </div>
              <div className="no-wrap-ellipsis tw-w-3/5" title={item.username}>
                {item.username}
              </div>
            </div>
          );
        }}
      />
    ),
    footer: (
      <div className="tw-flex tw-gap-3 tw-justify-center">
        <button
          onClick={onCancel}
          className="tw-border tw-border-[#4c4d4f] hover:tw-border-[#213d5b] hover:tw-text-[#409eff] tw-text-white tw-w-fit hover:tw-bg-[#18222c] tw-bg-transparent tw-rounded tw-px-4 tw-py-1.5  tw-self-end"
        >
          取消
        </button>
        <button
          onClick={onConfirm}
          disabled={targetKeys.length === 0}
          className="tw-text-white tw-w-fit hover:tw-bg-btnHoverColor tw-bg-btnColor tw-rounded tw-px-4 tw-py-1.5 tw-self-end"
        >
          确认
        </button>
      </div>
    )
  };
  useEffect(() => {
    if (modal) {
      getFriends().then((res) => {
        if (res.code === 200) {
          setData(
            res.data.result.filter((item: any) => {
              return groupMember.find((gmItem: any) => {
                return gmItem.username === item.username;
              })
                ? false
                : true;
            })
          );
        }
      });
    }
  }, [modal, groupMember]);

  useEffect(() => {
    modal && modal.update(modalOptions);
  }, [modal, targetKeys, selectedKeys, data, groupMember]);

  const show = () => {
    const modal = Modal.confirm(modalOptions);
    setModal(modal);
  };
  return { show };
};
export default useRelationCtrl;
