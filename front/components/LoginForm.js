import React, {useCallback} from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';

import useInput from '../hooks/useInput';
import {useDispatch} from "react-redux";
import {logInAction} from "../reducers";

const LoginForm = function () {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch()
  const onSubmitForm = useCallback(() => {
    dispatch(logInAction({email,password}))
  },[email,password])
  return (
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
        <Button type="primary" htmlType="submit">로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
    </Form>
  );
};

export default LoginForm;
