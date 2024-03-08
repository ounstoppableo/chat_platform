const useGroupManageLogic = (props: any) => {
  const {
    socket,
    userInfo,
    switchGroup,
    currentGroup,
    setOpenEditGroupName,
    newGroupName,
    message,
    setNewGroupName
  } = props;
  //群名预处理（p2p专用）
  const groupNamePreOpera = (groupName: string) => {
    const temp = groupName.split('&&&');
    return userInfo.username === temp[0] ? temp[1] : temp[0];
  };

  //删除群聊
  const deleteGroup = () => {
    socket.current.emit('delGroup', currentGroup);
    switchGroup({});
  };
  //退出群聊
  const exitGroup = () => {
    socket.current.emit('exitGroup', currentGroup);
    switchGroup({});
  };
  //修改群名
  const editGroupName = () => {
    setOpenEditGroupName(true);
  };
  const checkEditGroupName = () => {
    if (newGroupName.length === 0) return message.error('请正确输入群名！');
    socket.current.emit('editGroupName', {
      group: currentGroup,
      newName: newGroupName
    });
    setOpenEditGroupName(false);
    setNewGroupName('');
    return 1;
  };
  const cancelEditGroupName = () => {
    setOpenEditGroupName(false);
    setNewGroupName('');
  };
  const changeNewGroupName = (e: any) => {
    setNewGroupName(e.currentTarget.value.slice(0, 20));
  };
  return {
    groupNamePreOpera,
    deleteGroup,
    editGroupName,
    exitGroup,
    checkEditGroupName,
    cancelEditGroupName,
    changeNewGroupName
  };
};
export default useGroupManageLogic;
