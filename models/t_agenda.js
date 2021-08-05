'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_agenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      t_agenda.belongsTo(models.t_agenda_fakultas,{
        foreignKey:{
          field:'agenda_fakultas_id',
          name:'agenda_fakultas_id'
        }
      })
      t_agenda.belongsTo(models.t_agenda_prodi,{
        foreignKey:{
          field:'agenda_prodi_id',
          name:'agenda_prodi_id'
        }
      })
    }
  };
  t_agenda.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_agenda',
  });
  return t_agenda;
};
