import { Avatar, Card, Button } from 'antd';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from 'next/link';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = function () {
  const dispatch = useDispatch();

  const { user, logOutLoading } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction);
  }, []);

  return (
  // eslint-disable-next-line react/jsx-filename-extension
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${user.id}`}>
            <a>
              짹짹
              <br />
              {user.Posts.length}
            </a>
          </Link>
        </div>,
        <div key="following">
          <Link href="/profile">
            <a>
              팔로잉
              <br />
              {user.Followings.length}
            </a>
          </Link>
        </div>,
        <div key="follower">
          <Link href="/profile">
            <a>
              팔로워
              <br />
              {user.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={(
          <Link href={`/user/${user.id}`}>
            <a><Avatar>{user.nickname[0]}</Avatar></a>
          </Link>
          )}
        title={user.nickname}
      />
      <Button onClick={onLogout} loading={logOutLoading}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
