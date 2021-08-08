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
const getBaseUrl = require("get-base-url").default
const multer = require('multer');
const path = require('path').resolve('./')
multer({ dest: path + '/public/uploads/images/' });

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
            if (key == 'universitas_id') {
                query_and.push({ universitas_id: { [Op.like]: `%${value}%` } });
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
                include: [{ model: db.m_universitas }, { model: db.m_fakultas }, { model: db.m_prodi }]
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

router.route('/agenda/:id')
    .get((req, res) => {
        db.agendas.findOne(
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

router.route('/agenda')
    .post(validateCreate, async (req, res) => {
        let transaction;
        try {
            transaction = await db.sequelize.transaction();
            validationResult(req).throw();
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).send({ statusCode: 400, status: false, message: 'No files were uploaded.' });
                return;
            }
            const typeFile = req.files.cover.mimetype.split('/');
            cover = req.files.cover;
            const timeStamp = new Date();
            const fileName = timeStamp.getTime() + `.${typeFile[1]}`
            uploadPath = path + '/public/uploads/images/' + fileName;
            req.body.cover = 'http://' + req.get('host') + '/uploads/images/' + fileName;
            console.log(req.body);
            await db.agendas.create(req.body, { transaction });
            if (transaction) {
                cover.mv(uploadPath, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(201).send(
                        {
                            statusCode: 201,
                            status: true,
                            data: req.body,
                            message: 'berhasil'
                        }
                    );
                });
                await transaction.commit();
            } else {
                res.status(400).send({
                    statusCode: 400,
                    status: false,
                });
                await transaction.rollback();
            }
        } catch (e) {
            res.status(400).send({
                code: 400,
                status: false,
                message: e
            });
        }
    });


router.route('/agenda/:id')
    .put(async (req, res) => {
        let transaction;
        try {
            transaction = await db.sequelize.transaction();
            if (req.files !== null) {
                cover = req.files.cover;
                const typeFile = req.files.cover.mimetype.split('/');
                const timeStamp = new Date();
                const fileName = timeStamp.getTime() + `.${typeFile[1]}`
                uploadPath = path + '/public/uploads/images/' + fileName;
                req.body.cover = 'http://' + req.get('host') + '/uploads/images/' + fileName;
                cover.mv(uploadPath, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            }
            // get transaction
            let update = await db.agendas.update(req.body, { where: { id: req.body.id }, transaction: transaction });
            if (transaction && update[0] !== 0) {
                res.status(200).send(
                    {
                        statusCode: 200,
                        status: true,
                        message: "update successfully!"
                    }
                );
                await transaction.commit();
            } else {
                res.status(400).send({
                    statusCode: 400,
                    status: false,
                    message: `id ${req.body.id} tidak ditemukan`
                });
                await transaction.rollback();
            }
        } catch (err) {
            res.status(400).send({
                statusCode: 400,
                status: false,
                message: err
            });
        }
    });

router.route('/agenda/:id')
    .delete((req, res) => {
        db.sequelize.transaction(async (t) => {
            db.agendas.destroy({
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