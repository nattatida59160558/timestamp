import React, { Component } from "react";
// จะใช้อย่าลืม import
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
class Login extends Component {
    constructor(props) {
        // * ต้องสร้าง constructor ด้วยเพราะเราจะใช้ props จากโหนดที่ render compponent นี้
        // ซึ่งเราจะใช้ history ที่เก็บไว้ใน <BrowserRouter> ในการทำ redirect หน้า
        super(props)
        // react เรากำหนดข้อมูลที่เรียกว่า state ที่จะใช้ในแต่ละ component ในลักษณะ 
        this.state = {
            email: "",
            password: "",
        }

        // ด้านล่างเป็นโค้ตที่ทำให้ function ที่ผูกกับ event ที่เกิดขึ้นสามารถใช้ state หรือ function ที่เขียนไว้ใน class นี้ได้
        // เหตุผลคือ เวลาที่เกิด event เช่นการกดคลิก ตัวภาษา javascript จะสร้าง Obj ที่ไม่ได้ใน scope ออกมาจาก class ซึ่งทำให้ไม่สามารถ state หรือ function 
        // ที่เขียนไว้ได้จึงต้องทำการ bind this เข้าไปด้วย
        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.onClick = this.onClick.bind(this)
    }
    // function ที่มีการใช้กับ tag ที่มี event เกิดขึ้นจะต้องใส่ parameter หนึ่งตัว (ในนี้ชื่อว่า event) ในการรับ event ที่เกิดขึ้น
    handleChangeEmail(event) {
        // เอา value ที่เกิดขึ้นจาก event และทำการเพิ่มข้อมูลใน state ซี่ง react ไม่สามารถ set ตรงๆ แบบนี้ this.state.email = "abc@gmail.com" ได้
        // react บอกต้องใช้ฟังก์ชั่น setState เท่านั้น
        this.setState({email: event.target.value})
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value})
    }

    onClick() {
        // เป็นการดึงค่าที่เอามาเก็บไว้ในตัวแปรตัวหนึ่งเราสามารถทำอะไรได้ที่จะไม่ยุ่งกับข้อมูลใน state ณ ขณะนั้น
        var data = {
            email : this.state.email,
            password: this.state.password,
        }
        // ก่อนจะถึงการทำ api ด้วย axois เราจะเช็คก่อนว่าเราใส่ email ถูกต้องการ format หรือไหมหรือใส่ไม่ใส่ email หรือ password มา
        // ****  ณ จุดๆ เขียนฟังก์ชั่นตรวจสอบ ****

        // หลังจากที่ผ่านแล้วเราจะยิง api ด้วย axios โดยใช้ rest method แบบ POST เพราะเราจะส่งข้อมูล email และ password ใน data
        // ไปตรวจสอบบน server 
        axios.post("http://localhost:3001/login", data).then((res) => {
            if (res.data.status) { // เป็น True
                // มาถึงเราผ่านการ login แล้วเราจะเปลี่ยนหน้าโดยใช้ react-router-dom ซึ่งมันถูกสืบทอดผ่าน props ให้เราสามารถ redirect ไปหน้าอื่น
                // โดยที่เราส่ง id ของ user ที่ได้มาจาก res ไปใช้ในหน้า home
                this.props.history.push(`/home/${res.data.id}`)
            } else {
                // ให้เด้งเป็น error ที่จะบอกว่า login ไม่ผ่าน
            }
        })
    }
    // เราสามารถใช้ arrow function ในการ bind this ได้โดยไม่ต้องประกาศใน consturctor
    responseFacebook = (res) => {
        var data = {
            email : res.email,
            password: "" // เวลา login เราจะไม่ใช้ password เพระาเราขอสิทธิของข้อมูลมาแล้ว
        }

        axios.post("http://localhost:3001/login", data).then((res) => {
            if (res.data.status) { // เป็น True
                this.props.history.push(`/home/${res.data.id}`)
            } else {
            }
        })
    }

    render() {
        return (
            <div>
                {/* สังเกตเรียกใช้ฟังก์ชั่นใน input หรือ button จะไม่มี () 
                    ถ้าใส่จะเป็นการเรียกใช้งานแต่เริ่มทำงาน component นี้เลย 
                    ซึ่งทำให้โค้ตเราทำงานผิดพลาด */}
                <input type="text" onChange={this.handleChangeEmail} placeholder="email"/>
                <input type="password" onChange={this.handleChangePassword} placeholder="password"/>
                <button type="button" onClick={this.onClick}> Login </button>
                <FacebookLogin
                    appId="1088597931155576"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.responseFacebook} />
            </div>
        )
    }
}

export default Login;