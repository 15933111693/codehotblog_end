const articleInit = function(app, user, article, comment, userIncludeList) {
    const includeList = ['/api/postArticle', '/api/editArticle', '/api/addlike', '/api/addcomment_article']
    for(let i of includeList) userIncludeList.add(i)
    app.post('/api/postArticle', async function(req, res) {
        const {title, titleImg, content, authorId, timing} = req.body.data
        const articleId = await article.addArticle(title, titleImg, content, authorId, timing)
        await user.addArticle(authorId, articleId)
        res.send({code: 200, msg: '发表成功'})
    })

    app.post('/api/editArticle', async function(req, res) {
        const {title, titleImg, content, _id} = req.body.data
        await article.changeArticle(_id, title, titleImg, content)
        res.send({code: 200, msg: '修改成功'})
    })

    app.get('/api/getArticle', async function(req, res) {
        const data = await article.getArticle()
        res.send({code: 200,data})
    })

    app.get('/api/article', async function(req, res) {
        const _id = req.query.id
        const data = await article.getOneArticle(_id)
        res.send({code: 200, data})
    })

    app.post('/api/addlike', async function(req, res) {
        const {_id, _userid} = req.body.data
        const flag = await article.is_like(_id, _userid)
        if(flag) {
            res.send({code: 404, msg: '您已经赞过了'})
        }
        else {
            await article.addlike(_id)
            await article.addLikelist(_id, _userid)
            res.send({code: 200, msg: '点赞成功'})
        }
    })

    app.post('/api/addcomment_article', async function(req, res) {
        const {_id, authorId, content, timing} = req.body.data
        const commentId = await comment.addComment(authorId, content, timing, true)
        await article.addComment(_id, commentId)
        res.send({code: 200, msg: '评论成功'})
    })

    app.get('/api/search', async function(req, res) {
        const {content} = req.query
        const arr = await article.searchArticle(content)
        res.send({code: 200, data: arr})
    })
}

module.exports.articleInit = articleInit