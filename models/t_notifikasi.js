'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_notifikasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  t_notifikasi.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_notifikasi',
  });
  return t_notifikasi;
};