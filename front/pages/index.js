import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { END } from 'redux-saga';
import axios from 'axios';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = function () {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading, mainPosts]);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppLayout>
      {user && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

//SSR
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  //SSR시 쿠키 전달하기
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie; // 쿠키쓸때만 설정
  }
  //비동기 요청 SSR 결과를 HYDRATE에 보내줌 -> rootReducer 분리 -> Request 정보만 들어있음(Response 정보 X)
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  //Response 정보 가져오기
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
