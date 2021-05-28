const {userInit} = require('./user')
const {commentInit} = require('./comment')
const {articleInit} = require('./article')
const {userIncludeList} = require('./userIncludeList')

const apiInit = function(app, {user, article, comment}) {
    userInit(app, user, userIncludeList)
    commentInit(app, user, article, comment, userIncludeList)
    articleInit(app, user, article, comment, userIncludeList)
}

module.exports.apiInit = apiInit