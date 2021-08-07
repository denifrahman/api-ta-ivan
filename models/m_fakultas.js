'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_fakultas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_fakultas.hasMany(models.agendas, {
        as: "fakultas_agendas",
        foreignKey: {
          field: "fakultas_id",
          name: "fakultas_id"
        }
      })
      m_fakultas.hasMany(models.m_prodi,{
        foreignKey:{
          field:'fakultas_id',
          name:'fakultas_id'
        }
      })
      m_fakultas.belongsTo(models.m_universitas,{
        foreignKey:{
          field:'universitas_id',
          name:'universitas_id',
          allowNull:false
        }
      })
    }
  };
  m_fakultas.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_fakultas',
  });
  return m_fakultas;
};
