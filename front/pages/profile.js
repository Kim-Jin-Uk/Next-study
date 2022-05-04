import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import Router from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import { END } from 'redux-saga';
import NicknameEditForm from '../components/NicknameEditForm';
import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

//swr사용하기 위한 변수
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = function () {
  const { user } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  //swr로 데이터 받아오기
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);

  useEffect(() => {
    if (!(user && user.id)) {
      Router.replace('/');
    }
  }, [user && user.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);
  if (!user) { return <div>내 정보 로딩중</div>; }

  if (followingError || followerError) {
    console.error(followingError || followerError);
    return <div>팔로잉/팔로워 로드중 에러발생</div>;
  }

  return (
    <AppLayout>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <NicknameEditForm />
      <FollowList
        header="팔로잉 목록"
        data={followingsData}
        onClickMore={loadMoreFollowings}
        loading={!followingsData && followingError}
      />
      <FollowList
        header="팔로워 목록"
        data={followersData}
        onClickMore={loadMoreFollowers}
        loading={!followersData && followerError}
      />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;
