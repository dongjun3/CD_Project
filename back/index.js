const express = require('express'); //express 모듈을 가져옴
const db   = require('./config/db'); //자신의 데이터베이스 정보(유저명과 패스워드 등)를 입력
const app = express(); //funtion을 이용하여 새로운 express app을 만듬
const port = 5000 //port number
const bodyParser = require('body-parser');
//router
const LoginRouter = require('./lib/LoginSystem'); //로그인, 로그아웃
const CrudRouter = require('./lib/SystemServer/UserCrud'); //직원 추가,삭제,수정,GET
//웹에서 application/x-www-form-urlencoded에 있는 데이터를 분석해서 가져옴
  app.use(bodyParser.urlencoded({extended : true}));
//웹에서 application/json에 있는 데이터를 분석해서 가져옴
  app.use(bodyParser.json());
//session 사용 모듈
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const sessionDB = require('./config/sessionDB');
//session 사용
app.use(session({
    secret: 'asdqwe##',
    resave: false,
    saveUninitialized: true,
    store:new mysqlStore(sessionDB)
  }));

//nodejs 연습 및 axios 연습 (삭제예정)======================================================
//get 가져오는 것. '/'는 주소를 뜻한다. 현재 '/'에 아무것도 안붙으므로 root directory를 뜻한다.
//req => request(요청), res=> response(응답)
app.get('/', (req, res) => { //삭제 예정
  res.send('Root => Hello World!/안녕하세요!!!')
})
//위와 마찬가지. 다만, /users에 연결되어 있다 --삭제 예정
app.get('/users', (req, res) => {
  db.query('SELECT * from Users', (error, rows) => {
    if (error) throw error;
    console.log('mysql Connected...');
    console.log('User info is: ', rows);
    res.send(rows);
  });
});
//axios 연습(해당 주소로 가면 볼 수 있음) --삭제 예정
app.get('/api/hello',(req,res)=>{
  res.send('안녕하세요~');
});
//=========================================================================================
//페이지의 복잡성을 해소하기 위한 라우터
app.use('/api/users', LoginRouter);
app.use('/api/users', CrudRouter);
//SystemServer로 옮길 예정================================================================================================
//대코드 테이블 삭제(주소는 다 소문자로 변경해주면 좋을 거 같음)
app.post('/api/MasterCodedelete',(req,res)=>{
  req.body.forEach(user => {
    //console.log(user.id);
    db.query(`DELETE FROM mastercode WHERE LargeCode = ?`,[user.LargeCode],function(error,result){
      if(error){
        throw error;
      }
    });
  });
  return res.json({
    success : true
  });
});
//소코드 테이블 삭제
app.post('/api/SmallCodedelete',(req,res)=>{
  req.body.forEach(user => {
    db.query(`DELETE FROM smallcode WHERE SmallCode = ?`,[user.SmallCode],function(error,result){
      if(error){
        throw error;
      }
    });
  });
  return res.json({
    success : true
  });
});
//대코드 리스트 검색
app.post('/api/mastercodelist', (req,res) => {
  console.log(req.body.LargeCode);
  db.query('SELECT * from MasterCode where LargeCode like ?',[`%${req.body.LargeCode}%`],(error,data)=>{
    if(error) res.send(['']);
    db.query('SELECT * from SmallCode where SmallCode like ?',[`%${data[0].LargeCode}%`],(error2,codes)=>{
      if(error2) res.send(['']);
      res.send(codes);
    });
  });
});


//대코드 수정
app.post('/api/mastercodeupdate',(req,res)=>{
  console.log(req.body);
  db.query(`UPDATE mastercode SET LargeCode = ? , LargeInfo = ?) VALUES(?,?)`,
  [req.body.LargeCode, req.body.LargeInfo],(error,result) => {
        if(error) {
          return  res.json({
            holidaySaveSuccess: false,
              message: "실패"
              });  
      }
      return res.json({
        holidaySaveSuccess: true,
          message: "성공"
          });  
    });
});
//공통코드 관련
app.get('/api/SmallCode', (req, res) => {
  db.query('SELECT * from SmallCode', (error, rows) => {
    if (error) throw error;
    let temp = [];
    let data = {};
    let i = 0;
   rows.forEach(row => {
   data = {
          key: String(i+1),
          SmallCode: row.SmallCode,
          SmallInfo: row.SmallInfo,
          SmallContent: row.SmallContent,
  }
      i++;
      temp.push(data);
    });
    res.send(temp);

});
  });
//대코드 테이블
app.get('/api/MasterCode', (req, res) => {
  db.query('SELECT * from MasterCode', (error, rows) => {
    if (error) throw error;
    let temp = [];
    let data = {};
    let i = 0;
   rows.forEach(row => {
   data = {
          key: String(i+1),
          LargeCode: row.LargeCode,
          LargeInfo: row.LargeInfo,
  }
      i++;
      temp.push(data);
    });
    res.send(temp);

});
  });


//휴일설정 db에 저장
app.post('/api/holidaysave', (req, res) => {
  db.query(`INSERT INTO holiday(Date,HoliManage,HoliContent) VALUES(?,?,?)`,
  [req.body.Date, req.body.SaveCode, req.body.HoliContent],(error,result) => {
    if(error) {
      return  res.json({
        holidaySaveSuccess: false,
          message: "실패"
          });  
  }
  return res.json({
    holidaySaveSuccess: true,
      message: "성공"
      });  
});
});
//공통코드 db에 저장
app.post('/api/smallcodesave', (req, res) => {
  const code = req.body.LargeCode + req.body.SmallCode;
  db.query(`INSERT INTO smallcode(SmallCode,SmallInfo,SmallContent) VALUES(?,?,?)`,
  [code, req.body.SmallInfo,req.body.SmallContent],(error,result) => {
    if(error) {
      return  res.json({
        smallcodeSaveSuccess: false,
          message: "실패"
          });  
  }
  return res.json({
    smallcodeSaveSuccess: true,
      message: "성공" 
      });  
});
});

//대코드 db에 저장
app.post('/api/mastercodesave', (req, res) => {
  db.query(`INSERT INTO mastercode(LargeCode,LargeInfo) VALUES(?,?)`,
  [req.body.LargeCode, req.body.LargeInfo],(error,result) => {
    if(error) {
      return  res.json({
        largecodeSaveSuccess: false,
          message: "실패"
          });  
  }
  return res.json({
    largecodeSaveSuccess: true,
      message: "성공" 
      });  
});
});

// //공통코드 테이블 대코드 까지 뜨게하는건데 보류
// app.get('/api/codetable', (req, res) => {
//   //db.query('SELECT LargeCode,smallcode,SmallInfo,SmallContent FROM mastercode RIGHT JOIN smallcode ON LEFT(SmallCode, 2) = LargeCode;', (error, rows) => {
//   db.query('SELECT * from SmallCode', (error, rows) => {
//     if (error) throw error;
//     console.log('holiday date\n', rows);
//     res.send(rows);
//   });
// });

app.get('/api/holidaydata', (req, res) => {
  db.query('SELECT holi.DATE,small.SmallInfo FROM holiday AS holi JOIN SmallCode AS small ON small.SmallCode = holi.holimanage;', (error, lists) => {
    if (error) throw error;
    //console.log('holiday date\n', lists);
    let temp = [];
    let data = {};
    lists.forEach(list => {
      data = {
        title : list.SmallInfo,
        date : list.DATE
      }
      temp.push(data);
    });
    res.send(temp);
  });
});
//부서코드리스트
  app.get('/api/deptlist', (req,res) => {
    db.query('SELECT * from MasterCode where LargeInfo like ?',['%부서%'],(error,data)=>{
      if(error) res.send(['']);
      //console.log(data[0].LargeCode);
      db.query('SELECT * from SmallCode where SmallCode like ?',[`%${data[0].LargeCode}%`],(error2,depts)=>{
        if(error2) res.send(['']);
        //console.log(depts);
        res.send(depts);
      });
    });
  });
//직급코드리스트
app.get('/api/ranklist', (req,res) => {
  db.query('SELECT * from MasterCode where LargeInfo like ?',['%직급%'],(error,data)=>{
    if(error) res.send(['']);
    //console.log(data[0].LargeCode);
    db.query('SELECT * from SmallCode where SmallCode like ?',[`%${data[0].LargeCode}%`],(error2,ranks)=>{
      if(error2) res.send(['']);
      //console.log(ranks);
      res.send(ranks);
    });
  });
});


//==============================================================================================================================

//UserServer로 옮길 예정=========================================================================================================
//출근 버튼(메인페이지 출근 버튼 누르고 또 누르면 출근을 이미 하였다고 뜨기)
app.post('/api/onWork',(req, res) => {
      db.query('SELECT * from employeeWork where id=? AND Date=?',[req.session.userId,req.body.date],(error, userDate) => {
        if(userDate[0] === undefined){ //다른 날짜 유무
          db.query(`INSERT INTO employeeWork(DATE,OnWork,id) VALUES(?,?,?)`,
          [req.body.date, req.body.time, req.session.userId],(error,result) => {
            if(error) throw error;
            return res.json({
              success : true,
              message:'ok'
            });
          });
        } else {
            return res.json({
              success : false,
              message:'no'
            });
        }
      });
    });
//퇴근 버튼
app.post('/api/offWork',(req, res) => {
  //console.log(req.body);
  db.query('SELECT * from employeeWork where id=? AND Date=?',[req.session.userId,req.body.date],(error, userDate) => {
    //console.log(userDate);
    if(userDate[0] != undefined){
      db.query(`update employeeWork SET OffWork =?,WorkContent=?,OverWorkContent=? where id=? AND Date=?`,
      [req.body.time,req.body.WorkContent,req.body.OverWorkContent,req.session.userId,req.body.date],(error,result) => {
        if(error) throw error;
        return res.json({
          success : true,
          message:'ok'
        });
      });
    } else {
        return res.json({
          success : false,
          message:'no'
        });
    }
  });
});
//로그인한 유저 정보
app.get('/api/userInfo',(req, res) => {
  //console.log(req.session.userId);
  db.query('SELECT * from employee where id = ?',[req.session.userId],(error, rows) => {
    if (error) throw error;
    return res.json({
      userID : rows[0].id,
      userName : rows[0].name
    });
  });
});
//근무조회
app.get('/api/worklist', (req, res) => {
  db.query('SELECT * from employeeWork where id=?',[req.session.userId], (error, works) => {
    if (error) throw error;
    let temp = [];
    let data = {};
    let i = 0;
    let workTime = null;
    let workTimeSum = 0;
    works.forEach(work => {
      //console.log('OnWork: ',work.OnWork);
      //console.log('OnWorkSplit: ',Number(work.OnWork.split(':')[0]));
      //console.log('OffWork: ',work.OffWork);
      //console.log('OffWorkSplit: ',Number(work.OffWork.split(':')[0]));
      //console.log('workTime:',Number(work.OffWork.split(':')[0]) - Number(work.OnWork.split(':')[0]));
      if(work.OffWork != null){
        workTime = Number(work.OffWork.split(':')[0]) - Number(work.OnWork.split(':')[0]);
        workTimeSum += workTime;
      }
      data = {
        key : String(i+1),
        date : work.Date,
        onWork: work.OnWork,
        offWork: work.OffWork,
        workTime: workTime,
        workContent: work.WorkContent,
        overWorkContent: work.OverWorkContent
      }
      temp.push(data);
      i++;
    });
    //res.send(temp);
    return res.json({
      workList : temp,
      workTimeSum
    });
  });
});

//mypage조회
app.get('/api/mypage', (req, res) => {
  db.query('SELECT * from employee where id =?',[req.session.userId], (error, user) => {
    if (error) throw error;
    //console.log('User info is \n', user);
    res.send(user);
  });
});
//mypage확인
app.post('/api/mypagecheck', (req, res) => {
  //console.log('1:',req.body.Password);
  //console.log('2:',req.session.userId);
  db.query('SELECT * from employee where id =?',[req.session.userId], (error, user) => {
    if (error) throw error;
    //console.log('User info is \n', user[0].password);
    if(user[0].password === req.body.Password){
      return res.json({
        success : true
      });
    }else{
      return res.json({
        success : false
      });
    }
  });
});

//연가 데이터 넣기 *테이블 이름과 주소 바꿀 예정
app.post('/api/leaveinsert',(req,res) => {
  console.log(req.body);
  db.query('INSERT INTO LeaveUser (id,StartDate,EndDate,SelectedLeave,Des) VALUES(?,?,?,?,?)',
  [req.session.userId,req.body.StartDate,req.body.EndDate,req.body.SelectedLeave,req.body.Des], (error, user) => {
    if (error) throw error;
    return res.json({
      success : true
    });
  });
});
//연가 데이터 조회
app.get('/api/leavelist', (req, res) => {
  db.query('SELECT * from LeaveUser where id=?',[req.session.userId], (error, lists) => {
    if (error) throw error;
    let temp = [];
    let data = {};
    lists.forEach(list => {
      console.log(list);
      data = {
        startDate: list.StartDate,
        endDate: list.EndDate,
        type: list.SelectedLeave,
        content: list.Des
      }
      temp.push(data);
    });
    res.send(temp);
  });
});
//업무 지시 데이터 저장
app.post('/api/workmanagesave',(req,res)=>{
  //console.log(req.body.checkUsers);
  //console.log(req.session.userId);
  //console.log(req.session.userName);
  const saveData = req.body;
  saveData.checkUsers.forEach(checkUser => {
    //console.log(checkUser.id);
    //console.log(saveData);
    db.query('INSERT INTO WorkManage (sendId,getId,startDate,endDate,title,workDes) VALUES(?,?,?,?,?,?)',
      [req.session.userId,checkUser.id,saveData.StartDate,saveData.EndDate,saveData.Title,saveData.Des], (error, result) => {
      if (error) throw error;
    });
  },res.send('success'));
});
//업무조회 데이터 가져오기
app.get('/api/workmanageread',(req,res)=>{
  //console.log(req.session.userId);
  let sendData = [];
  let data = {};
  let i = 0;
  db.query('SELECT * from WorkManage Join employee ON employee.id = WorkManage.sendId where WorkManage.getId = ?',[req.session.userId],(error,reads)=>{
    if (error) throw error;
    //console.log(reads);
    reads.forEach(read => {
      //console.log(i,' : ',read);
      data = {
       key: String(i+1),
       Date: read.startDate,
       EndDate: read.endDate,
       Dept: read.dept,
       Rank : read.rank,
       User: read.name,
       Title: read.title,
       Dsc: read.workDes
      }
      sendData.push(data);
      i++;
    });
    res.send(sendData);
  });
});


//비밀번호 예시============================================================================================
// const crypto = require('crypto');
// const password = '123q';
// const pass = crypto.createHash('sha512').update(password).digest('base64');
// const pass2 = crypto.createHash('sha512').update(password).digest('base64');

// if(pass === pass2){
//   console.log('같다');
// }else{
//   console.log('다르다');
// }
//========================================================================================================
//port number를 콘솔에 출력
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})