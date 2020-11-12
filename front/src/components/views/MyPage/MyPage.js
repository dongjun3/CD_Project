import React, { useState } from "react";
import 'antd/dist/antd.css';
import { DatePicker, message, Alert, Layout, Menu, Breadcrumb, Button, Row, Col, Switch, Table, Select, Descriptions, Input} from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LiveClock from '../MainPage/LiveClock';


// 불러오는 곳
const { Header, Content, Sider, Footer } = Layout;

function MyPage() {

    return(
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider style={{background:'dark'}}>
          <div>
              <LiveClock></LiveClock>
          </div>
          {/* grid */}
          <Row>
              <Col span={12}><Button block>출근</Button></Col>
              <Col span={12}><Button block>퇴근</Button></Col>
          </Row>
          <Menu theme="dark" defaultSelectedKeys={['5']} mode="inline">
            <Menu.Item key="1">
              <span>홈 바로가기</span>
              <Link to="/main" />
            </Menu.Item>
            <Menu.Item key="2">
              <span>연가</span>
              <Link to="/outWork" />
            </Menu.Item>
            <Menu.Item key="3">
              <span>근무조회</span>
              <Link to="/middle" />
            </Menu.Item>
            <Menu.Item key="4">
              <span>업무지시 및 조회</span>
            </Menu.Item>
            <Menu.Item key="5">
              <span>마이 페이지</span>
              <Link to="/mypage" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
              
          <Content style={{ margin: '0' }}>
            {/* 마이페이지 전체 div */}
            <div style = {{width: '700px', margin: '0px auto', backgroundColor: 'orange'}}>
                <div>
                    <h2 style = {{textAlign: "center"}}>개인정보</h2>
                </div>
                <div  style = {{display: "flex"}}>
                    <div style = {{margin: '0px auto'}}>
                        <Descriptions bordered style = {{width: 700}}>
                            <Descriptions.Item label="부서" span={3} style = {{textAlign: "center"}}>경리부</Descriptions.Item>
                            <Descriptions.Item label="직급" span={3} style = {{textAlign: "center"}}>인턴</Descriptions.Item>
                            <Descriptions.Item label="사원번호" span={3} style = {{textAlign: "center"}}>12</Descriptions.Item>
                            <Descriptions.Item label="사원이름" span={3} style = {{textAlign: "center"}}>홍길이</Descriptions.Item>
                            <Descriptions.Item label="새로운 비밀번호" span={3} style = {{textAlign: "center"}}><Input.Password placeholder="새로운 비밀번호 입력"/></Descriptions.Item>
                            <Descriptions.Item label="새로운 비밀번호 확인" span={3} style = {{textAlign: "center"}}><Input.Password placeholder="새로운 비밀번호 확인"/></Descriptions.Item>
                            <Descriptions.Item label="이메일" span={3} style = {{textAlign: "center"}}>hallym@naver.com</Descriptions.Item>
                            <Descriptions.Item label="휴대폰 번호" span={3} style = {{textAlign: "center"}}>010-0101-0101</Descriptions.Item>
                            <Descriptions.Item label="우편번호" span={3} style = {{textAlign: "center"}}>12345</Descriptions.Item>
                            <Descriptions.Item label="주소" span={3} style = {{textAlign: "center"}}>춘천시</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
                <div>
                    <Button style = {{float: 'right'}}>취소</Button>
                    <Button style = {{float: 'right'}}>확인</Button>
                </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
    );
};

export default MyPage