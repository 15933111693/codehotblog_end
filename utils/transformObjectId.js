const { ObjectID } = require("bson")

const transformObjectId = function(target) {
    if(target instanceof ObjectID) {
        return target.toHexString()
    }
    else if(target instanceof Array) {
        for(let i=0;i<target.length;i++) {
            target[i] = transformObjectId(target[i])
        }
    }
    else if(target instanceof Object) {
        for(let i in target) {
            target[i] = transformObjectId(target[i])
        }
    }
    return target
}

module.exports.transformObjectId = transformObjectId