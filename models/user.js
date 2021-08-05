'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user.belongsTo(models.m_prodi, {
                foreignKey: {
                    field: 'user_id',
                    name:'user_id'
                }
            })
        }
    };
    user.init({
        nama: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        alamat: DataTypes.STRING,
        role: {type: DataTypes.ENUM('ADMIN', 'MAHASISWA')}
    }, {
        sequelize,
        modelName: 'user',
    });
    return user;
};
