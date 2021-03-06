import React, { useCallback, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import useInput from '../hooks/useInput';
import { LOG_IN_REQUEST } from '../reducers/user';

const LoginForm = function () {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();

  const { logInLoading, logInError } = useSelector((state) => state.user);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  return (
  // eslint-disable-next-line react/jsx-filename-extension
    <Form onFinish={onSubmitForm} style={{ padding: '10px' }}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
    </Form>
  );
};

export default LoginForm;
