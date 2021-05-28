/**
 * article
 * like: number 点赞数量
 * likeList: [] 点赞列表
 * timing: number 
 * title: string 文章标题
 * titleImg： string 文章标题图片连接
 * content: string 文章内容
 * username: string 文章作者名称
 * authorId: string 文章作者id
 * commentList: [] 文章评论id列表
 * */
const { ObjectId } = require("mongodb")
const { transformObjectId } = require("../utils/transformObjectId")

class Article {
    constructor(db) {
        this.collection = db.collection('article')
    }

    async addArticle(title, titleImg, content, authorId, timing) {
        const obj = {title, titleImg, content, authorId, timing, like: 0, likeList: [], commentList: []}
        await this.collection.insertOne(obj)
        const res = await this.collection.findOne(obj)
        const id = transformObjectId(res._id)
        return id
    }

    async getArticle() {
        const res = await this.collection.find().toArray()
        return transformObjectId(res)
    }

    async getOneArticle(_id) {
        const res = await this.collection.findOne({_id: ObjectId(_id)})
        return transformObjectId(res)
    }

    async addComment(_id, commentId) {
        const old = {_id: ObjectId(_id)}
        const change = {$addToSet: {commentList: commentId}}
        await this.collection.updateOne(old, change)
    }

    async changeArticle(_id, title, titleImg, content) {
        const obj = {_id: ObjectId(_id)}
        const change = {$set:{title, titleImg, content}}
        await this.collection.updateOne(obj, change)
    }

    async deleteComment(_id, _commentId) {
        const obj = {_id: ObjectId(_id)}
        const change = {$pull: {commentList: ObjectId(_commentId)}}
        this.collection.updateOne(obj, change)
    }

    async addLikelist(_id, userId) {
        const obj = {_id: ObjectId(_id)}
        const change = {$addToSet: {likeList: ObjectId(userId)}}
        await this.collection.updateOne(obj, change)
    }

    async addlike(_id) {
        const obj = {_id: ObjectId(_id)}
        const res = await this.collection.find(obj).toArray()
        const num = res[0].like
        const change = {$set: {like: num+1}}
        await this.collection.updateOne(obj, change)
    }

    async is_like(_id, _userId) {
        const obj = {_id: ObjectId(_id)}
        const res = await this.collection.find(obj).toArray()
        const arr = transformObjectId(res[0].likeList)
        for(let i of arr) {
            if(i === _userId) return true
        }
        return false
    }

    async searchArticle(title) {
        const data = {title:RegExp(title)}
        const res = await this.collection.find(data).toArray()
        return transformObjectId(res)
    }
}

module.exports.Article = Article