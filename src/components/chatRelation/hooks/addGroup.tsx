import { toCreateGroup } from '@/service/addRelationLogic';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Modal, Upload, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

export const useAddGroup = () => {
  const [modal, setModal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const inputRef = useRef<any>(null);
  const cancel = () => {
    modal.destroy();
    setModal(null);
    setImageUrl('');
    setLoading(false);
  };
  const confirm = () => {
    const groupName = inputRef.current!.input.value;
    if (!imageUrl) return message.error('请上传群头像！');
    if (groupName.length > 10) return message.error('群名称不能超过10个字符！');
    else if (!groupName.trim()) return message.error('请正确输入群名称！');
    else {
      setConfirmDisabled(true);
      toCreateGroup(groupName, imageUrl).then((res) => {
        if (res.code === 200) {
          message.success('创建成功！');
          modal.destroy();
          setModal(null);
          setImageUrl('');
          setLoading(false);
          setConfirmDisabled(false);
        }
      });
    }
    return 1;
  };
  const beforeUpload = () => {};
  const handleChange = (e: any) => {
    if (e.file.status === 'done') {
      setLoading(false);
      if (e.file.response.code === 200) {
        setImageUrl(e.file.response.data.src);
      } else {
        message.error(e.file.response.msg);
      }
    } else {
      setLoading(true);
    }
  };
  const uploadButton = (
    <button
      className="tw-rounded-lg tw-border tw-border-dashed tw-border-[#424654] hover:tw-border-[#1677ff] tw-text-[#a8abb2] tw-w-24 tw-h-24 tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-mb-4"
      style={{ background: '#424654' }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传封面</div>
    </button>
  );
  useEffect(() => {
    if (modal) {
      modal.update({
        icon: null,
        className: 'customModal',
        title: '创建群组',
        content: (
          <>
            {' '}
            <Upload
              accept="image/*"
              name="image"
              showUploadList={false}
              action="/api/uploadImage"
              withCredentials={true}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <div className="tw-w-24 tw-h-24">
                  <img
                    src={'/public' + imageUrl}
                    alt="avatar"
                    className="tw-w-full tw-h-full tw-object-cover"
                  />
                </div>
              ) : (
                uploadButton
              )}
            </Upload>
            <Input
              ref={inputRef}
              className="customInput"
              placeholder="请输入群名称"
            />
          </>
        ),
        footer: (
          <div className="tw-flex tw-gap-3 tw-justify-center">
            <button
              onClick={cancel}
              className="tw-border tw-border-[#4c4d4f] hover:tw-border-[#213d5b] hover:tw-text-[#409eff] tw-text-white tw-w-fit hover:tw-bg-[#18222c] tw-bg-transparent tw-rounded tw-px-4 tw-py-1.5  tw-self-end"
            >
              取消
            </button>
            <button
              onClick={confirm}
              disabled={confirmDisabled}
              className="tw-text-white tw-w-fit hover:tw-bg-btnHoverColor tw-bg-btnColor tw-rounded tw-px-4 tw-py-1.5 tw-self-end"
            >
              确认
            </button>
          </div>
        )
      });
    }
  }, [loading, imageUrl, modal, confirmDisabled]);
  const createGroup = () => {
    const modal = Modal.confirm({
      icon: null,
      className: 'customModal',
      title: '创建群组',
      content: (
        <>
          {' '}
          <Upload
            accept="image/*"
            name="image"
            showUploadList={false}
            action="/api/uploadImage"
            withCredentials={true}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <div className="tw-w-24 tw-h-24">
                <img
                  src={'/public' + imageUrl}
                  alt="avatar"
                  className="tw-w-full tw-h-full tw-object-cover"
                />
              </div>
            ) : (
              uploadButton
            )}
          </Upload>
          <Input
            ref={inputRef}
            className="customInput"
            placeholder="请输入群名称"
          />
        </>
      ),
      footer: (
        <div className="tw-flex tw-gap-3 tw-justify-center">
          <button
            onClick={cancel}
            className="tw-border tw-border-[#4c4d4f] hover:tw-border-[#213d5b] hover:tw-text-[#409eff] tw-text-white tw-w-fit hover:tw-bg-[#18222c] tw-bg-transparent tw-rounded tw-px-4 tw-py-1.5  tw-self-end"
          >
            取消
          </button>
          <button
            onClick={confirm}
            disabled={confirmDisabled}
            className="tw-text-white tw-w-fit hover:tw-bg-btnHoverColor tw-bg-btnColor tw-rounded tw-px-4 tw-py-1.5 tw-self-end"
          >
            确认
          </button>
        </div>
      )
    });
    setModal(modal);
  };
  return {
    createGroup
  };
};
