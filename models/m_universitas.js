'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_universitas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_universitas.hasMany(models.m_fakultas,{
        foreignKey:{
          field:'universitas_id',
          name:'universitas_id'
        }
      })
    }
  };
  m_universitas.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_universitas',
  });
  return m_universitas;
};
