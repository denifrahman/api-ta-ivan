'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_agenda_prodi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      t_agenda_prodi.belongsTo(models.m_agenda,{
        foreignKey:{
          field:"agenda_id",
          name:"agenda_id"
        }
      })
      t_agenda_prodi.belongsTo(models.m_fakultas,{
        foreignKey:{
          field:"fakultas_id",
          name:"fakultas_id"
        }
      })
    }
  };
  t_agenda_prodi.init({
  }, {
    sequelize,
    modelName: 't_agenda_prodi',
  });
  return t_agenda_prodi;
};
