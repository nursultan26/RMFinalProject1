module.exports = (sequelize, type) => {
    return sequelize.define('Users', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: type.STRING,
        username: type.STRING,
        password: type.STRING,
    })
}