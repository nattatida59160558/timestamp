import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

// ต้อง import component ประกาศเพื่อที่จะทำให้ react-router-dom เรียกใช้
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

class App extends Component {
  render() {
    // ใน return จะจัดการการเปลี่ยน component ในการแสดงผลบนหน้าเว็บ 
    // ด้านล่างเป็นวิธีเบี้องต้น น้องๆ อาจจะมีได้หลาย Route ขึ้นอยู่กับออกแบบ application
    // <Route> เป็น component ที่ทำหน้าที่ในการ render ui ตาม match ของ path
    // <Switch> จะช่วยจัดการในการ render component เดียวในกรณีมีการที่ส่วนที่ต่อหลังจาก / 
    // ที่เป็น :id และ /register จะทำงานพร้อมกันถ้าเข้าเงื่อนไขที่นี้ 
    // <Switch> จะสั่งใน render แค่ component เดียวที่เข้าเงื่อนไขและอยู่ข้างบนสุด
    return (
      <Switch>
          {/* opation: exact จะเป็นบังคับให้ route กำหนดชื่อ url ให้ตรงเท่านั้นถึงจะทำงาน */}
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/home/:id" component={Home} />
      </Switch>
    );
  }
}

export default App;
