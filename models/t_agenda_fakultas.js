'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_agenda_fakultas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      t_agenda_fakultas.belongsTo(models.m_agenda,{
        foreignKey:{
          field:"agenda_id",
          name:"agenda_id"
        }
      })
      t_agenda_fakultas.belongsTo(models.m_fakultas,{
        foreignKey:{
          field:"fakultas_id",
          name:"fakultas_id"
        }
      })
    }
  };
  t_agenda_fakultas.init({
  }, {
    sequelize,
    modelName: 't_agenda_fakultas',
  });
  return t_agenda_fakultas;
};
