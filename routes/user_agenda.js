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
const e = require('express');

const validateCreate = [
    check('user_id').notEmpty().withMessage('user_id tidak boleh kosong'),
    check('agenda_id').notEmpty().withMessage('agenda_id tidak boleh kosong')
];
// find all routes
router.route('/user-agenda')
    .get(async (req, res) => {
        var data = req.query;
        var query_like = [];
        var query_and = [];
        for (const [key, value] of Object.entries(data)) {
            if (key == 'q') {
                query_like.push({ nama: { [Op.like]: `%${value}%` } });
            } else if (key == 'user_id') {
                query_and.push({ user_id: { [Op.like]: `%${value}%` } });
            } else if (key == 'agenda_id') {
                query_and.push({ agenda_id: { [Op.like]: `%${value}%` } });
            }

        }
        const limit = Number(req.query.size);
        const offset = Number(req.query.page);
        user_agenda = await db.user_agenda.findOne(
            {
                where: [
                    { [Op.and]: query_and }

                ],
                limit: 10,
                include: [{
                    model: db.agendas,
                }, { model: db.user }]
            }
        );

        res.status(200).send(
            {
                statusCode: 200,
                status: true,
                data: user_agenda,
                message: "data retreive successfully!"
            }
        );
    });

router.route('/user-agenda')
    .post(validateCreate, async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                statusCode: 400,
                status: false,
                message: errors.errors
            });
        } else {
            db.user_agenda.findOrCreate({
                where: {
                    user_id: req.body.user_id,
                    agenda_id: req.body.agenda_id
                },
                defaults: req.body
            }).then((result) => {
                var created = result[1];
                if (!created) {
                    res.status(400).send({
                        statusCode: 400,
                        status: false,
                        message: `Anda sudah mengikuti anda`
                    }); // false if user already exists and was not created.

                } else {
                    res.status(200).send(
                        {
                            statusCode: 200,
                            status: true,
                            data: req.body,
                            message: "data created successfully!"
                        }
                    );
                }
            }).catch(err => {
                res.status(400).send({
                    statusCode: 400,
                    status: false,
                    message: err
                });
            });
        }
    });
router.route('/user-agendas')
    .get(async (req, res) => {
        var data = req.query;
        var query_like = [];
        var query_and = [];
        for (const [key, value] of Object.entries(data)) {
            if (key == 'q') {
                query_like.push({ nama: { [Op.like]: `%${value}%` } });
            } else if (key == 'user_id') {
                query_and.push({ user_id: { [Op.like]: `%${value}%` } });
            }
        }
        const limit = Number(req.query.size);
        const offset = Number(req.query.page);
        user_agenda = await db.user_agenda.findAll(
            {
                where: [
                    { [Op.and]: query_and }

                ],
                limit: 10,
                include: [{
                    model: db.agendas, include: [{ model: db.m_universitas }, { model: db.m_fakultas }, { model: db.m_prodi }]
                }, { model: db.user }]
            }
        );

        res.status(200).send(
            {
                statusCode: 200,
                status: true,
                data: user_agenda,
                message: "data retreive successfully!"
            }
        );
    });

module.exports = router;