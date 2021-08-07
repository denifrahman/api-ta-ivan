'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_prodi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_prodi.belongsTo(models.m_fakultas, {
        foreignKey: {
          field: 'fakultas_id',
          name: 'fakultas_id'
        }
      })
      m_prodi.hasMany(models.agendas, {
        as: "prodi_agendas",
        foreignKey: {
          field: "prodi_id",
          name: "prodi_id"
        }
      })
      m_prodi.hasMany(models.user, {
        foreignKey: {
          field: "prodi_id",
          name: "prodi_id"
        }
      })
    }
  };
  m_prodi.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_prodi',
  });
  return m_prodi;
};
