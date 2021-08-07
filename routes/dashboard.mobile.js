const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const bcrypt = require('bcrypt');
const { query } = require('express');
const IsEmpty = require('../middleware/IsEmpty');
const saltRounds = 10;
const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const { check } = require('express-validator');

const validateCreate = [
    check('nama').notEmpty().withMessage('nama tidak boleh kosong')
];
// find all routes
router.route('/dashboard-mobile')
    .get(async (req, res) => {
        var data = req.query;
        var query_like = [];
        var query_and = [];
        for (const [key, value] of Object.entries(data)) {
            if (key == 'q') {
                query_like.push({ nama: { [Op.like]: `%${value}%` } });
            }

        }
        const limit = Number(req.query.size);
        const offset = Number(req.query.page);
        universitas = await db.m_universitas.findOne(
            {
                where: [
                    { [Op.or]: query_like.length == 0 ? [{ nama: { [Op.like]: '%%' } }] : query_like },],
                limit: 10,
                include: [{
                    model: db.agendas, as: "universitas_agendas", where: { universitas_id: req.query.universitas_id }, limit: 10
                }]
            }
        );
        fakultas = await db.m_fakultas.findOne(
            {
                where: {
                    id: req.query.fakultas_id
                },
                limit: 10,
                include: [{ model: db.agendas, as: "fakultas_agendas", limit: 10 }]
            }
        );
        prodi = await db.m_prodi.findOne(
            {
                where: {
                    id: req.query.prodi_id
                },
                limit: 10,
                include: [{ model: db.agendas, as: "prodi_agendas", limit: 10 }]
            }
        );

        result = {
            universitas: universitas,
            fakultas: fakultas,
            prodi: prodi
        }
        res.status(200).send(
            {
                statusCode: 200,
                status: true,
                data: result,
                message: "data retreive successfully!"
            }
        );
    });

module.exports = router;