const mongodb = require('mongodb')
const user = require('./user')
const client = mongodb.MongoClient

const port = 27017
const url = `mongodb://localhost:${port}`

const dbInit = async function() {
    let res = await client.connect(url);
    let db = res.db('blog')
    db.createCollection('user', function(err, res) {
        if(err) return;
    })
    db.createCollection('comment', function(err, res) {
        if(err) return;
    })
    db.createCollection('article', function(err, res) {
        if(err) return;
    })
    return db
}

module.exports.dbInit = dbInit