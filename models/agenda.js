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
            m_agenda.belongsTo(models.m_fakultas, {
                foreignKey: {
                    field: "fakultas_id",
                    name: "fakultas_id"
                }
            })
            m_agenda.belongsTo(models.m_prodi, {
                foreignKey: {
                    field: "prodi_id",
                    name: "prodi_id"
                }
            })
            m_agenda.hasMany(models.user_agenda, {
                foreignKey: {
                    field: 'agenda_id',
                    name:'agenda_id'
                }
            })
        }
    };
    m_agenda.init({
        nama: DataTypes.STRING,
        kode: DataTypes.STRING,
        tanggal_mulai: { type: DataTypes.DATE, allowNull: false },
        tanggal_selesai: { type: DataTypes.DATE, allowNull: false },
        tanggal_tayang: { type: DataTypes.DATE, allowNull: false },
        tanggal_non_tayang: { type: DataTypes.DATE, allowNull: false },
        cover: DataTypes.STRING,
        deskripsi: DataTypes.STRING,
        poster: DataTypes.STRING
    }, {
        sequelize,
        tableName: 'agendas',
        modelName: 'agendas',
    });
    return m_agenda;
};
