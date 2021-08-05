'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class t_agenda_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  t_agenda_history.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 't_agenda_history',
  });
  return t_agenda_history;
};