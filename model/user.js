/**
 * user: model
 * 
 * admin: string
 * username: string
 * password: string
 * articleList: []
 * commentList: [] 
 * avatar: string
 */
const { ObjectId } = require('mongodb')
const { transformObjectId } = require('../utils/transformObjectId.js')
class User {
    constructor(db) {
        this.collection = db.collection('user')
    }

    async addUser(admin, password) {
        const flag = await this.collection.findOne({admin})
        if(flag) return false
        const obj = {admin, username: admin, password, avatar: 'http://localhost:3000/public/user.jpg', articleList: [], commentList: []}
        await this.collection.insertOne(obj)
        return true
    }

    async findId(admin) {
        const obj =  {admin}
        const user = await this.collection.findOne(obj)
        const id = transformObjectId(user._id)
        return id
    }

    async findUser(admin) {
        const obj = {admin}
        return (await this.collection.findOne(obj)) ? true : false
    }

    async findUser_id(id) {
        const obj = {_id: ObjectId(id)}
        return (await this.collection.findOne(obj)) ? true : false
    }
 
    async findPwd(admin) {
        const obj = {admin}
        const res = await this.collection.findOne(obj)
        return res.password
    }

    async changePwd(_id, password) {
        const old = {_id: ObjectId(_id)}
        const change = {$set: {password}}
        await this.collection.updateOne(old, change)
    }

    async addArticle(_id, articleId) {
        const old = {_id: ObjectId(_id)}
        const change = {$addToSet: {articleList: ObjectId(articleId)}}
        await this.collection.updateOne(old, change)
    }

    async addComment(_id, commentId) {
        const old = {_id: ObjectId(_id)}
        const change = {$addToSet: {commentList: ObjectId(commentId)}}
        await this.collection.updateOne(old, change)
    }

    async changeAvatar(_id, avatar) {
        const old = {_id: ObjectId(_id)}
        const change = {$set: {avatar}}
        await this.collection.updateOne(old, change)
    }

    async getUserName(username) {
        const obj = {username}
        return (await this.collection.findOne(obj)) ? true : false
    }

    async changeUserName(_id, username) {
        const old = {_id: ObjectId(_id)}
        const change = {$set: {username}}
        await this.collection.updateOne(old, change)
    }

    async getArticleList(_id) {
        const obj = {_id: ObjectId(_id)}
        const res = await this.collection.find(obj).toArray()
        const arr = res[0].articleList
        return transformObjectId(arr)
    }

    async getCommentList(_id) {
        const obj = {_id: ObjectId(_id)}
        const res = await this.collection.find(obj).toArray()
        return transformObjectId(res[0].commentList)
    }

    async getUserAllInfo(_id) {
        const obj = {_id: ObjectId(_id)}
        const res = await this.collection.find(obj).toArray()
        const n = res[0].password.length
        let pwd = ''
        for(let i=0;i<n;i++) pwd+='*'
        res[0].password = pwd
        return transformObjectId(res[0])
    }

    async getUserNameAndAvatar(_id) {
        const obj = {_id: ObjectId(_id)}
        const res = await this.collection.findOne(obj)
        const ans = {username: res.username, avatar: res.avatar}
        return ans
    }

    async deleteUser(_id) {
        const obj = {_id: ObjectId(_id)}
        await this.collection.deleteOne(obj)
    }
}

module.exports.User = User
