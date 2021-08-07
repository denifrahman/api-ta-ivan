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
const user_agenda = require('../models/user_agenda');
const fcm = require('../middleware/fcm');

const validateCreate = [
    check('nama').notEmpty().withMessage('nama tidak boleh kosong')
];
// find all routes
router.route('/send-notif')
    .get(async (req, res) => {
        // const transaction = await sequelize.transaction();
        try {
            console.log('send-notif');
            let user_agenda = await db.user_agenda.findAll({ where: { count_notif: { [Op.lte]: 3 } }, include: [{ model: db.user }, { model: db.agendas }] });
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            // kirim notif satu hari sebelum
            user_agenda.forEach(async (element) => {
                var today = new Date();
                var tanggal_mulai = new Date(element.agenda.tanggal_mulai);
                var diffDays = Math.round(Math.round((tanggal_mulai.getTime() - today.getTime()) / (oneDay)));
                if (diffDays < 2) {
                    req.body.fcmToken = element.user.fcm_token;
                    req.body.title = element.agenda.nama
                    req.body.body = `Jangan lupa hadir pada event ${element.agenda.nama} pada ${element.agenda.tanggal_mulai}`;
                    await db.user_agenda.update({ count_notif: element.count_notif + 1 }, { where: { id: element.id } });
                    await db.t_notifikasi.create({ nama: req.body.title, deskripsi: req.body.body, user_id: element.user.id });
                    await fcm(req, res);
                }
            });
            if (transaction) {
                res.status(200).send(
                    {
                        statusCode: 200,
                        status: true,
                        message: "data retreive successfully!"
                    }
                );
                // await transaction.commit();
            } else {
                // transaction.rollback();
                res.status(400).send(
                    {
                        statusCode: 400,
                        status: true,
                        message: "data retreive successfully!"
                    }
                );
            }
        } catch (err) {
            // transaction.rollback();
            res.status(400).send(
                {
                    statusCode: 400,
                    status: true,
                    message: "data retreive successfully!"
                }
            );
        }
        // user_agenda.forEach(async (element) => {
        //     var today = new Date();
        //     var tanggal_mulai = new Date(element.agenda.tanggal_mulai);
        //     var ONE_HOUR = 60 * 60 * 1000; /* ms */
        //     console.log('kirim 1 jam sebelum '+ (element.agenda.tanggal_mulai))
        //     if ((today - tanggal_mulai) < ONE_HOUR) {
        //         req.body.fcmToken = element.user.fcm_token;
        //         req.body.title = element.agenda.nama
        //         req.body.body = `Jangan lupa hadir pada event ${element.agenda.nama} pada tanggal ${element.agenda.tanggal_mulai}`;
        //         // await fcm(req, res);
        //     }
        // });

    });

module.exports = router;