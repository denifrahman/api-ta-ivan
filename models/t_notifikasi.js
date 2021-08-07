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
      t_notifikasi.belongsTo(models.user, {
        foreignKey: {
          field: 'user_id',
          name: 'user_id'
        }
      })
    }
  };
  t_notifikasi.init({
    nama: DataTypes.STRING,
    deskripsi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_notifikasi',
  });
  return t_notifikasi;
};