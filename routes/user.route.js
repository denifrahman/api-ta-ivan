const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;
const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const { check } = require('express-validator');

const validateRegister = [
    check('password').notEmpty().withMessage('password tidak boleh kosong'),
    check('nama').notEmpty().withMessage('nama tidak boleh kosong'),
    check('email').notEmpty().withMessage('nama tidak boleh kosong'),
    check('alamat').notEmpty().withMessage('alamat tidak boleh kosong'),
    check('role').notEmpty().withMessage('role tidak boleh kosong'),
];
const validateLogin = [
    check('password').notEmpty().withMessage('password tidak boleh kosong'),
    check('username').notEmpty().withMessage('username tidak boleh kosong'),
];

// find all routes
router.route('/login', validateLogin)
    .post((req, res) => {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            console.log(hash);
            db.user.findOne({
                where: { username: req.body.username }
            }).then((auth) => {
                if (auth == null) {
                    res.status(400).send({
                        code: 400,
                        status: false,
                        message: 'user tidak terdaftar'
                    });
                } else {
                    console.log(auth);
                    bcrypt.compare(req.body.password, auth.password).then(function (response) {
                        if (response) {
                            var tokenAccess = jwt.sign(
                                {
                                    tokenAccess: true,
                                    id: auth.id,
                                    username: auth.username,
                                    role: auth.role,
                                    iat: Math.round((new Date()).getTime() / 1000)
                                },
                                'rahasia',
                                { expiresIn: "2d" }
                            );
                            var tokenRefresh = jwt.sign(
                                {
                                    tokenRefresh: true,
                                    id: auth.id,
                                    username: auth.username,
                                    role: auth.role,
                                    iat: Math.round((new Date()).getTime() / 1000)
                                },
                                'rahasia',
                                { expiresIn: "365d" }
                            );
                            res.status(201).send({
                                statusCode: 201,
                                data: {
                                    id: auth.id,
                                    username: auth.username,
                                    role: auth.role,
                                },
                                access_token: tokenAccess,
                            });
                        } else {
                            res.status(401).send({
                                code: 401,
                                status: false,
                                message: 'email dan password tidak valid'
                            });
                        }
                    });
                }
            })
        });
    });
// find all routes
router.route('/users')
    .get((req, res) => {
        db.user.findAll().then((result) => {
            res.status(200).send(
                {
                    code: 200,
                    status: true,
                    data: result,
                    message: "data retreive successfully!"
                }
            );

        }).catch(err => {
            res.status(400).send({
                code: 400,
                status: false,
                message: err
            });
        });
    });

//register
router.route('/register')
    .post(validateRegister, async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                code: 400,
                status: false,
                message: errors.errors
            });
        } else {
            req.body.username = req.body.email;
            bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                req.body.password = hash;
                db.sequelize.transaction(async (t) => {
                    db.user.findOrCreate({
                        where: {
                            username: req.body.username
                        },
                        defaults: req.body
                    }).then(async (result) => {
                        var created = result[1];
                        if (!created) {
                            res.status(400).send({
                                code: 400,
                                status: false,
                                message: `email ${req.body.username} sudah terdaftar`
                            }); // false if user already exists and was not created.

                        } else {
                            res.status(200).send(
                                {
                                    code: 200,
                                    status: true,
                                    data: req.body,
                                    message: "data created successfully!"
                                }
                            );
                        }
                    });
                });
            });
        }
    });

//update
router.route('/user')
    .put((req, res) => {
        db.sequelize.transaction(async (t) => {
            db.user.update(req.body, {
                where: {
                    id: req.body.id
                },
            }).then(async (result) => {
                res.status(200).send(
                    {
                        code: 200,
                        status: true,
                        data: req.body,
                        message: "success"
                    }
                );
            }).catch(async (err) => {
                res.status(400).send({
                    code: 400,
                    status: false,
                    message: 'gagal'
                }); // false if user already exists and was not created.
                await t.rollback();
            });
        });
    });

module.exports = router;
