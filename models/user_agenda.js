'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_agenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_agenda.belongsTo(models.agendas, {
        foreignKey: {
          allowNull: false,
          field: 'agend_id',
          name: 'agenda_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
      user_agenda.belongsTo(models.user, {
        foreignKey: {
          allowNull: false,
          field: 'user_id',
          name: 'user_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }
  };
  user_agenda.init({
    agenda_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    count_notif: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_agenda',
  });
  return user_agenda;
};