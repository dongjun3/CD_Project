import React, { useState, useEffect } from "react";
import { Button, Table, Select, Layout} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

const { Option } = Select;
const { Content } = Layout;

function MainTable() {
  const columns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '요일',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: '출근시간',
      dataIndex: 'onWork',
      key: 'onWork',
    },
    {
      title: '퇴근시간',
      dataIndex: 'offWork',
      key: 'offWork',
    },
    {
      title: '근무시간',
      dataIndex: 'workTime',
      key: 'workTime',
    },
    {
      title: '근무내용',
      dataIndex: 'workContent',
      key: 'workContent',
    },
    {
      title: '초과근무시간',
      dataIndex: 'overWorkTime',
      key: 'overWorkTime',
    },
    {
      title: '초과근무내용',
      dataIndex: 'overWorkContent',
      key: 'overWorkContent',
    },
];
    const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/worklist').then(response => {
      var temp = {};
      console.log(response.data);
      for(var i=0; i< response.data.length; i++) {
        temp = {
          key: String(i+1),
          date: response.data[i].Date,
          onWork: response.data[i].Time
        };
        setData(data => [...data, temp]); //이전 값과 새로운 값을 더하여 새로운 값으로 반환
      }
    });
  }, []);

    function printDiv (){
      var initBody = document.body.innerHTML;
    
      window.onbeforeprint = function(){
        //document.title = LoginedUser;
        document.body.innerHTML = document.getElementById('printArea').innerHTML;
      }
      window.onafterprint = function(){
        document.body.innerHTML = initBody;
        window.location.reload();
      }
      window.print();
    };
        return(
        <>
          <Content style={{ margin: '0' }}>
            <div style = {{margin: '0 auto', width: '1000px'}}>
              <div style = {{marginBottom: '20px'}}>{/* 년 월 인쇄 통합 div */}
                <div style = {{display: 'inline-block', marginLeft: '44%'}}>
                  <Select name = 'year' defaultValue="년도" style={{ width: 80 }}>
                    <Option value="2020">2020</Option>
                    <Option value="2019">2019</Option>
                    <Option value="2018">2018</Option>
                    <Option value="2017">2017</Option>
                    <Option value="2016">2016</Option>
                  </Select>
                  <Select name = 'month' defaultValue="월" style={{ width: 60 }}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="7">7</Option>
                    <Option value="8">8</Option>
                    <Option value="9">9</Option>
                    <Option value="10">10</Option>
                    <Option value="11">11</Option>
                    <Option value="12">12</Option>
                  </Select>
                </div>
                <div style = {{display: 'inline-block', float: 'right'}}>
                  <Button onClick = {printDiv}>인쇄</Button>
                </div>
              </div>
              <div id = "printArea">
                <div style = {{width:'1000px', margin: '0 auto'}}>
                  <div style = {{display: 'inline-block', marginLeft: '40%', textAlign: 'center'}}>
                      <h2>{}년 {}월 근무현황</h2>
                  </div>
                </div>

                <Table columns={columns} dataSource={data} pagination={false} />
    
                <div style = {{backgroundColor: 'blue', textAlign: 'center'}}>
                  <div style = {{display: 'inline-block', width: '40%', backgroundColor: 'orange'}}>
                    근무시간합계
                  </div>
                  <div style = {{display: 'inline-block', width: '10%', backgroundColor: 'yellow'}}>
                    근무합
                  </div>
                  <div style = {{display: 'inline-block', width: '40%', backgroundColor: 'orange'}}>
                    초과근무시간합계
                  </div>
                  <div style = {{display: 'inline-block', width: '10%', backgroundColor: 'yellow'}}>
                    초과합
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </>
        );
}

export default MainTable