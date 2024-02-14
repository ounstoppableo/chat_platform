import { getFriends } from '@/service/addRelationLogic';
import { useEffect, useState } from 'react';

export const useGetFriend = (props: any) => {
  const { msgOrRelation } = props;
  //展开联系人
  const [showRelation, setShowRelation] = useState(false);
  const [friends, setFriends] = useState([]);
  const toShowRelation = () => {
    setShowRelation(!showRelation);
  };

  useEffect(() => {
    if (msgOrRelation === 'relation') {
      getFriends().then((res) => {
        if (res.code === 200) {
          setFriends(res.data.result);
        }
      });
    }
  }, [msgOrRelation]);
  return {
    showRelation,
    friends,
    toShowRelation,
    setFriends
  };
};
