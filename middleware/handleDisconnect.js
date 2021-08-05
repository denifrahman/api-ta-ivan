const dbConfig = require('../connection/config');
module.exports = (myconnection) => {
    // console.log(myconnection);
    myconnection.on('error', function (err) {

        console.log('\nRe-connecting lost connection: ' + err.stack);
        // db.destroy();

        db = mysql.createPool(dbConfig);
        // db.connect();
    });
}