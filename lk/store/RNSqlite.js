const Application = require('../LKApplication')
const SQLite = require('react-native-sqlite-storage')

let dbName = Application.getCurrentApp().getName()||"default";
const db = SQLite.openDatabase({name: dbName+'.db', location: 'default'}, function () {
}, function (err) {
});

module.exports = db;
