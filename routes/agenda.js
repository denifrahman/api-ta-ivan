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
    check('nama').notEmpty().withMessage('nama tidak boleh kosong'),
    check('kode').notEmpty().withMessage('kode tidak boleh kosong')
];
// find all routes
router.route('/agendas')
    .get((req, res) => {
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
        db.agendas.findAndCountAll(
            {
                where: [
                    { [Op.or]: query_like.length == 0 ? [{ nama: { [Op.like]: '%%' } }] : query_like },
                    { [Op.and]: query_and }],
                limit: (isNaN(limit)) ? null : limit,
                offset: (isNaN(offset)) ? null : offset * limit,
                include: [{ model: db.m_universitas }]
            }
        ).then((result) => {
            res.status(200).send(
                {
                    statusCode: 200,
                    status: true,
                    data: result,
                    message: "data retreive successfully!"
                }
            );

        }).catch(err => {
            res.status(400).send({
                statusCode: 400,
                status: false,
                message: err
            });
        });
    });

router.route('/agenda')
    .post(validateCreate, async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                statusCode: 400,
                status: false,
                message: errors.errors
            });
        } else {
            db.sequelize.transaction(async (t) => {
                db.agendas.findOrCreate({
                    where: {
                        nama: req.body.nama
                    },
                    defaults: req.body
                }).then(async (result) => {
                    var created = result[1];
                    if (!created) {
                        res.status(400).send({
                            statusCode: 400,
                            status: false,
                            message: `email ${req.body.nama} sudah terdaftar`
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
                }).catch(async (err) => {
                    res.status(400).send({
                        code: 400,
                        status: false,
                        message: err
                    });
                    // await t.rollback();
                });;
            });
        }
    });

module.exports = router;