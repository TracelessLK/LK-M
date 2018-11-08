const SQLite = require('react-native-sqlite-storage')
const {appName}  = require('../../app.json')

const db = SQLite.openDatabase({name: appName?appName+".db":'default.db', location: 'default'}, function () {
}, function (err) {
});

module.exports = db;
