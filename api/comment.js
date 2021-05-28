const commentInit = function(app, user, article, comment, userIncludeList) {
    const includeList = ['/api/likeComment', '/api/addComment', "/api/postComment", '/api/getMycomment']
    for(let i of includeList) userIncludeList.add(i)

    app.post("/api/postComment", async function(req, res) {
        const {authorId, content, timing} = req.body.data
        await comment.addComment(authorId, content, timing, false)
        res.send({code: 200, msg: '评论成功'})
    })

    app.get('/api/getCommentList', async function(req, res) {
        const data = await comment.getAllComment()
        data.sort((a,b) => b.timing - a.timing)
        res.send({data, code: 200})
    })

    app.post('/api/getMycomment', async function(req, res) {
        const {_id} = req.body.data
        const arr = await comment.getMyComment(_id)
        for(let i of arr) {
            const {username, avatar} = await user.getUserNameAndAvatar(i.authorId)
            i.username = username
            i.avatar = avatar
        }

        arr.sort((a, b) => b.timing - a.timing)
        res.send({code: 200, data: arr})
    })

    app.post('/api/getOneComment', async function(req, res) {
        const {_id} = req.body.data
        const obj = await comment.getOneComment(_id)
        const {username, avatar} = await user.getUserNameAndAvatar(obj.authorId)
        obj.username = username
        obj.avatar = avatar
        res.send({code:200, data: obj})
    })

    app.post('/api/getRecomment', async function(req, res) {
        const {_id} = req.body.data

        const obj = await comment.getOneComment(_id)
        const ans = []
        const n = obj.re_commentList.length
        for(let i=0;i<n;i++) {
            const t = await comment.getOneComment(obj.re_commentList[i])
            const {avatar, username} = await user.getUserNameAndAvatar(t.authorId)
            t.avatar = avatar, t.username = username
            ans.push(t)
        }
        const  dfs = async (obj, t) => {
            const arr = obj.re_commentList
            const id = obj.authorId
            const {username, avatar} = await user.getUserNameAndAvatar(id)
            if(arr.length === 0) return
            for(let i=0;i<arr.length;i++) {
                const res = await comment.getOneComment(arr[i])
                res.recommentAuthor = username
                res.recommentAvatar = avatar
                const res2 = await user.getUserNameAndAvatar(res.authorId)
                res.username = res2.username
                res.avatar = res2.avatar
                t.push(res)
                await dfs(res, t)
            }
        }

        for(let i=0;i<n;i++) {
            const t = []
            await dfs(ans[i], t)
            t.sort((a, b) => b.timing - a.timing)
            ans[i].re_commentList = t
        }
        ans.sort((a, b) => b.timing - a.timing)
        res.send({code: 200, data: ans})
    })

    app.post('/api/getRecommentReply', async function(req, res) {
        const {_id} = req.body.data
        const obj = await comment.getOneComment(_id)
        const arr = obj
        
        const t = []
        const  dfs = async (obj) => {
            const arr = obj.re_commentList
            const id = obj.authorId
            const {username, avatar} = await user.getUserNameAndAvatar(id)
            if(arr.length === 0) return
            for(let i=0;i<arr.length;i++) {
                const res = await comment.getOneComment(arr[i])
                res.recommentAuthor = username
                const res2 = await user.getUserNameAndAvatar(res.authorId)
                res.username = res2.username
                res.avatar = res2.avatar
                t.push(res)
                await dfs(res)
            }
        }
        await dfs(arr)
        t.sort((a, b) => b.timing - a.timing)
        res.send({code: 200, data: t})
    })

    app.post('/api/likeComment', async function(req, res) {
        const {_id, _userId} = req.body.data
        const f = await comment.is_like(_id, _userId)

        if(f) {
            res.send({code: 404, msg: '您已经点过赞了!'})
        }
        else {
            await comment.addlike(_id)
            await comment.addLikelist(_id, _userId)
            res.send({code: 200, msg: '点赞成功!'})
        }
    })

    app.post('/api/addComment', async function(req, res) {
        const {authorId, content, timing, _id} = req.body.data
        const re_commentId = await comment.addComment(authorId, content, timing, true)
        await comment.addRe_commentList(_id, re_commentId)
        res.send({code: 200, msg: '回复成功'})
    })
}

module.exports.commentInit = commentInit