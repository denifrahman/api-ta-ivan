var FCM = require('fcm-node')
require('dotenv').config();
module.exports = (req, res) => {
    var serverKey = process.env.PRIVATE_KEY; //put the generated private key path here            
    var fcm = new FCM(serverKey)
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)        
        to: req.body.fcmToken,
        collapse_key: 'your_collapse_key',
        notification: {
            title: req.body.title,
            body: req.body.body
        },
        data: {  //you can send only notification or only data(or include both)            
            route: req.body.route,
            orderNumber: req.body.orderNumber,
            orderId: req.body.orderId,
        }
    }
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
};