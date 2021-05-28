/**
 * comment
 * re_commentList: [] // 回复列表id 
 * content: string
 * authorId: string
 * timing: number     // 时间戳
 * like: number       // 被点赞数量
 * likeList           // 用户点赞列表
 * isRecomment        // 是否是吐槽
*/

const {ObjectId} = require('mongodb')
const { transformObjectId } = require('../utils/transformObjectId')

class Comment {
    constructor(db) {
        this.collection = db.collection('comment')
    }

    async addComment(authorId, content, timing, isRecomment) {
        const obj = {re_commentList: [], content, authorId, timing, like: 0, likeList: [], isRecomment}
        await this.collection.insertOne(obj)
        const comment = transformObjectId(await this.collection.findOne({authorId, content, timing}))
        return comment._id
    }

    async getAllComment() {
        const obj = {isRecomment: false}
        const res = await this.collection.find(obj).toArray()
        return transformObjectId(res)
    }

    async getOneComment(_id) {
        const res = await this.collection.findOne({_id: ObjectId(_id)})
        return transformObjectId(res)
    }

    async getMyComment(_id) {
        const data = {authorId: _id, isRecomment: false}
        const arr = await this.collection.find(data).toArray()
        return transformObjectId(arr)
    }

    async addRe_commentList(_id, re_commentId) {
        const obj = {_id: ObjectId(_id)}
        const change = {$addToSet: {re_commentList: re_commentId}}
        await this.collection.updateOne(obj, change)
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
        const res = await this.collection.findOne(obj)
        const arr = transformObjectId(res.likeList)
        for(let i of arr) if(i === _userId) return true
        return false
    }

    async deleteComment(_id) {
        const obj = {_id: ObjectId(_id)}
        await this.collection.deleteOne(obj)
    }
}

module.exports.Comment = Comment