const fs = require('fs')
var rawData;
exports.init = () => {
    if (!fs.readFileSync(__dirname + '/friendcodes.json')) {
        console.debug('Could not find DB, creating new one...')
        fs.writeFileSync(__dirname + '/friendcodes.json', `{}`)
    }
    exports.raw = JSON.parse(fs.readFileSync(__dirname + '/friendcodes.json'))
    rawData = JSON.parse(fs.readFileSync(__dirname + '/friendcodes.json'))
    console.debug('Database initialized!')
}
exports.get = (uid) => {
    for (var i in rawData) {
        if (rawData[i].discord === uid) {
            return rawData[i].steam
        }
    }
}
