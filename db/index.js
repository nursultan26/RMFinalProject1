const Sequelize = require('sequelize')
const bookModel = require('./models/book')
const userModel = require('./models/user')
const config = require('../config')

const sequelize = new Sequelize(config.database, config.user, config.dbPassword, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Book = bookModel(sequelize, Sequelize)
const User = userModel(sequelize, Sequelize)

sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  User,
  Book
}