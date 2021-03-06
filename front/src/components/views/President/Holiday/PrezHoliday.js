import React, { useState, useEffect } from "react";
import { Layout, Button, Table} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import LoginedUser from '../../../../utils/LoginedUser';
import LogoutUser from '../../../../utils/LogoutUser';
import SideBar from '../../../../utils/SideBarPresident';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import HolidayUserAdd from '../../Employee/HolidayUser/HolidayUserAdd';
import { HolidayColums } from '../../Employee/HolidayUser/HolidayUserColums';

const data = [
    {
      key: '1',
      name: '이름',
      type: '연차',
      date: 'YYYY/MM/DD',
      day: 'n',
      type: '연차',
      content: 'Null',
      confirm: 'Null',
    },
  ];

const { Header, Content } = Layout;

function PrezHoli(props){

    const [Date, setDate] = useState(''); //날짜 정보
    const [ListData, setListData] = useState([]); //휴일 정보

    useEffect(() => {         
        //휴일 데이터를 가져옴
        axios.get('/api/listdata').then(response => {
        setListData(response.data);
        });
    }, []);
  
    const [Visible, setVisible] = useState(false);
    //팝업 ON
    const showModal = () => {
        setVisible(true);
    };
    //팝업 OFF
    const handleCancel = () => {
        setVisible(false);
    };
    //팝업 OFF 및 데이터 보내기
    const handleOk = () => {
        setVisible(false);
    }

    return(
        <div>
        <Layout style={{ minHeight: '100vh' }}>
          <SideBar DefaultKey={'2'}/>
          <Layout>
            <Header style={{ background: '#fff', padding: 0, textAlign: 'end' }} >
              <LoginedUser />
              <LogoutUser pageChange={props}/>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              {/* 캘린더 */}
              <FullCalendar 
                initialView="dayGridMonth"
                plugins={[ dayGridPlugin, interactionPlugin]}
                height = '90%'
                events={ListData}
              />
              <Button style = {{float: 'right'}} onClick = {showModal}>연가신청</Button>
              <Button href = '/prezholiconfirm' style = {{float: 'right'}}>연가승인</Button>
              <HolidayUserAdd Visible={Visible} handleCancel={handleCancel} handleOk={handleOk} />
              <div>
                <Table columns={HolidayColums} dataSource={data} pagination={false} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
}

export default PrezHoli