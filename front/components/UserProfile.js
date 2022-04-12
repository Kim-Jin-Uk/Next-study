import {Avatar, Button, Card} from 'antd';
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Link from 'next/link';
import {logOutAction} from "../reducers";
// import { logoutRequestAction } from '../reducers/user';

const UserProfile = function () {
  const dispatch = useDispatch();
  //
  const { userData } = useSelector((state) => state.user);
  //
  const onLogout = useCallback(() => {
    dispatch(logOutAction());
  }, []);
    useEffect(() => {
        console.log("userData",userData)
    },[userData])

  return (
  // eslint-disable-next-line react/jsx-filename-extension
    <Card
      actions={[
        <div key="twit">
          {/*<Link href={`/user/${user.id}`}>*/}
          {/*  <a>*/}
          {/*    짹짹*/}
          {/*    <br />*/}
          {/*    {user.Posts.length}*/}
          {/*  </a>*/}
          {/*</Link>*/}
        </div>,
        <div key="following">
          <Link href="/profile">
            <a>
              팔로잉
              <br />
              {/*{user.Followings.length}*/}
            </a>
          </Link>
        </div>,
        <div key="follower">
          <Link href="/profile">
            <a>
              팔로워
              <br />
              {/*{user.Followers.length}*/}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={(
          <Link href={`/user`}>
            <a><Avatar>{userData.email.toUpperCase()[0]}</Avatar></a>
          </Link>
          )}
        title={userData.email}
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
