const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Secret = 'cheng'
const user = function(app, user, userIncludeList) {
    const includelist = ['/api/changeAvatar', '/api/changePwd', '/api/changeUserName', '/api/getUserInfo']
    for(let i of includelist) userIncludeList.add(i)
    

    app.use(async function(req, res, next) {
        if(userIncludeList.has(req.path)) {
            if(!req.cookies.token) res.send({code: 300,msg: '请先登陆'}) 
            else {
                const id = jwt.verify(req.cookies.token, Secret).id
                const flag = await user.findUser_id(id)
                if(!flag) res.send({code: 300,msg: '请先登陆'}) 
                else next()
            }
        }
        else next()
    })

    app.post('/api/login', async function(req, res) {
        const {admin, password} = req.body.data
        const flag = await user.findUser(admin)
        if(flag) {
            const dbPwd = await user.findPwd(admin)
            const dbid = await user.findId(admin)
            if(bcrypt.compareSync(password, dbPwd)) {
                const token = jwt.sign({id: dbid}, Secret, {expiresIn: '30d'})
                res.cookie('token', token) 
                const data = await user.getUserAllInfo(dbid)
                res.send({code: 200, data, msg: '登陆成功'})
            }
            else {
                res.send({code: 404, msg: '密码错误'})
            }
        }
        else {
            res.send({code: 404, msg: '没有该账号信息'})
        }
    })

    app.post('/api/getUserInfo', async function(req, res) {
        if(!req.cookies.token) {
            res.send({msg: '没有token', code: 100})
        }
        else {
            const _id = jwt.verify(req.cookies.token, Secret).id
            const data = await user.getUserAllInfo(_id)
            res.send({data, code: 200})
        }
    })

    app.post('/api/registor', async function(req, res) {
        const {admin, password} = req.body.data
        const flag = await user.findUser(admin)
        if(flag) {
            res.send({code: 424, msg: '该账号已注册'})
        }
        else {
            const dbpwd = bcrypt.hashSync(password, 10)
            await user.addUser(admin, dbpwd)
            res.send({code: 200, msg: '注册成功'})
        }
    })

    app.post('/api/changeAvatar', async function(req, res) {
        const {_id, avatar} = req.body.data
        await user.changeAvatar(_id, avatar)
        res.send({code: 200, msg: '修改成功'})
    })

    app.post('/api/changePwd', async function(req, res) {
        const {_id, password} = req.body.data
        await user.changePwd(_id, bcrypt.hashSync(password, 10))
        res.send({code: 200, msg: '修改成功'})
    })

    app.post('/api/changeUserName', async function(req, res) {
        const {_id, username} = req.body.data
        if(await user.getUserName(username)) {
            res.send({code: 404, msg: '已经有人注册过了'})
        }
        else {
            await user.changeUserName(_id, username) 
            res.send({code: 200, msg: '修改成功'})
        }
    })

    app.get('/api/getArticleList', async function (req, res) {
        const id = req.query.id
        const arr = await user.getArticleList(id)
        res.send({code: 200, data: arr})
    })

    app.post('/api/getUserNameAndAvatar', async function(req, res) {
        const {_id} = req.body.data
        const data = await user.getUserNameAndAvatar(_id)
        res.send({code: 200, data})
    })
}

module.exports.userInit = user