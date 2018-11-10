import React, { Component } from "react";
import axios from "axios";
class Home extends Component {
    // อย่าลืมเขียน constructor นะ
    constructor(props) {
        super(props)
        // กำหนดข้อมูลที่จะใช้ใน component นี้
        this.state = {
            email: "??",
            loginTimes : [],
        }
    }

    // ฟังก์ชั่น componetDidMount เป็นหนึ่งใน life cycle function ของ react ซึ่งจะทำงานตอนที่ถูกเรียกใช้ (Mount)
    componentDidMount() {
        // เราจะโยน id ของคนที่ login ผ่าน url มาเช่น http://localhost/home/1a2b 
        // โดยที่เราจะ get ค่า 1a2b มาใช้ในการ get ข้อมูลจาก express ผ่าน axios ซึ่งวิธีการ
        // เอาค่า id จาก url ตัว react-router-dom มีให้ใช้อยู่แล้วแต่ต้องทำการ super(props) ก่อน
        var userId = this.props.match.params.id
        console.log("inasdf")
        axios.get(`http://localhost:3001/loginDisplay/${userId}`).then((res) => {
            console.log(res)
            this.setState({
                email: res.data.email,
                loginTable: res.data.loginTable
            })
        })
    }

    // timesTable เป็นฟังก์ชั่นที่ใช้ฟังก์ชั่น map ตัวข้อมูลการ tag html สัง
    timesTable = () => {
        return this.state.loginTimes.map((time, index) => {
            return(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{time}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div>
                <p>{this.state.email}</p>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* เรียกใช้ function ในสร้าง tag tr  */}
                        {this.timesTable()}
                    </tbody>
                </table>
            </div>
            
        )
    }
}

export default Home;