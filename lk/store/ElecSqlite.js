const Application = require('../LKApplication')
const path = require("path");
const sqlite3 = require("./sqlite3.asar");

let dbName = Application.getCurrentApp().getName()||"default";

db = new sqlite3.cached.Database(path.join(__dirname, dbName+".db"));

module.exports = db;
