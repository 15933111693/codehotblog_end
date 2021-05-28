// 服务器
const express = require('express')

// 工具库
const fs = require('fs')
const path = require('path')
const uuid = require('node-uuid')

// 中间件
const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser')
const multer = require('multer')

// 数据库
const {dbInit} = require('./model/index.js')
const {User} = require('./model/user.js')
const {Article} = require('./model/article')
const {Comment} = require('./model/comment');
const { apiInit } = require('./api/index.js');

// 这里使用绝对地址
const upload = multer({
    dest: __dirname + '/public'
});
const app = express()
const port = 3000
const localhost = 'http://192.168.0.105:' + port;
const requestIp = "http://192.168.0.105:8080"

// 中间件
app.use('/public', express.static('public'))
app.use(bodyParser.json())
app.use(cookieparser())

// cors
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", requestIp);
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 执行服务
;(async function() {
    const db = await dbInit()
    const user = new User(db);
    const article = new Article(db)
    const comment = new Comment(db)
    // 604f1e37995edb3d08092884
    apiInit(app, {user, article, comment})
    
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    
    // 上传图片
    app.post('/api/uploadImg', upload.single('file'), async (req, res) => {
        const file = req.file;
        let oldname = file.path 
        let newname = file.path + path.parse(file.originalname).ext //.jpg
        fs.renameSync(oldname, newname)//将老的文件名改成新的有后缀的文件 #同步写法
        file.url = `${localhost}/public/${file.filename + path.parse(file.originalname).ext}`;
        res.send(file);
    });
    
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})()

