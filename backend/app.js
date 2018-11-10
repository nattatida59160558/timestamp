const express = require('express')
// bodyParser คือ middleware ที่ใช้ในการจัดการข้อมูลที่ถูกส่งจาก request ให้อยู่ในสภาพที่พร้อมใช้งาน
// เพราะว่าถ้าเราจัดการกับ request (req) ตรงๆ จะจัดการได้ยากมากเพราะข้อมูล request ถูกส่งมาเป็นย่อยที่เรียกว่า pocket 
// ตัว bodyParset จะทำหน้าที่แทนในการจัดการส่วนย่อยๆนั้น และแปลงเป็น format ที่ต้องการเช่่น json, form
const bodyParser = require('body-parser')
// cors ย่อมาจาก Cross-origin resource sharing เป็นการกำหนดสิทธิในการเข้าถึง resourse ที่ไม่ใช้มาจาก domain เดียวกัน
// ที่นี้ถ้าเราใช้ localhost ตัว url ที่เข้ามาติดต่อจะต้องเป็น localhost:xxxx เท่านั้นแต่ถ้าเราจะเอา url อื่นมาต่อจะไม่สามารถเข้าถึง resource ได้
const cors= require('cors')
// ตัวแทนของการเชื่อมต่อ db เรียกว่า client
const mongoClient = require('mongodb').MongoClient
// mongo จะใช้ชนิดพิเศษในการทำตัว id เฉพาะที่เรียกว่า objectID
const ObjectId = require('mongodb').ObjectID
// กำหนด url ที่อยู่ของ db 
const url = 'mongodb://tester:password@localhost:2277/test'
// กำหนดชื่อ db ที่สร้างขึ้น
const dbName = 'test';

const app = express()
const port = 3001
// app.use เป็นการบอกว่า express ใช้ middleware ทำอะไรบ้าง การประกาศแบบนี้มันจะครอบคลุมถึง resquest ที่เกิดขึ้นทั้งหมด
app.use(bodyParser.json())
app.use(cors())

// การเขียน uri ในการกำหนดการเข้าถึง resource มีหลายรูปแบบขึ้นอยู่กับทีมและการเขียนจะสื่อถึงอะไรเช่น
// app.get('/users') , app.post('/users)
// app.get('/api'), app.get('/api/user)
// app.get('/animal/cat/kitty')


// รับ request แบบ get ซึ่ง :id จะเป็นค่าอะไรก็ที่จะบ่งบอกว่าเราต้องการอะไร ที่นี้พี่ส่ง userId มาจาก frontEnd เพื่อเอาข้อมูลของ user 
// คนนั้นส่งกลับไป
app.get('/loginDisplay/:id', (req, res) => {
    // วิธีการเขียนจะเป็นรูปแบบ callback ซ้อนกันไปเรื่อย ๆ
    mongoClient.connect(url, (err, client) => { // <= callback
        console.log('Connected successfully to server');
        const db = client.db(dbName)
        // findOne คือการค้นหาเพียงหนึ่ง collection โดยใช้เงื่อนไขการค้นหาได้ (ใน { })
        db.collection('users').findOne({'_id': new ObjectId(req.params.id)}, (err, result) =>{ // <= callback
            if (err) throw err;
            // res.json ทำการแปลง object เป็น string json เพื่อส่งไปยังหน้าเว็บ
            res.json(result);
        })
        client.close()
    })
})

// รับ request แบบ post ที่จะเอาข้อมูลจาก field body มาทำการเช็ค user ว่ามีหรือไหม ถ้าไม่มีจะทำการ insert
app.post('/register', (req, res) => {
    mongoClient.connect(url, (err, client) => {
        const db = client.db(dbName)
        db.collection('users').findOne({ email: req.body.email }, (err, result) => { // <= callback
            if (err) throw err
            // if ข้างล่างเป็นเช็คว่ามี email นี้หรือไหมถ้ามีต้อง return ค่า status ไปยังคนเรียกนั้นคือ react
            if (result === null) {
                const newUser = {
                    email: req.body.email,
                    password: req.body.password,
                    times: [],
                    facebookLogin: false,
                };
                // ถ้าไม่มี user ในทำการ insert
                // insertOne ต้องการ data ที่เป็น object (key: value) ในตัวเองคือ newUser
                db.collection('users').insertOne(newUser, (err, result) => {
                    if (err) throw err
                    client.close()
                    // res.json ทำการแปลง object เป็น string json เพื่อส่งไปยังหน้าเว็บ
                    // ที่จะใส่ stutus เป็น true เพื่อบอกว่า resgister สำเร็จ
                    res.json({status: true})
                })
            } else {
                res.json({status: false}) 
                client.close()
            }
        })
    })
})

app.post('/login', (req, res) => {
    // วิธีการเขียนจะเป็นรูปแบบในรูปแบบ then ที่จะทำต่อจากการทำงานของ function ที่อยู่ด้านเสร็จ (แล้วแต่ชอบ)
    mongoClient.connect(url).then(function (client) {
        const db = client.db(dbName)
        db.collection("users").findOne({'email': req.body.email, 'password': parseInt(req.body.password) }).then((data) => {
            if(data != null) {
                // เป็นกำหนด response ว่าทำงานเสร็จโดยใช้ code 200
                res.status(200)
                res.json({status: true, id: data._id})
            } else {
                // เป็นกำหนด response ว่าไม่สามารถเข้าใช้งานได้โดยใช้ code 401 คือ unauthorized
                res.sendStatus(401)
            }
        })  
    })
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})