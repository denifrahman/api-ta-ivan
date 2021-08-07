"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var authJwt = require('../middleware/authJwt');

var bcrypt = require('bcrypt');

var _require = require('express'),
    query = _require.query;

var IsEmpty = require('../middleware/IsEmpty');

var saltRounds = 10;

var _require2 = require('express-validator'),
    validationResult = _require2.validationResult;

var db = require("../models");

var Op = db.Sequelize.Op;

var _require3 = require('express-validator'),
    check = _require3.check;

var user_agenda = require('../models/user_agenda');

var fcm = require('../middleware/fcm');

var validateCreate = [check('nama').notEmpty().withMessage('nama tidak boleh kosong')]; // find all routes

router.route('/send-notif').get(function _callee2(req, res) {
  var t, user_agenda, oneDay;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(db.sequelize.transaction());

        case 3:
          t = _context2.sent;
          console.log('send-notif');
          _context2.next = 7;
          return regeneratorRuntime.awrap(db.user_agenda.findAll({
            where: {
              count_notif: _defineProperty({}, Op.lte, 3)
            },
            include: [{
              model: db.user
            }, {
              model: db.agendas
            }]
          }, {
            transaction: t
          }));

        case 7:
          user_agenda = _context2.sent;
          oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          // kirim notif satu hari sebelum

          user_agenda.forEach(function _callee(element) {
            var today, tanggal_mulai, diffDays;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    today = new Date();
                    tanggal_mulai = new Date(element.agenda.tanggal_mulai);
                    diffDays = Math.round(Math.round((tanggal_mulai.getTime() - today.getTime()) / oneDay));

                    if (!(diffDays < 2)) {
                      _context.next = 13;
                      break;
                    }

                    req.body.fcmToken = element.user.fcm_token;
                    req.body.title = element.agenda.nama;
                    req.body.body = "Jangan lupa hadir pada event ".concat(element.agenda.nama, " pada ").concat(element.agenda.tanggal_mulai);
                    _context.next = 9;
                    return regeneratorRuntime.awrap(db.user_agenda.update({
                      count_notif: element.count_notif + 1
                    }, {
                      where: {
                        id: element.id
                      },
                      transaction: t
                    }));

                  case 9:
                    _context.next = 11;
                    return regeneratorRuntime.awrap(db.t_notifikasi.create({
                      nama: req.body.title,
                      deskripsi: req.body.body,
                      user_id: element.user.id
                    }, {
                      transaction: t
                    }));

                  case 11:
                    _context.next = 13;
                    return regeneratorRuntime.awrap(fcm(req, res));

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

          if (t) {
            t.commit();
            res.status(200).send({
              statusCode: 200,
              status: true,
              message: "data retreive successfully!"
            });
          } else {
            t.rollback();
            res.status(400).send({
              statusCode: 400,
              status: true,
              message: "data retreive successfully!"
            });
          }

          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          t.rollback();
          res.status(400).send({
            statusCode: 400,
            status: true,
            message: "data retreive successfully!"
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
module.exports = router;