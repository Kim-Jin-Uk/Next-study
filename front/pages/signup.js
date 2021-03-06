import React, { useState, useCallback, useEffect } from 'react';
import {
  Form, Input, Checkbox, Button,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';

import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import wrapper from '../store/configureStore';

const Signup = function () {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [email, onChangeEmail] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (user && user.id) {
      Router.replace('/');
    }
  }, [user && user.id]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  // eslint-disable-next-line consistent-return
  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nick },
    });
  }, [password, passwordCheck, term]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppLayout>
      <Head>
        <title>???????????? | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-email">?????????</label>
          <br />
          <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
        </div>
        <div>
          <label htmlFor="user-nick">?????????</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">????????????</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">??????????????????</label>
          <br />
          <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
          {passwordError && <div style={{ color: 'red' }}>??????????????? ???????????? ????????????.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>?????? ?????? ??? ?????? ?????? ???????????????.</Checkbox>
          {termError && <div style={{ color: 'red' }}>????????? ??????????????? ?????????.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>????????????</Button>
        </div>
      </Form>
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

export default Signup;
