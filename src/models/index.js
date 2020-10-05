const Sequelize = require('sequelize');
const {DATABASE,DB_USER,DB_PASS, PG_CONFIG} = require('../config/config')
const fs = require('fs');
const path = require('path');
const sequelize = new Sequelize(DATABASE, DB_USER,DB_PASS,PG_CONFIG);

fs
.readdirSync(path.join(__dirname))
.filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js") && (file.indexOf(".js"));
  })
.forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    console.log(model.name)
    
    sequelize[model.name] = model;
});

module.exports = sequelize;
