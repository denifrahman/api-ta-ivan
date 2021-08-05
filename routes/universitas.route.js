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
router.route('/universitas')
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
        const count = await db.m_universitas.findAndCountAll({
            where: [
                { [Op.or]: query_like.length == 0 ? [{ nama: { [Op.like]: '%%' } }] : query_like },
                { [Op.and]: query_and }],
            limit: (isNaN(limit)) ? null : limit,
            offset: (isNaN(offset)) ? null : offset * limit,
        });
        db.m_universitas.findAll(
            {
                where: [
                    { [Op.or]: query_like.length == 0 ? [{ nama: { [Op.like]: '%%' } }] : query_like },
                    { [Op.and]: query_and }],
                limit: (isNaN(limit)) ? null : limit,
                offset: (isNaN(offset)) ? null : offset * limit,
                include: [{ model: db.m_fakultas, include: [{ model: db.m_prodi }] }]
            }
        ).then((result) => {
            console.log(result);
            res.status(200).send(
                {
                    statusCode: 200,
                    status: true,
                    data: {
                        count: count.count,
                        rows: result
                    },
                    message: "data telah berhasil"
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

router.route('/universitas/:id')
    .get((req, res) => {
        db.m_universitas.findOne(
            {
                where: { id: req.params.id },
            }
        ).then((result) => {
            res.status(200).send(
                {
                    statusCode: 200,
                    status: true,
                    data: result,
                    message: "data telah berhasil"
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

//register
router.route('/universitas')
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
                db.m_universitas.findOrCreate({
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
                            message: `nama ${req.body.username} sudah terdaftar`
                        }); // false if user already exists and was not created.

                    } else {
                        res.status(201).send(
                            {
                                statusCode: 201,
                                status: true,
                                data: req.body,
                                message: "data telah berhasil"
                            }
                        );
                    }
                });
            });
        }
    });

//update
router.route('/universitas/:id')
    .put((req, res) => {
        db.sequelize.transaction(async (t) => {
            db.m_universitas.update(req.body, {
                where: {
                    id: req.params.id
                },
            }).then(async (result) => {
                res.status(200).send(
                    {
                        statusCode: 200,
                        status: true,
                        data: req.body,
                        message: "data telah berhasil"
                    }
                );
            }).catch(async (err) => {
                res.status(400).send({
                    statusCode: 400,
                    status: false,
                    message: 'gagal'
                }); // false if user already exists and was not created.
                await t.rollback();
            });
        });
    });

//delete
router.route('/universitas/:id')
    .delete((req, res) => {
        db.sequelize.transaction(async (t) => {
            db.m_universitas.destroy({
                where: {
                    id: req.params.id
                },
            }).then(async (result) => {
                res.status(200).send(
                    {
                        statusCode: 200,
                        status: true,
                        data: req.body,
                        message: "data telah berhasil"
                    }
                );
            }).catch(async (err) => {
                res.status(400).send({
                    statusCode: 400,
                    status: false,
                    message: 'gagal'
                }); // false if user already exists and was not created.
                await t.rollback();
            });
        });
    });

module.exports = router;

