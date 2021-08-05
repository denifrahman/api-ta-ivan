'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class m_agenda extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            m_agenda.belongsTo(models.m_universitas, {
                foreignKey: {
                    field: "universitas_id",
                    name: "universitas_id"
                }
            })
            m_agenda.hasMany(models.t_agenda_fakultas, {
                foreignKey: {
                    field: "agenda_id",
                    name: "agenda_id"
                }
            })
            m_agenda.hasMany(models.t_agenda_prodi, {
                foreignKey: {
                    field: "agenda_id",
                    name: "agenda_id"
                }
            })
        }
    };
    m_agenda.init({
        nama: DataTypes.STRING,
        kode: DataTypes.STRING,
        tanggal_mulai: DataTypes.DATE,
        tanggal_selesai: DataTypes.DATE,
        cover: DataTypes.STRING,
        deskripsi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'm_agenda',
    });
    return m_agenda;
};
