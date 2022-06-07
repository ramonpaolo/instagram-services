import sequelize from 'sequelize'

export default new sequelize.Sequelize({
    dialect: 'sqlite',  storage: __dirname+'/../database/database.sqlite'
})