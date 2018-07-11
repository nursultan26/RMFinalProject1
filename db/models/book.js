module.exports = (sequelize, type) => {
    return sequelize.define('Books', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: type.STRING,
        author: type.STRING,
        description: type.TEXT,
        imgLink: type.STRING

    })
}