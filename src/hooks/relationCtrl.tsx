import { Modal, Transfer } from 'antd';
import { useState } from 'react';

const useRelationCtrl = () => {
  const data: any[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`
  }));
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const show = () => {
    Modal.confirm({
      icon: null,
      className: 'customModal',
      content: (
        <Transfer
          className="customTransfer"
          dataSource={data}
          titles={['Source', 'Target']}
          onChange={onChange}
          onSelectChange={onSelectChange}
          listStyle={{
            width: 250,
            height: 300,
            backgroundColor: '#1d1e1f'
          }}
          selectionsIcon={<></>}
          locale={{ itemUnit: '项', itemsUnit: '项' }}
          render={(item) => item.title}
        />
      ),
      footer: (
        <div className="tw-flex tw-gap-3 tw-justify-center">
          <button className="tw-border tw-border-[#4c4d4f] hover:tw-border-[#213d5b] hover:tw-text-[#409eff] tw-text-white tw-w-fit hover:tw-bg-[#18222c] tw-bg-transparent tw-rounded tw-px-4 tw-py-1.5  tw-self-end">
            取消
          </button>
          <button className="tw-text-white tw-w-fit hover:tw-bg-btnHoverColor tw-bg-btnColor tw-rounded tw-px-4 tw-py-1.5 tw-self-end">
            确认
          </button>
        </div>
      )
    });
  };
  return { show };
};
export default useRelationCtrl;
