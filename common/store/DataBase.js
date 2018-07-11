import SQLite from 'react-native-sqlite-storage';
import {appName}  from '../../app.json';

const db = SQLite.openDatabase({name: appName?appName+".db":'default.db', location: 'default'}, function () {
}, function (err) {
});

module.exports = db;
