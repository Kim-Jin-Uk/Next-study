import React from "react";
import PropTypes from 'prop-types'
import Link from 'next/link'
import {
    Col, Input, Menu, Row,
} from 'antd';
import { createGlobalStyle } from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import useInput from '../hooks/useInput';
import {useSelector} from "react-redux";

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  
  .ant-col:first-child {
      padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({children}) => {
    const user = useSelector((state) => state.user);
    console.log("user",user)
    const [searchInput, onChangeSearchInput] = useInput('');

    return(
        <>
            <Global />
            <Menu mode="horizontal">
                <Menu.Item key="mail">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzTxUeXy5f5jK8jwwSIO13WQV09KBUfywkjQ&usqp=CAU" alt="dogs" width={50}/>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {user.isLogin
                        ? <UserProfile />
                        : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="https://abiding-methane-eba.notion.site/1fb75c620b1e41e8b736a17ea24ad4b2" target="_blank" rel="noreferrer noopener">Made by Jindol</a>
                </Col>
            </Row>
        </>
    )
}

//없어도 상관없으나 혹시모를 오류 방지
AppLayout.propTypes = {
    //return 안에 들어갈 수 있는 모든것들이 node 여기에서 node는 백이 아닌 react에서의 노드
    children: PropTypes.node.isRequired,
}

export default AppLayout
